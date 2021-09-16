const mongoose = require('mongoose')

const guildSchema = new mongoose.Schema({
    guildID: {type: String, unique: true, require: true},
    caseNumbers: [{caseNo: {type: Number}}],
    systems: {
        active: {type: Boolean, default: false},
        mutes: {
            roleID: String,
            defaultTime: {type: Number, default: 300}
        },
        invites: {
            active: {type: Boolean, default: false},
            channels: [{channelID: String}],
            links: [{url: String}],
            logChannel: {type: String}
        },
        autoRoles: {
            active: {type: Boolean, default: false},
            roles: [{roleID: String}],
            logChannel: {type: String},
        },
        wordsFilter: {
            active: {type: Boolean, default: false},
            words: {type: Array},
            channels: {type: Array},
            logChannel: {type: String}
        },
        nicknames: {
            active: {type: Boolean, default: false},
            logChannel: {type: String},
            gateChannel: {type: String},
            requests: [{userID: String, messageID: String, nickname: String}]
        },
        antiAlt: {
            active: {type: Boolean, default: false},
            ageThreshold: {type: Number, default: 3},
            checkAvatar: {type: Boolean, default: false},
            action: {type: String, default: "warn"},
            logChannel: {type: String}
        },
        modLog: {
            active: {type: Boolean, default: false},
            logChannel: {type: String}
        },
        tickets: {
            active: {type: Boolean, default: false},
            types: {
                partnerships: {
                    channelID: {type: Number},
                    title: {type: String, default: "Partnership Submissions"},
                    message: {type: String, default: "Press the button below to open a ***Partnership Ticket***."},
                    roles: [{roleID: String}],
                    category: {type: String}
                },
                support: {
                    channelID: {type: String},
                    title: {type: String, default: "Support Tickets"},
                    message: {type: String, default: "Press the button below to open a ***Support Ticket***."},
                    roles: {type: Array, default: undefined},
                    category: {type: String}
                },
                secureChannel: {
                    channelID: {type: String},
                    title: {type: String, default: "Secure Channels"},
                    message: {type: String, default: "Press the button below to open a ***Secure Channel***"},
                    roles: {type: Array, default: undefined},
                    category: {type: String}
                }
            }
        }
    },
    protectionSystems: {
        banLock: {
            active: {type: Boolean, default: false},
            sendDM: {type: Boolean, default: false},
            message: {type: String, default: "This server has ban-lock Enabled. They are either experiencing a raid or are expecting to experience a raid. Please try again later. Thanks!"},
            logChannel: {type: String}
        },
        kickLock: {
            active: {type: Boolean, default: false},
            sendDM: {type: Boolean, default: false},
            message: {type: String, default: "This Server has kick-lock Enabled. They are either experienceing a raid or are expecting to experience a raid. Please try again later. Thanks!"},
            logChannel: {type: String}
        },
        serverLock: {
            active: {type: Boolean, default: false},
            lockRole: {type: String},
            channels: [{channelID: String}],
            systemChannel: {
                active: {type: Boolean, default: false},
                channelID: {type: String},
                message: {type: String, default: "Server has been locked down, Please use this channel until further notice. Thanks!"}
            }
        }
    },
    staffRoles: {
        general: {type: String},
        partnerManager: {type: String},
        trialMod: {type: String},
        mod: {type: String},
        admin: {type: String},
        botMaster: {type: String},
    }
});

const model = mongoose.model('Guilds', guildSchema)

module.exports = model
