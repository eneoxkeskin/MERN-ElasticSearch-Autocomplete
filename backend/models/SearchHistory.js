const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
    term: { type: String, required: true },
    count: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
