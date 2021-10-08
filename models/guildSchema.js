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
            links: [],
        },
        autoRoles: {
            active: {type: Boolean, default: false},
            roles: [{roleID: String}],
        },
        wordsFilter: {
            active: {type: Boolean, default: false},
            words: {type: Array},
            channels: {type: Array},
        },
        nicknames: {
            active: {type: Boolean, default: false},
            gateChannel: {type: String},
            requests: [{userID: String, messageID: String, nickname: String}]
        },
        antiAlt: {
            active: {type: Boolean, default: false},
            ageThreshold: {type: Number, default: 3},
            checkAvatar: {type: Boolean, default: false},
            action: {type: String, default: "warn"},
        },
        tickets: {
            ticketIDS: [],
            types: {
                partnerships: {
                    category: String,
                    allowRoles: [],
                    denyRoles: []
                },
                support: {
                    category: String,
                    allowRoles: [],
                    denyRoles: []
                },
                secureChannel: {
                    category: String,
                    allowRoles: [],
                    denyRoles: []
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
    },
    logging: {
        active: {type: Boolean, default: false},
        modLog: {active: {type: Boolean, default: false}, channel: String},
        serverUpdates: {active: {type: Boolean, default: false}, channel: String},
        memberUpdates: {active: {type: Boolean, default: false}, channel: String},
        joinLogs: {active: {type: Boolean, default: false}, channel: String},
        leaveLogs: {active: {type: Boolean, default: false}, channel: String},
        ticketLogs: {active: {type: Boolean, default: false}, channel: String}
    }
});

const model = mongoose.model('Guilds', guildSchema)

module.exports = model
