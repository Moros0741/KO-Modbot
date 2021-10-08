const { SlashCommandBuilder } = require('@discordjs/builders');
const ticketHelper = require('../modules/tickets')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Send the ticket creation message.')
        .addStringOption(option =>
            option.setName('action')
            .setDescription("Send Message or Setup Roles")
            .setRequired(true)
            .addChoice("Setup Roles", 'setRoles')
            .addChoice('Send Message', 'sendMessage'))
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
            .setRequired(false)
        )
        .addStringOption(option => 
            option.setName('category-channel')
            .setDescription('Category ID for creating tickets under')
            .setRequired(false)
        ),
    async execute(interaction, guildProfile) {
        let ticketSystem = guildProfile.systems.tickets
        let action = interaction.options.getString('action')
        let choice = interaction.options.getString('type')
        let channel = interaction.options.getChannel('channel')
        let category = interaction.options.getString('category-channel')
        
        if (action === 'setRoles') {
            await interaction.reply({content: `Please send a message with the Category ID, Roles to accept and Roles to deny access to this ticket. Please separate each using a \`/\` 
            
        **Example**
        > <:greenTick:892539578534228018> \`135463424262464226 / Role1 Role2, Role3 / Role4 Role5 Role6\`
        > <:redTick:892539578706198589> \`134346745662342452 / Role1 / Role2 / Role3 / Role4 / Role5 / Role6\`
        `})

            const filter = m => m.channel === interaction.channel && m.author === interaction.user

            const collector = interaction.channel.createMessageCollector({filter, max: 1, time: 300000})

            let messages = []

            collector.on('collect', m => {
                messages.push(m.content)
            })
            collector.on('end', collected => {
                if (collected.size === 0) {
                    return interaction.editReply("No Mentions Detected.")
                } else {
                    let RegEx = /^<@&*.>$/i
                    let allMentions = messages[0].replace(RegExp(RegEx), '').trim('').split('/')
                    let channelMentions = allMentions[0]
                    let allowRoles = allMentions[1].split(' ')
                    let denyRoles = allMentions[2].split(' ')
                    console.log(channelMentions, allowRoles, denyRoles)
                    if (choice === 'partner') {
                        guildProfile.systems.tickets.types.partnerships.update(
                            {"$set": {
                                category: channelMentions,
                                allowRoles: allowRoles,
                                denyRoles: denyRoles
                                }
                            }
                        );
                        guildProfile.save();
                        
                        return interaction.editReply({content: `The following has been added: \n\n Category: <#${channelMentions[0]}> \nAllowed Roles: ${allowRoles.join(",")} \nDenied Roles: ${denyRoles.join(", ")}`})
                    
                    } else if (choice === 'secure') {
                        guildProfile.systems.tickets.types.secureChannel.category = channelMentions[0]
                        guildProfile.save();

                        for (role of allowRoles) {
                            guildProfile.systems.tickets.types.secureChannel.allowRoles.push(role)
                            guildProfile.save();
                        }

                        for (role of denyRoles) {
                            guildProfile.systems.tickets.types.secureChannel.denyRoles.push(role)
                            guildProfile.save();
                        }
                        return interaction.editReply({content: `The following has been added: \n\nCategory: <#${channelMentions[0]}> \nAllowed Roles: ${allowRoles.join(",")} \nDenied Roles: ${denyRoles.join(", ")}`})
                    
                    } else if (choice === 'support') {
                        guildProfile.systems.tickets.types.partnerships.category = channelMentions[0]

                        for (role of allowRoles) {
                            guildProfile.systems.tickets.types.partnerships.allowRoles.push(role)
                        }

                        for (role of denyRoles) {
                            guildProfile.systems.tickets.types.partnerships.denyRoles.push(role)
                        }
                        guildProfile.save();
                        return interaction.editReply({content: `The following has been added: \n\n Category: <#${channelMentions[0]}> \nAllowed Roles: ${allowRoles.join(",")} \nDenied Roles: ${denyRoles.join(", ")}`})
                    }
                }
            });
        } else if (action === 'sendMessage') {
            if (choice === 'partner') {
                await ticketHelper.createTicketMessage(channel, choice)
                ticketSystem.types.partnerships.category = category
                guildProfile.save();
            } else if (choice === 'secure') {
                await ticketHelper.createTicketMessage(channel, choice);
                ticketSystem.types.secureChannel.category = category
                guildProfile.save();

            } else if (choice === 'support') {
                await ticketHelper.createTicketMessage(channel, choice);
                ticketSystem.types.support.category = category
                guildProfile.save();
            }
            return interaction.reply({content: "Ticket setup, successfully. Please make sure you have the proper roles setup.", ephemeral: true})
        }
    },
};