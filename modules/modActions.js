const {MessageEmbed, Message, Interaction } = require('discord.js')
const userSchema = require('../models/userSchema')
const helper = require('../modules/helpers')

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
    if (guildProfile.system.modLog.active === true) {
        try {
            let channel = guild.channels.fetch(guildProfile.systems.modLog.channelID)
            let embed = new MessageEmbed()
                .setTitle("A Member was Warned!")
                .setDescription(`**Case Number:** \`${caseNumber}\` \n**Member:** ${member.toString()} (${member.id}) \n**Moderator:** ${moderator.toString()} (${moderator.id}) \n**Reason:** *${reason}*`)
                .setTimestamp(Date.UTC())
                .setColor('GOLD')
                .setThumbnail(member.user.avatarURL({dynamic: true}))
            
            await channel.send({embeds: [embed]})
        } catch (err) {
            console.error(err)
        }
    }
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
    if (guildProfile.system.modLog.active === true) {
        try {
            let channel = guild.channels.fetch(guildProfile.systems.modLog.channelID)
            let embed = new MessageEmbed()
                .setTitle("A Member was Muted!")
                .setDescription(`**Case Number:** \`${caseNumber}\` \n**Member:** ${member.toString()} (${member.id}) \n**Moderator:** ${moderator.toString()} (${moderator.id}) \n**Reason:** *${reason}*`)
                .setTimestamp(Date.UTC())
                .setColor('GOLD')
                .setThumbnail(member.user.avatarURL({dynamic: true}))
            
            await channel.send({embeds: [embed]})
        } catch (err) {
            console.error(err)
        }
    }
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

    try {
        if (guildProfile.systems.modLog.active === true) {
            let channel = guild.channels.cache.find(channel => channel.id === guildProfile.systems.modLog.channelID)
            try {
                await channel.send({embeds: [kickMessage]})
            } catch (err) {
                console.error(err)
            }
        } 
    } catch (err) {
        console.error(err)
    }
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

    let banMessage = new MessageEmbed()
        .setTitle("A Member was Banned!")
        .setDescription(`**Case Number:** ${caseNumber} \n**Member:** ${member.toString()} (${member.id}) \n**Moderator:** ${moderator.toString()} (${moderator.id}) \b**Reason:** *${reason}*`)
        .setThumbnail(member.user.avatarURL({dynamic: true}))
        .setColor('DARK_RED')
    
    try {
        if (guildProfile.systems.modLog.active === true) {
            let channel = guild.channels.cache.find(channel => channel.id === guildProfile.systems.modLog.channelID)

            await channel.send({embeds: [banMessage]})
        } 
    } catch(err) {
        console.error(err)
    }
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

    let tempBanMessage = new MessageEmbed()
        .setTitle('A Member was TempBanned!')
        .setDescription(`**Case Number:** \`${caseNumber}\` \n**Member:** ${member.toString()} (${member.id}) \n**Moderator:** ${moderator.toString()} (${moderator.id}) \n**Reason:** *${reason}*`)
        .setThumbnail(member.user.avatarURL({dynamic: true}))
        .setColor('RED')
        .setTimestamp(Date.UTC())
    
    try {
        if (guildProfile.systems.modLog.active === true) {
            let channel = guild.channels.cache.find(channel => channel.id === guildProfile.systems.modLog.channelID)

            await channel.send({embeds: [tempBanMessage]})
        }
    } catch (err) {
        console.error(err)
    }
    try {
        await member.ban({reason: `${moderator.user.tag} - ${reason}`})
    } catch (err) {
        console.error(err)
    }
};