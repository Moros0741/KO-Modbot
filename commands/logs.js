const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const helper = require('../modules/helpers')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
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
        )
        .addBooleanOption(option =>
            option.setName('enable')
            .setDescription("Enable/Disable Logging Types. True = On, False = Off")
        ),
    async execute(interaction, guildProfile) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply({content: "This command requires `ADMINISTRATOR` permissions. Which you don't have.", ephemeral: true})
        } else {
            let choice = interaction.options.getString('log-type')
            let channel = interaction.options.getChannel('channel')
            let state = interaction.options.getBoolean('enable')
            let status = helper.getState(state)

            try {
                if (channel === null && state === null) {
                    return interaction.reply({content: `Please try again and use either \`enable\` or \`channel\` option. \n\n**Examples:** \n > <:greenTick:892539578534228018> \`/logs [log-type: Your-Choice] [channel: Channel Mention]\` \n > <:greenTick:892539578534228018> \`/logs [log-type: Your Choice] [enable: True/False]\` \n > <:redTick:892539578706198589> \`/logs [log-type: Your Choice] [enable: True/False] [Channel: Channel Mention\``, ephemeral: true});
                } else {
                    if (choice === 'modlogs') {
                        if (!channel) {
                            guildProfile.logging.modLog.active = state
                            guildProfile.save();
                        
                            return interaction.reply({content: `Moderation Logging has been ${status}`, ephemeral: true})

                        } else if (!state) {
                            guildProfile.logging.modLog.channel = channel.id 
                            guildProfile.save();
                            return interaction.reply({content: `Moderation Log channel set to: ${channel.toString()}`, ephemeral: true}) 
                        }

                    } else if (choice === "memberupdates") {
                        if (!channel) {
                            guildProfile.logging.memberUpdates.active = state
                            guildProfile.save();
                            return interaction.reply({content: `Member update logging is ${status}`, ephemeral: true})
                        
                        } else if (!state) {
                            guildProfile.logging.memberUpdates.channel = channel.id 
                            guildProfile.save();
                            return interaction.reply({content: `Member updates will now be logged in: ${channel.toString()}`, ephemeral: true})
                        }

                    } else if (choice === 'serverupdates') {
                        if (!channel) {
                            guildProfile.logging.serverUpdates.active = state
                            guildProfile.save();
                            return interaction.reply({content: `Server update logging is ${status}`, ephemeral: true})

                        } else if (!state) {
                            guildProfile.logging.serverUpdates.channel = channel.id
                            guildProfile.save();
                            return interaction.reply({content: `Server Updates will now be logged in ${channel.toString()}`, ephemeral: true})
                        }

                    } else if (choice === 'joinlogs') {
                        if (!channel) {
                            guildProfile.logging.joinLogs.active = state
                            guildProfile.save();
                            return interaction.reply({content: `Member Join Logging is now ${status}`, ephemeral: true})
                        } else if (!state) {
                            guildProfile.logging.joinLogs.channel = channel.id
                            guildProfile.save();
                            return interaction.reply({content:`Member joins will now be logged in ${channel.toString()}`, ephemeral: true})
                        }

                    } else if (choice === 'leavelogs') { 
                        if (!channel) {
                            guildProfile.logging.leaveLogs.active = state
                            guildProfile.save();
                            return interaction.reply({content: `Member Leave Logging is now ${status}`, ephemeral: true})
                        
                        } else if (!state) {
                            guildProfile.logging.leaveLogs.channel = channel.id
                            guildProfile.save();
                            return interaction.reply({content: `Member leaves will now be logged in ${channel.toString()}`, ephemeral: true})
                        }

                    } else if (choice === 'ticketlogs') {
                        if (!channel) {
                            guildProfile.logging.ticketLogs.active = state
                            guildProfile.save();
                            return interaction.reply({content: `Ticket Logging is now ${status}`, ephemeral: true})
                        
                        } else if (!state) {
                            guildProfile.logging.ticketLogs.channel = channel.id
                            guildProfile.save();
                            return interaction.reply({content: `Created & Closed tickets will now be logged in ${channel.toString()}`, ephemeral: true})
                        }
                    }
                }
            } catch (err) {
                console.error(err)
            }
        }
    }
};