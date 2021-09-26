
module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message) {
        if (!message.channel.name.includes('ticket') || message.author.bot) return;

        let ticket = ticketSchema.findOne({channelID: message.channel.id})
        if (!ticket) return;

        let attachmentsArray = []
        let attachments = message.attachments
        if (message.attachments.length > 0) {
            for (attach of attachments) {
                attachmentsArray.push({
                    ID: attach.id,
                    name: attach.name,
                    URL: attach.proxyURL
                });
            }
        }

        ticket.logs.push({
            messageID: message.id,
            status: 'Created',
            author: message.author.tag,
            authorID: message.author.id, 
            content: message.content,
            timeStamp: message.createdTimestamp,
            attachments: attachmentsArray
        });
        ticket.save();

    },
 };