'use strict';

const mongoose = require('mongoose')
const path = require('path');
const fs = require('fs');
const validate = require('validate.js')
const config = require('../config/config')
const { MongoClient } = require('mongodb');
const { ObjectId } = mongoose.Types
const { dbPass, dbName, dbPort, dbUser, dbHost0, dbHost1, dbHost2, dbSsl } = require("../config/config");
const { postProduct, putProduct, showProduct, getProduct } = require('../service/product');
const Product = require('../model/product');

const createProduct = async (req, res) => {
  try {
    let payload = req.body;

    const constraints = {
      name: { presence: true },
      salePrice: { presence: true },
      purchasePrice: { presence: true },
      stock: { presence: true }
    };

    const validation = validate(payload, constraints);

    if (validation) {
      throw new Error(JSON.stringify(validation));
    };

    const existingProduct = await Product.findOne({ name: payload.name });
    if (existingProduct) {
      throw new Error('Product name already in use');
    };

    if (req.file) {
      const imageFormats = ['image/jpeg', 'image/png'];
      const imageMaxSize = 100000; // 100KB

      if (!imageFormats.includes(req.file.mimetype)) {
        throw new Error('Image must be in JPG or PNG format.');
      };

      if (req.file.size > imageMaxSize) {
        throw new Error('Image size must not exceed 100KB.');
      };

      let tmp_path = req.file.path
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
      let filename = req.file.filename + '.' + originalExt
      let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`)

      const src = fs.createReadStream(tmp_path)
      const dest = fs.createWriteStream(target_path)
      src.pipe(dest)

      src.on('end', async () => {
        try {
          const product = await postProduct(payload, filename)
          return res.status(200).json({ status: 200, data: product, message: "Product stored successfully." })
        } catch (e) {
          fs.unlinkSync(target_path)
          return res.status(400).json({ status: 400, message: e.message });
        }
      });
    } else {
      const product = await postProduct(payload);
      return res.status(200).json({ status: 200, data: product, message: 'Product stored successfully.' });
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

const viewPruduct = async (req, res, next) => {	
	let { skip = 0, limit = 50, name = '' } = req.query
	let criteria = {
    isAktif: true,
    isDelete: false,
  }
	let sort = {}

	if (name.length) {
		criteria = {
			...criteria,
			name: {$regex: name, $options: 'i'}
		}
	};

	try {
    const count = await Product.countDocuments(criteria);
		let { product } = await getProduct(criteria, skip, limit, sort )
		return res.status(200).json({ status: 200, totalData: count, data: product, message: "Successfully Get Product" })
	} catch(e) {
		return res.status(400).json({ status: 400, message: e.message });
	}
};

const getProductById = async (req, res) => {
  const { id } = req.params
  try {
    const product = await Product.findById(new ObjectId(id))
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

const viewPruductV1 = async (req, res) => {
  try {
    const nameQuery = req.query.name;
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);
    if (isNaN(skip) || isNaN(limit)) {
      return res.status(400).json({
        message: "Skip and limit are required and must be numbers"
      });
    }

    const query = [
      {
        $match: {
          $and: [
            {
              isDelete: false
            },
            {
              isAktif: true
            },
            nameQuery ? {
              name: {
                $regex: nameQuery,
                $options: 'i'
              }
            } : {},
          ]
        }
      },
      {
        $count: "total"
      }
    ];
    const client = new MongoClient(`mongodb://${dbUser}:${dbPass}@${dbHost0}:${dbPort},${dbHost1}:${dbPort},${dbHost2}:${dbPort}/${dbName}?${dbSsl}`);
    const coll = client.db(dbName).collection("products");
    const aggCursor = coll.aggregate(query);
    const [total] = await aggCursor.toArray();
    await aggCursor.close();

    const dataQuery = [
      ...query.slice(0, -1),
      {
        $skip: skip
      },
      {
        $limit: limit
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ];
    const dataCursor = coll.aggregate(dataQuery);
    const data = await dataCursor.toArray();
    await dataCursor.close();

    return res.status(200).json({
      total: total ? total.total : 0,
      data
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    let payload = req.body;
    let { id } = req.params;
    let product = {};

    const existingProduct = await Product.findOne({ name: payload.name });
    if (existingProduct) {
      throw new Error('Product name already in use');
    };

    if (req.file) {
      const imageFormats = ['image/jpeg', 'image/png'];
      const imageMaxSize = 100000; // 100KB

      if (!imageFormats.includes(req.file.mimetype)) {
        throw new Error('Image must be in JPG or PNG format.');
      };

      if (req.file.size > imageMaxSize) {
        throw new Error('Image size must not exceed 100KB.');
      };
      
      let tmp_path = req.file.path
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
      let filename = req.file.filename + '.' + originalExt
      let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`)

      const src = fs.createReadStream(tmp_path)
      const dest = fs.createWriteStream(target_path)
      src.pipe(dest)

      src.on('end', async () => {
        try {
          product = await showProduct(id)

          let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage)
          }

          product = await putProduct(id, payload, filename)
          return res.status(200).json({ status: 200, data: product, message: "Succesfully Product Updated" })

        } catch (e) {
          fs.unlinkSync(target_path)
          return res.status(400).json({ status: 400, message: e.message });
        }
      })
    } else {
      try {
        let product = await putProduct(id, payload)
        return res.status(200).json({ status: 200, data: product, message: "Succesfully Product Updated" })
      } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
      }

    }
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = {
      isDelete: true,
      isAktif: false
    };

    const result = await Product.findOneAndUpdate({ _id: id }, updateData);

    if (!result) {
      const error = new Error('Data not found');
      error.status = 404;
      throw error;
    }
    return res.status(200).json({
      status: "success",
      message: `Berhasil Menghapus data ${result.name}`
    })
  } catch (error) {
    return res.status(404).json({
      message: error.message || "Internal server error"
    })
  }
};

module.exports = {
  viewPruduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById
}