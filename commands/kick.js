const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Permissions, Message } = require('discord.js')
const modHelper = require('../modules/modActions')
const helper = require('../modules/helpers')
const presetReasons = require('../data/responses.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription("Kick a member by mention or their ID")
        .addNumberOption(option =>
            option.setName('ID')
            .setDescription("The ID of the member to kick.")
            .setRequired(false)
        )
        .addUserOption(option =>
            option.setName('member')
            .setDescription('Mention the member to kick')
            .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Type a reason for kicking this member')
            .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('reason-list')
            .setDescription("Choose from a pre-set list of reasons")
            .addChoice("Guildelines Breach", 'gb')
            .addChoice("Ad Guidelines Breach", 'agb')
            .addChoice("Arguing with Others", "awo")
            .addChoice("Incident Continuation", "ic")
            .addChoice("Conduct Unbecoming", 'cb')
        ),
    async execute(interaction, guildProfile) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            return interaction.reply({contents: "This command requires \`KICK MEMBERS\` permissions. Which you don't have."})
        } else {
            let member;
            let reason;
            try {
                let serverUser = interaction.options.getUser('member')
                let memberID = interaction.options.getNumber('ID')
                if (!serverUser && !memberID) {
                    return interaction.reply({contents: "Please try again and use either the 'member' or 'ID' options. \n\n**Examples:** \n> 1.\`/kick [ID: user-id] [reason: your-reason]\` \n> 2. \`/kick [member: @member] [reason: your-reason]\`", ephemeral: true})
                } else if (!serverUser) {
                    member = interaction.guild.members.cache.find(member => member.id === memberID)
                } else {
                    member = serverUser
                }
            } catch (err) {
                console.error(err)
            }
            if (member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
                return interaction.reply({contents: "You cannot kick this user. They are either the same as you, or higher.", ephemeral: true})
            }
            try {
                let inputReason = interaction.options.getString('reason')
                let choice = interaction.options.getString('preset-reasons')
                if (!inputReason && !choice) {
                    return interaction.reply({contents: "Please try again and use either the 'preset-reasons' or 'reason' options. \n\n**Examples:** \n> 1.\`/kick [ID: user-id] [reason: your-reason]\` \n> 2. \`/kivk [member: @member] [preset-reasons: your-choice]\`", ephemeral: true}) 
                } else if (!inputReason) { 
                    reason = presetReasons.reasons.kicks.choices[choice]
                } else {
                    reason = reason
                }
            } catch (err) {
                console.error(err)
            }
            
        await modHelper.kickMember(interaction.guild, guildProfile, member, reason ,interaction.member)
        
        let response = new MessageEmbed()
            .setDescription(`${member.toString()} has been kicked. With Reason: \`${reason}\``)
        }
    },
};