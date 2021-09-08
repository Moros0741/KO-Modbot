const profileSchema = require("../models/profileSchema")
const guildProfile = require('../models/guildSchema')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "guildMemberAdd",
    on: true,
    async execute(client, member) {
        let guildData = await guildProfile.findOne({guildID: member.guild.id})
        let system = guildData.systems.find({name: "Join/Leave"});
        let profile; 
        try {
            profile = await profileSchema.findOne({userid: member.user.id})
            if (!profile) {
                let newProfile = await profileSchema.create({
                userID: member.id,
                serverID: member.guild.id,
                balance: 0
                });
                newProfile.save();
                console.log(`${member.tag} (${member.id}) - added to Knight-Owl/KOMod/Profiles Database`)
                return profile = newProfile
            }
        } catch(err) {
            console.error(err.message)
        }
        let joined = new MessageEmbed()
            .setTitle("A New Member has been spotted!")
            .setColor(member.guild.me.displayHexColor)
            .setThumbnail(member.user.avatarURL({dynamic: true}))
            .addField("Name & ID", `${member.displayName} \n${member.user.tag} \nID: ${member.user.id}`, true)
            .addField("\u200b", "\u200b", true)
            .addField("Joined Discord", member.createdTimstamp, true)
            .addField('Database Info', `Warnings: \`${profile.warnings.length}\` \nMutes: ${profile.mutes.length}`, true)
        let channel;
        try {
            for (system of guildData.systems) {
                if (system.name === 'join/leave'){
                    channel = system.channel
                    try{
                        await channel.send({embeds: [joined]})
                    } catch(err) {
                        console.error(err.message)
                    }
                }
            }
        } catch(err) {
            console.error(err.message)
        }
    },
};