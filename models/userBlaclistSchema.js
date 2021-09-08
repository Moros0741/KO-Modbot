const mongoose = require('mongoose')

const userBlacklistSchema = new mongoose.Schema({
    userID: {type: Number, unique: true, require: true},
    date: {type: Date, default: Date.UTC},
    reason: {body: String},
    duration: Number
});

const model = mongoose.model("userBlacklist", userBlacklistSchema)

module.exports = model