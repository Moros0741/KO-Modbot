const {MessageEmbed, Message, Interaction } = require('discord.js')
const userSchema = require('../models/userSchema')
const helper = require('../modules/helpers')

async function sendModLog(guildProfile, guild, embed) {
    try {
        let channelID = guildProfile.logging.modLog
        if (!channelID) return;

        let channel = guild.channels.cache.find(channel => channel.id === channelID)

        await channel.send({embeds: [embed]})
    } catch (err) {
        console.error(err)
    }
}

async function getProfile(member) {
    let userProfile;
    try{
        profile = await userSchema.findOne({userID: member.id})
        if (!profile) {
            let newProfile = new userSchema({
                userID: member.id
            });
            newProfile.save()
            userProfile = newProfile
        }
        userProfile = profile
    } catch(err) {
        console.error(err)
    }
    return userProfile
};

exports.warnMember = async function (guild, guildProfile, member, reason, moderator) {
    let caseNumber = helper.getCaseNumber(guildProfile)
    let userProfile = await getProfile(member.id);
    try {
        userProfile.warns.push({
            date: Date.UTC(),
            caseNo: caseNumber,
            reason: reason,
            moderator: moderator,
            moderatorID: moderator.id
        });
        userProfile.save()
    } catch (err) {
        console.error(err)
    }
    
    let warnEmbed = new MessageEmbed()
        .setTitle("A Member was Warned!")
        .setDescription(`**Case Number:** \`${caseNumber}\` \n**Member:** ${member.toString()} (${member.id}) \n**Moderator:** ${moderator.toString()} (${moderator.id}) \n**Reason:** *${reason}*`)
        .setTimestamp(Date.UTC())
        .setColor('GOLD')
        .setThumbnail(member.user.avatarURL({dynamic: true}))
    
    await sendModLog(guildProfile, guild, warnEmbed)
};

exports.muteMember = async function (guild, guildProfile, member, reason, duration, moderator) {
    let caseNumber = helper.getCaseNumber(guildProfile)
    let userProfile = await getProfile(member.id);
    let timeSeconds = helper.getSeconds(duration)
    let role;
    try{
        muteRole = guild.roles.fetch(guildProfile.mutes.roleID)
        if (!muteRole) {
            let mRole = guild.roles.cache.find(role => role.name === 'Muted' || role.name === 'muted' || role.name === 'Mute')
            role = mRole
        } else {
            role = muteRole
        }
    } catch (error) {
        console.error(error)
    }
    try {
        userProfile.mutes.push({
            date: Date.UTC(),
            caseNo: caseNumber,
            reason: reason,
            moderator: moderator,
            moderatorID: moderator.id,
            duration: timeSeconds
        });
        userProfile.save()
    } catch (err) {
        console.error(err)
    }

    let muteEmbed = new MessageEmbed()
        .setTitle("A Member was Muted!")
        .setDescription(`**Case Number:** \`${caseNumber}\` \n**Member:** ${member.toString()} (${member.id}) \n**Moderator:** ${moderator.toString()} (${moderator.id}) \n**Reason:** *${reason}*`)
        .setTimestamp(Date.UTC())
        .setColor('GOLD')
        .setThumbnail(member.user.avatarURL({dynamic: true}))
    
    await sendModLog(guildProfile, guild, muteEmbed)
            
    try {
        await member.roles.add(role, [`Muted by ${moderator.user.tag}`]);
    } catch (err) {
        console.error(err)
    }
};

exports.kickMember = async function (guild, guildProfile, member, reason, moderator) {
    let caseNumber = helper.getCaseNumber(guildProfile)
    let userProfile = await getProfile(member.id)
    
    userProfile.kicks.push({
        date: Date.UTC(),
        caseNo: caseNumber,
        reason: reason,
        moderator: moderator.displayName,
        moderatorID: moderator.id
    });
    userProfile.save();

    let kickMessage = new MessageEmbed()
        .setTitle('A Member was Kicked!')
        .setDescription(`**Case Number:** \`${caseNumber}\` \n**Member:** ${member.toString()} (${member.id}) \n**Moderator:** ${moderator.toString()} (${moderator.id}) \n **Reason:** *${reason}*`)       
        .setThumbnail(member.user.avatarURL({dynamic: true}))
        .setColor('ORANGE')
        .setTimestamp(Date.UTC())

    await sendModLog(guildProfile, guild, kickEmbed)

    try {
        await member.kick(`${moderator.user.tag} - ${reason}`)
    } catch (err) {
        console.error(err)
    }
};

exports.banMember = async function (guild, guildProfile, member, reason, moderator) {
    let caseNumber = helper.getCaseNumber(guildProfile)
    let userProfile = await getProfile(member.id)
    try {
        userProfile.bans.push({
            date: Date.UTC(),
            caseNo: caseNumber,
            reason: reason,
            moderator: moderator.displayName,
            moderatorID: moderator.id
        });
        userProfile.save()
    } catch (err) {
        console.error(err)
    };

    let banEmbed = new MessageEmbed()
        .setTitle("A Member was Banned!")
        .setDescription(`**Case Number:** ${caseNumber} \n**Member:** ${member.toString()} (${member.id}) \n**Moderator:** ${moderator.toString()} (${moderator.id}) \b**Reason:** *${reason}*`)
        .setThumbnail(member.user.avatarURL({dynamic: true}))
        .setColor('DARK_RED')
    
    await sendModLog(guildProfile, guild, banEmbed)

    try {
        await member.ban(`${moderator.user.tag} - ${reason}`)
    } catch (err) {
        console.error(err)
    }
};

exports.memberTempBan = async function (guild, guildProfile, member, reason, moderator, duration) {
    let caseNumber = helper.getCaseNumber(guildProfile)
    let userProfile = await getProfile(member.id);
    let timeSeconds = helper.getSeconds(duration)

    try {
        userProfile.tempBans.push({
            date: Date.UTC(),
            caseNo: caseNumber,
            reason: reason,
            moderator: moderator.displayName,
            moderatorID: moderator.id,
            duration: timeSeconds
        });
        userProfile.save();
    } catch (err) {
        console.error(err)
    }

    let tempBanEmbed = new MessageEmbed()
        .setTitle('A Member was TempBanned!')
        .setDescription(`**Case Number:** \`${caseNumber}\` \n**Member:** ${member.toString()} (${member.id}) \n**Moderator:** ${moderator.toString()} (${moderator.id}) \n**Reason:** *${reason}*`)
        .setThumbnail(member.user.avatarURL({dynamic: true}))
        .setColor('RED')
        .setTimestamp(Date.UTC())
    
    await sendModLog(guildProfile, guild, tempBanEmbed)

    try {
        await member.ban({reason: `${moderator.user.tag} - ${reason}`})
    } catch (err) {
        console.error(err)
    }
};