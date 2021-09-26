module.exports = {
    name: "messageDelete",
    once: false,
    async execute(message) {
        if (!message.channel.name.includes('ticket') || message.author.bot) return;

        let ticket = ticketSchema.findOne({channelID: message.channel.id})
        if (!ticket) return;

        let log = ticket.logs.find({messageID: message.id});
        if (!edited) return;

        edited.update({status: 'Deleted'})
        edited.save();
    },
 };