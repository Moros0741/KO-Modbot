const { MessageEmbed } = require('discord.js')
const helper = require('../modules/helpers')
const guildSchema = require('../models/guildSchema')

module.exports = {
    name: "channelCreate",
    once: false,
    async execute(channel) {
        let guildProfile = await guildSchema.findOne({'guildID': channel.guild.id})

        if (!guildProfile.logging.serverUpdates.active === true) return;
        let logChannel = channel.guild.channels.cache.find(channel => channel.id === guildProfile.logging.serverUpdates.channel)
       
        if (channel.isText()) {
            let channelEmbed = new MessageEmbed()
                .setTitle('Text Channel Created')
                .setColor('GREEN')
                .addField('Channel', channel.toString(), true)
                .addField('\u200b', '\u200b', true)
                .addField('Category', channel.parent.name, true)
                .setTimestamp(Date.now())
            
            await logChannel.send({embeds: [channelEmbed]})


        
        } else if (channel.isVoice()) {
            let voiceEmbed = new MessageEmbed()
                .setTitle('Voice Channel Created')
                .setColor('GREEN')
                .addField("Name", channel.name, true)
                .addField('\u200b', '\u200b', true)
                .addField('Category', channel.parent.name, true)
                .setTimestamp(Date.now())
            
            await logChannel.send({embeds: [voiceEmbed]})

        }

    },
};