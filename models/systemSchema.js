const mongoose = require('mongoose')

const systemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    channel: Number,
    active: {type: Boolean, default: false},
});

const model = mongoose.model("System", systemSchema)

module.exports = model