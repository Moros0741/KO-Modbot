const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
    ticketID: Number,
    isActive: {type: Boolean, default: true},
    channelID: String,
    ticketType: String,
    channelName: String,
    creator: String,
    creatorID: String,
    createdDate: {type: Date, default: Date.now()},
    logs: [{
        messageID: String,
        status: String,
        author: String, 
        authorID: String, 
        content: String,
        timeStamp: String, 
        attachments: []
    }],
    closedOn: Date,
    closedBy: String,
    closedReason: String
});

const model = new mongoose.model('Tickets', ticketSchema)

module.exports = model

