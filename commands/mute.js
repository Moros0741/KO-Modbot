const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Permissions } = require('discord.js')
const modHelper = require('../modules/modActions')
const helper = require('../modules/helpers')
const presetReasons = require('../data/responses.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a member by mention or ID')
        .addStringOption(option =>
            option.setName('duration')
            .setDescription('How long to mute for? Examples: 10m = ten minutes, 3h = three hours.')
            .setRequired(true))
        .addNumberOption(option => 
            option.setName('id')
            .setDescription('ID of the member to mute.')
            .setRequired(false)
        )
        .addUserOption(option =>
            option.setName('member')
            .setDescription('Mention member to mute')
            .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('reason for muting this member.')
            .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('preset-reasons')
            .setDescription('Choose from a list of Pre-Set Reasons')
            .setRequired(false)
            .addChoice('Hindering Operations', 'mm')
            .addChoice('Emoji Spam', 'es')
            .addChoice('Mention Spam', 'ms')
            .addChoice('Non-Compliance/Arguing', 'arg')
            .addChoice('Conduct Unbecoming/General', 'cb')
        ),
    async execute(interaction, guildProfile) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) {
            return interaction.reply({content: "This command requires \`MUTE MEMBERS \` permissions. Which you don't have", ephemeral: false})
        } else {
            let member;
            let reason;
            let duration = interaction.options.getString('duration')
            try {
                let serverUser = interaction.options.getUser('member')
                let userID = interaction.options.getNumber('ID')
                if (!serverUser && !userID) {
                    return interaction.reply({content: "Please try again and use the 'member' or 'ID' option. \n\n**Examples:** \n> 1.\`/mute [member: @mention] [duration: number] [reason: your-reason or choice]\` \n> 2. \`/mute [ID: member-id] [duration: number] [reason: your-reason or choice]\`", ephemeral: true})
                } else if (!serverUser) {
                    member = interaction.guild.members.cache.find(member => member.id === userID)
                } else {
                    member = interaction.guild.members.cache.find(member => member.id === serverUser.id)
                }
            } catch (err) {
                console.error(err)
            }
        try {
            let inputReason = interaction.options.getString('reason')
            let choice = interaction.options.getString('preset-reasons')
            if (!inputReason && !choice) {
                return interaction.reply({content: "Please try again and user the 'reason' or 'preset-reasons' option. \n\n**Examples:** \n> 1.\`/mute [member: @member] [duration: number] [reason: your-reason]\` \n> 2. \`/mute [member: @member] [duration: number] [preset-reasons: your-choice]\`"})
            } else if (!inputReason) {
                reason = presetReasons.reasons.mutes.choices[choice]
            } else {
                reason = inputReason
            }
        } catch (err) {
            console.error(err)
        }
        await modHelper.muteMember(interaction.guild, guildProfile, member, reason, duration, interaction.member)

        let responseEmbed = new MessageEmbed()
            .setDescription(`${member.toString()} has been muted for \`${duration}\`. With Reason: \n> \`${reason}\``)
            .setColor('ORANGE')
        return interaction.reply({embeds: [responseEmbed], ephemeral: true})
        }
    },
};