const { MessageEmbed } = require('discord.js');
const guildSchema = require('../models/guildSchema');
const userSchema = require('../models/userSchema');
const modHelper = require('../modules/modActions');
const helper = require('../modules/helpers');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member) {
        let guildProfile = await guildSchema.findOne({"guildID": member.guild.id});

        if (!guildProfile.logging.joinLogs.active === true) return;

        let age = helper.getDateDifference(member.createdAt);
        
        // creating new user profile OR marking user Active again
        try {
            let user = await userSchema.findOne({"userID": member.id})
            if (!user) {
                let newUser = new userSchema({
                    userID: member.id
                });
                newUser.save();
            } else {
                user.active = true
                user.save();
            }
        } catch (err) {
            console.error(err)
        }
        
        // Adding Roles to new Member
        try {
            if (guildProfile.systems.autoRoles.active === true) {
                roles = []
                for (role of guildProfile.systems.autoRoles.roles) {
                    let roleOBJ = member.guild.roles.cache.find(r => r.id === role)
                    roles.push(roleOBJ)
                };
                await member.roles.add(roles)
            }
        } catch (err) {
            console.error(err)
        }

        // Anti-Alt System, Checking account age against server set threshold
        try {

            if (guildProfile.systems.antiAlt.active === true) {
                if (age < guildProfile.systems.antiAlt.threshold) {
                    await modHelper.banMember(member.guild, guildProfile, member, `ANTI-ALT: Account age (\`${age} days old.\`) below server threshold of: \`${thresh}\` days old.`)
                }
            }
        } catch (err) {
            console.error(err)
        }

        // Checking if Ban-lock OR Kick-lock is enabled. If so, taking action
        try {
            const protections = guildProfile.protectionSystems
            if (protections.banLock.active === true) {
                await modHelper.banMember(member.guild, guildProfile, member, "SERVER PROTECTION: Ban-lock is enabled for the server. This is usually because of a security breach.")
            
            } else if (protections.kickLock.active === true) {
                await modHelper.kickMember(member.guild, guildProfile, member, "SERVER PROTECTION: Kick-lock is enabled for this server. The is usually because of a security Breach. ")
            }
        } catch (err) {
            console.error(err)
        }

        // Sending New Member Message to Join Logs.
        try {
            let channel = member.guild.channels.cache.find(channel => channel.id === guildProfile.logging.joinLogs)

            let newMemberEmbed = new MessageEmbed()
                .setTitle("Member has Joined!")
                .setThumbnail(member.user.avatarURL({dynamic: true}))
                .addField("User", `${member.user.tag} \n ${member.id}`, true)
                .addField('\u200b', '\u200b', true)
                .addField("Created", `${member.user.createdAt} \n \`${age}\` days old.`, true)
                .setFooter(`Member Count: ${helper.formatNumber(member.guild.memberCount)}`, member.guild.iconURL({dynamic: true}))
            
            await channel.send({embeds: [newMemberEmbed]})
        } catch (err) {
            console.error(err)
        }
    },
};