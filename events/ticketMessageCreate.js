const ticketSchema = require('../models/ticketSchema')
const { MessageEmbed } = require('discord.js')


module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message) {
        if (!message.channel.name.includes('ticket') || message.author.bot) return;

        let ticket = await ticketSchema.findOne({channelID: message.channel.id})
        if (!ticket) return;

        if (message.content.includes('!logs')) {
            let logs = ticket.logs.map(log => `\`${log.timeStamp}\` ${log.author}: \n> ${log.content}`)
            let embed = new MessageEmbed()
                .setTitle('Ticket Message Log')
                .setDescription(logs.join('\n'))
                .setColor(message.guild.me.displayHexcolor)
            await message.channel.send({embeds: [embed]})
        } else {
            try {
                let attachmentsArray;
                let attachment = message.attachments.map(attachment =>  attachment.proxyURL)
                if (attachment.length > 0) {
                    let attachmentsArrays = []
                    for (attach of attachment) {
                        attachmentsArrays.push({
                            "URL": attach
                        });
                    }
                    attachmentsArray = attachmentsArrays
                }
                ticket.logs.push({
                    "messageID": message.id,
                    "status": 'Created',
                    "author": message.author.tag,
                    "authorID": message.author.id, 
                    "content": message.content,
                    "timeStamp": message.createdAt,
                    "attachments": attachmentsArray
                });
                ticket.save();

            } catch (err) {
                console.error(err)
            }
        }
    },
 };