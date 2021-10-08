const guildSchema = require('../models/guildSchema')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "threadDelete",
    once: false,
    async execute(thread) {
        let guildProfile = await guildSchema.findOne({'guildID': thread.guild.id})

        if (!guildProfile.logging.serverUpdates.active === true) return;
        let logChannel = thread.guild.channels.cache.find(channel => channel.id === guildProfile.logging.serverUpdates.channel)

        let threadEmbed = new MessageEmbed()
            .setTitle("Thread Deleted")
            .setColor('ORANGE')
            .addField('Name', thread.name, true)
            .addField('\u200b', '\u200b', true)
            .addField('Created By', `<@${thread.ownerId}>`, true)
            .addField('Parent Channel', thread.parent.toString(), false)
            .addField('\u200b', '\u200b', true)
            .addField('Thread Type', thread.type.substr(6, ).replace("_", " ").toLowerCase(), true)
            .setTimestamp(Date.now())
        
        await logChannel.send({embeds: [threadEmbed]})
    },
};