const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    store: String // Mağaza bilgisi eklendi
});

module.exports = mongoose.model('Product', productSchema);
