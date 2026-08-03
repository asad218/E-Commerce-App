const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
}, { timestamps: true })

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
