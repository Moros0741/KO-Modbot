const guildSchema = require('../models/guildSchema')
const { MessageEmbed } = require('discord.js')
const helper = require('../modules/helpers')

module.exports = {
    name: "threadCreate",
    once: false,
    async execute(thread) {
        let guildProfile = await guildSchema.findOne({"guildID": thread.guild.id})

        if (!guildProfile.logging.serverUpdates.active === true) return;
        let logChannel = thread.guild.channels.cache.find(channel => channel.id === guildProfile.logging.serverUpdates.channel)

        let threadEmbed = new MessageEmbed()
            .setTitle("Thread Created")
            .setColor('GOLD')
            .addField('Name', thread.name, true)
            .addField('\u200b', '\u200b', true)
            .addField('Owner', `<@${thread.ownerId}>`, true)
            .addField('Parent Channel', thread.parent.toString(), true)
            .addField("\u200b", '\u200b', true)
            .addField('Thread Type', thread.type.substr(6,).replace("_", ' ').toLowerCase(), true)
            .setTimestamp(Date.now())
            
        await logChannel.send({embeds: [threadEmbed]})
        await thread.members.add(thread.guild.me.id)
    },
};