const mongoose = require('mongoose')
const systemSchema = require('./systemSchema')
const userSchema = require('./userBlaclistSchema')

const guildSchema = new mongoose.Schema({
    guildID: {type: String, require: true, unique: true},
    userBlacklist: [userSchema],
    systems: [systemSchema],
});

const model = mongoose.model("guilds", guildSchema)

module.exports = model