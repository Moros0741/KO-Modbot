const { MessageEmbed } = require("discord.js");
const guildSchema = require('../models/guildSchema')


module.exports = {
    name: "channelDelete",
    once: false,
    async execute(channel) {
        let guildProfile = await guildSchema.findOne({"guildID": channel.guild.id})

        if (!guildProfile.logging.serverUpdates.active === true) return;
        let logChannel = await channel.guild.channels.cache.find(c => c.id === guildProfile.logging.serverUpdates.channel)
        
        if (channel.isText()) {
            let textEmbed = new MessageEmbed()
                .setTitle("Text Channel Deleted")
                .setColor('RED')
                .addField("Name", channel.name, true)
                .addField('\u200b', '\u200b', true)
                .addField('Category', channel.parent.name, true)
                .setTimestamp(Date.now())
            
            await logChannel.send({embeds: [textEmbed]})
        
        } else if (channel.isVoice()) {
            let voiceEmbed = new MessageEmbed()
                .setTitle("Voice Channel Deleted")
                .setColor('RED')
                .setTimestamp(Date.now())
                .addField('Name', channel.name, true)
                .addField('\u200b', '\u200b', true)
                .addField("Category", channel.parent.name, true)

            await logChannel.send({embeds: [voiceEmbed]})
        }
    },
};