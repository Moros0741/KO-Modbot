const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-logs')
        .setDescription('Set channels for logging events')
        .addStringOption(option => 
            option.setName('log-type')
            .setDescription('Logging Types')
            .setRequired(true)
            .addChoice('Moderation Logs', 'modlogs')
            .addChoice('Member Updates', 'memberupdates')
            .addChoice('Server Updates', 'serverupdates')
            .addChoice('Join Logs', 'joinlogs')
            .addChoice('Leave Logs', 'leavelogs')
            .addChoice('Ticket Logs', 'ticketlogs')
        )
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('Channel to set for logging')
            .setRequired(true)
        ),
    async execute(interaction, guildProfile) {
        let choice = interaction.options.getString('log-type')
        let channel = interaction.options.getChannel('channel')
        let response;
        
        if (choice === 'modlogs') {
            guildProfile.logging.modLog = channel.id 
            guildProfile.save();
            return interaction.reply({content: `Moderation Log channel set to: ${channel.toString()}`, ephemeral: true}) 

        } else if (choice === "memberupdates") {
            guildProfile.logging.memberrUpdates = channel.id 
            guildProfile.save();
            return interaction.reply({content: `Member updates will now be logged in: ${channel.toString()}`, ephemeral: true})

        } else if (choice === 'serverupdates') {
            guildProfile.logging.serverUpdates = channel.id
            guildProfile.save();
            return interaction.reply({content: `Server Updates will now be logged in ${channel.toString()}`, ephemeral: true})

        } else if (choice === 'joinlogs') {
            guildProfile.logging.joinLogs = channel.id
            guildProfile.save();
            return interaction.reply({content:`Member joins will now be logged in ${channel.toString()}`, ephemeral: true})

        } else if (choice === 'leavelogs') {
            guildProfile.logging.leaveLogs = channel.id
            guildProfile.save();
            return interaction.reply({content: `Member leaves will now be logged in ${channel.toString()}`, ephemeral: true})

        } else if (choice === 'ticketlogs') {
            guildProfile.logging.ticketLogs = channel.id
            guildProfile.save();
            return interaction.reply({content: `Created & Closed tickets will now be logged in ${channel.toString()}`, ephemeral: true})
        }
    },
};
