const Product = require('../model/product');

const showProduct = async (id) => {
	try {
		let product = await Product.findById(id)
		return product
	} catch(e) {
		console.log(e.message)
		throw Error('Error Product')
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
		throw Error('Error Product')
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
		throw Error('Error Product')
	}
}

module.exports = { 
    showProduct,
    postProduct,
    putProduct
 }