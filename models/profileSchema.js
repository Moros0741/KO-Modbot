const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    userID: {type: String, require: true, unique: true},
    serverID: {type: String, require: true},
    joinedOn: {type: String},
    nickname: {type: String},
    isAfk: {type: Boolean, default: false},
    afkTime: {type: String},
    afkMessage: {type: String},
    warnings: {type: Array, default: undefined},
    mutes: {type: Array, default: undefined}
});

const model = mongoose.model("Profiles", profileSchema);

module.exports = model;