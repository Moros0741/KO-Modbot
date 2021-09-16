const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userID: {type: Number, unique: true, require: true},
    nickname: {type: String},
    isAFK: {type: Boolean, default: false},
    status: {type: String, default: "Compliant"},
    warnings: [{inputType: String, date: Date, caseNo: Number, reason: String, moderator: Number}],
    mutes: [{inputType: String, date: Date, caseNo: Number, reason: String, moderator: String, moderatorID: String, duration: Number, active: {type: Boolean, default: true}}],
    kicks: [{inputType: String, date: Date, caseNo: Number, reason: String, moderator: String, moderatorID: String}],
    bans: [{inputType: String, date: Date, caseNo: Number, reason: String, moderator: String, moderatorID: String}],
    tempBans: [{inputType: String, date: Date, caseNo: Number, reason: String, moderator: String, moderatorID: String, duration: Number, active: {type: Boolean, default: true}}],
    notes: [{date: Date, noteID: Number, note: String, moderator: String, moderatorID: String}],
    active: {type: Boolean, default: true}
});

const model = new mongoose.model("Users", userSchema)

module.exports = model