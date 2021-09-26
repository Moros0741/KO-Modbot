const ticketHelper = require('../modules/tickets')
const guildSchema = require('../models/guildSchema')
const ticketSchema = require('../models/ticketSchema')

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction) {
        let profileData;
        let guildData;
        if (!interaction.isButton()) return;
        
        try {
            guildProfile = await guildSchema.findOne({guildID: interaction.guild.id})
            if (!guildProfile) {
                let serverprofile = new guildSchema({
                    guildID: interaction.guild.id
                });
                serverprofile.save()
                guildData = serverProfile
            }
            guildData = guildProfile
        } catch(error) {
            console.error(error)
        };
        if (interaction.customId === 'nickname-change') {
            return interaction.reply('Coming Soon!!')
        
        } else if (interaction.customId === 'partner') {
            let ticket = await ticketSchema.findOne({creatorID: interaction.member.id, isActive: true})
            if (!ticket) {
                await ticketHelper.createTicket(interaction.member, 'partner', guildData)
            
            } else {
                return interaction.reply({content: `You already have an active ticket <#${ticket.channelID}>`, ephemeral: true})
            }
        
        } else if (interaction.customId === 'secure') {
            let ticket = ticketSchema.findOne({creatorID: interaction.member.id, isActive: true})
            if (!ticket) {
                await ticketHelper.createTicket(interaction.member, 'secure', guildData)
            
            } else { 
                return interaction.reply({content: `You already have an active ticket <#${ticket.channelID}>`, ephemeral: true})
            }

        } else if (interaction.customId === 'support') {
            let ticket = await ticketSchema.findOne({creatorID: interaction.member.id, isActive: true})
            if (!ticket) {
                await ticketHelper.createTicket(interaction.member, 'support', guildData, interaction)
                return interaction.deferReply()
            
            } else {
                return interaction.reply({content: `You already have an active ticket <#${ticket.channelID}>`, ephemeral: true})
            } 
        } else if (interaction.customId === 'close-ticket') {
            await ticketHelper.closeTicket(interaction, guildData)
        }
    },
};