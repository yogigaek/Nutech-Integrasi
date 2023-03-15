const Product = require('../model/product');

const getProduct = async (criteria, skip, limit) => {
	try {
		const count = await Product.find().countDocuments()
		const product = await Product.find(criteria).skip(parseInt(skip)).limit(parseInt(limit)).sort({createdAt: -1})
		return data = {product, count}
	} catch(e) {
		console.log(e.message)
		throw Error(e.message)
	}
}

const showProduct = async (id) => {
	try {
		let product = await Product.findById(id)
		return product
	} catch(e) {
		console.log(e.message)
		throw Error(e.message)
	}
};

const postProduct = async (payload, filename) => {
	try {
		let product = {}
		if (filename) {
			product = new Product({
				...payload,
				image_url: filename
			})	
		} else {
			product = new Product(payload)
		}
		await product.save()
		return product
	} catch(e) {
		console.log(e.message)
		throw Error(e.message)
	}
};

const putProduct = async (id, payload, filename) => {
	try {
		let product = {}
		if (filename) {
			product = await Product.findByIdAndUpdate(id, {
				...payload,
				image_url: filename
			}, { new: true, runValidators: true })	
		} else {
			product = await Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
		}
		return product
	} catch(e) {
		console.log(e.message+'db')
		throw Error(e.message)
	}
}

module.exports = { 
	getProduct,
    showProduct,
    postProduct,
    putProduct
 }