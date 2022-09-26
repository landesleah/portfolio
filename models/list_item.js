const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    qty: {
        type: String,
        default: 1,
        min: 1
    },
    store: {
        type: String,
        enum: ['Target', 'Aldi', 'Kroger', 'Asian Market'],
        default: 'Aldi'
    },
    priority: {
        type: String,
        lowercase: true,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    }
})

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;