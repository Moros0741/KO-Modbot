const { SlashCommandBuilder } = require('@discordjs/builders')
const ticketHelper = require('../modules/tickets')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Send the ticket creation message.')
        .addStringOption(option =>
            option.setName('type')
            .setDescription('The type of ticket to setup')
            .setRequired(true)
            .addChoice('Partnerships', 'partner')
            .addChoice('Secure Channel', 'secure')
            .addChoice('Support Ticket', 'support')
        )
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription("Channel to send this message to.")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('category-channel')
            .setDescription('Category ID for creating tickets under')
            .setRequired(true)
        ),
    async execute(interaction, guildProfile) {
        let choice = interaction.options.getString('type')
        let channel = interaction.options.getChannel('channel')
        let category = interaction.options.getString('category-channel')
        if (choice === 'partner') {
            let m = await ticketHelper.createTicketMessage(channel, choice)
            guildProfile.systems.tickets.types.partnerships.update({ "$set": { "category": category, "channelID": channel.id, "messageID": m}}).exec(function(err, guildProfile){
                if(err) {
                    console.log(err);
                }
             });
            guildProfile.save();
        } else if (choice === 'secure') {
            let me = await ticketHelper.createTicketMessage(channel, choice);
            guildProfile.systems.tickets.secureChannel.update({"$set": {"category": category, channelID: channel.id, "messageID": m}}).exec(function(err, guildProfile){
                if (err) {
                    console.error(err);
                }
            });
            guildProfile.save();
        } else if (choice === 'support') {
            let me = await ticketHelper.createTicketMessage(channel, choice);
            guildProfile.systems.tickets.support.update({"$set": {"category": category, channelID: channel.id, "messageID": m}}).exec(function(err, guildProfile){
                if (err) {
                    console.error(err);
                }
            });
            guildProfile.save();
        }
        return interaction.reply({contents: "Ticket setup, successfully. Please make sure you have the proper roles setup.", ephemeral: true})
    },
};