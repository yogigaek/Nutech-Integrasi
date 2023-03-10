const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Field name is required'],
    minLength: 3,
    maxLength: 100,
  },
  description: {
    type: String,
    maxlength: [1000, 'Panjang nama product maximal 1000 karakter'],
  },
  salePrice: {
    type: Number,
    default: 0
  },
  purchasePrice: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
  },
  image_url: String,
  isAktif: {
    type: Boolean,
    default: true
  },
  isDelete: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
