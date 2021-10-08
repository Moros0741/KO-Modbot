const ticketHelper = require('../modules/tickets')
const guildSchema = require('../models/guildSchema')
const ticketSchema = require('../models/ticketSchema');
const { MessageActionRow, MessageButton } = require('discord.js');

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
                let serverProfile = new guildSchema({
                    guildID: interaction.guild.id
                });
                serverProfile.save()
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
                return interaction.reply({content: "Your ticket is being created.", ephemeral: true})
            
            } else {
                return interaction.reply({content: `You already have an active ticket <#${ticket.channelID}>`, ephemeral: true})
            } 
        } else if (interaction.customId === 'close-ticket') {
            await ticketHelper.sendConfirmation(interaction)
            
        } else if (interaction.customId === 'do-not-close') {
            await interaction.message.delete()
            return interaction.deferReply()

        } else if (interaction.customId === 'yes-close') {
            await ticketHelper.closeTicket(interaction, guildProfile)
        }
    },
};