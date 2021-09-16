const userSchema = require('../models/userSchema')
const modHelper = require('../modules/modActions')
const helper = require('../modules/helpers')

async function takeAction(member, dataInfo, guildProfile, reason) {
    let profile = await userSchema.findOne({userID: member.id})
    if (!profile) {
        let newProfile = new userSchema({
            userID: member.id
        });
        newProfile.save();
        await modHelper.warnMember(member.guild, guildProfile, member, reason, member.guild.me.user.tag)
    } else {
        let w = await profile.warns.findMany({inputType: "AutoMod"})
        let m = await profile.mutes.findMany({inputType: "AutoMod"})
        let k = await profile.kicks.findMany({inputType: "Automod"})
        if (w.length < 3) {
            await modHelper.warnMember(message.guild, guildProfile, member, reason, member.guild.me.user.tag)
        } else if (w.length > 3 && m.length < 3) {
            let duration = helper.getDuration(m.length)
            await modHelper.muteMember(message.guild, guildProfile, member, reason, duration, message.guild.me.user.tag)
        }
    }
}

exports.checkBadWords = async function(message, guildProfile) {
    let channelCensor = guildProfile.systems.wordsFilter
    let badWords;
    let wordChannels;
    if (channelCensor.words < 1 || channelCensor.channels < 1) {
        return;
    } else if (channelCensor.channels > 0 && channelCensor.words > 0) {
        badWords = channelCensor.words
        wordChannels = channelCensor.channels
    }
    if (wordChannels.includes(message.channel.id)) {
        let word = badWords.find(v => message.content.includes(v));
        if (!word === undefined) {
            let reason = `Usage of a censored word`
            await takeAction(message.author, word, guildProfile, reason)
        }
    }
};

exports.checkbadLinks = async function(message, guildProfile) {
    let channelCensor = guildProfile.systems.wordsFilter
    let badLinks
    let wordChannels;
    if (channelCensor.words < 1 || channelCensor.channels < 1) {
        return;
    } else if (channelCensor.channels > 0 && channelCensor.words > 0) {
        badWords = channelCensor.words
        wordChannels = channelCensor.channels
    }
    if (wordChannels.includes(message.channel.id)) {
        let word = badWords.find(v => message.content.includes(v));
        if (!word === undefined) {
            let reason = `Links are not allowed. (${word})`
            await takeAction(message.author, word, guildProfile, reason)
        }
    }
}