const { MessageEmbed } = require('discord.js')
const guildSchema = require('../models/guildSchema')
const userSchema = require('../models/userSchema')
const helper = require('../modules/helpers')

module.exports = {
    name: "guildMemberUpdate",
    once: false,
    async execute(oldMember, newMember) {
        let guildProfile = await guildSchema.findOne({"guildID": oldMember.guild.id})

        if (!guildProfile.logging.memberUpdates.active === true) return; 
        
        let userProfile = await userSchema.findOne({"userID": oldMember.id})
        let channel = await oldMember.guild.channels.fetch(guildProfile.logging.memberUpdates.channel)
        
        // Checking for change to Member's Nickname
        if (oldMember.nickname != newMember.nickname) {
            let nickChangeEmbed = new MessageEmbed()
                .setTitle("Nickname Change")
                .setThumbnail(newMember.user.avatarURL({dynamic: true}))
                .addField("Previous", oldMember.nickname || "None", true)
                .addField('\u200b', '=>', true)
                .addField('New', newMember.nickname || "None", true)
                .setColor('GOLD')
            
            await channel.send({embeds: [nickChangeEmbed]})

            try {
                userProfile.nickname = newMember.nickname
                userProfile.save();
            } catch (err) {
                console.error(err)
            }
        }
    
        // Checking for changes to Member's Roles
        if (oldMember._roles != newMember._roles) {
            oldRoles = oldMember._roles
            newRoles = newMember._roles
            if (oldRoles.length > newRoles.length) {
                let difference = helper.getDifference(oldRoles, newRoles)
                let embed = new MessageEmbed()
                    .setTitle('Role Removed')
                    .setThumbnail(newMember.user.avatarURL({dynamic: true}))
                    .addField("Member", `${newMember.toString()} \n ${newMember.user.tag}`, true)
                    .addField('\u200b', '\u200b', true)
                    .addField('Role', `<:redTick:892539578706198589> <@&${difference}>`, true)
                    .setFooter(`MemberID: ${newMember.id}`)
                    .setColor('RED')
                
                await channel.send({embeds: [embed]})
        
            } else if (oldRoles.length < newRoles.length) {
                let difference = helper.getDifference(newRoles, oldRoles)
                let embed = new MessageEmbed()
                    .setTitle('Role Added')
                    .setThumbnail(newMember.user.avatarURL({dynamic: true}))
                    .addField('Member', `${newMember.toString()} \n ${newMember.user.tag}`, true)
                    .addField('\u200b', '\u200b', true)
                    .addField('Role', `<:greenTick:892539578534228018> <@&${difference}>`, true)
                    .setFooter(`MemberID: ${newMember.id}`)
                    .setColor('GREEN')

                await channel.send({embeds: [embed]})
            }
        }
    },
};