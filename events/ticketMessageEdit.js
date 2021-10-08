module.exports = {
    name: "messageEdit",
    once: false,
    async execute(message) {
        if (!message.channel.name.includes('ticket') || message.author.bot) return;

        let ticket = ticketSchema.findOne({"channelID": message.channel.id})
        if (!ticket) return;

        let edited = ticket.logs.find({"messageID": message.id});
        if (!edited) return;

        edited.update({ "$set": {"content": message.content, "status": 'Edited'}})
        edited.save();
    },
 };