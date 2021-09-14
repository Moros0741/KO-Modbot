const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
    channelID: {type: Number, unique: true, require: true},
    channelType: {type: String, require: true},
    channelName: {type: String},
    channelCategory: {type: Number},
    creator: {type: String, require: true},
    creatorID: {type: Number, require: true},
    createdDate: {type: Date, default: Date.UTC()}
});

const model = new mongoose.model('Tickets', ticketSchema)

module.exports = model

