const { SlashCommandBuilder, memberNicknameMention} = require('@discordjs/builders')
const { MessageEmbed, Permissions} = require('discord.js')
const modHelper = require('../modules/modActions')
const helper = require('../modules/helpers')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warns')
        .setDescription('Add/View/Remove a member\'s warnings')
        .addStringOption(option =>
            option.setName('action')
            .setDescription("What would you like to do? Add, Remove or View")
            .setRequired(true)
            .addChoice("Add", 'add')
            .addChoice('Remove', 'remove')
            .addChoice('View', 'view')
        )
        .addUserOption(option =>
            option.setName('member')
            .setDescription('The member to warn')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Reason member is being warned.')
            .setRequired(false)
        ),
    async execute(interaction, guildProfile) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) {
            return interaction.reply({contents: "This command requires \`MUTE MEMBERS\` permissions. Which you don't have."})
        } else {
            let user = interaction.options.getUser('member')
            let inputReason = interaction.options.getString('reason')
            if (!user) {
                return interaction.reply({contents: "Please try again and mention a member this time. \n\n**Example:** \n> \`/warn [member: @member] [reason: your-reason]\`", ephemeral: true})
            } else{
            let member = interaction.guild.members.cache.find(member => member.id === user.id)
            }
            if (!inputReason) {
                return interaction.reply({contents: "Please try again and provide a valid reason. \n\n**Example: \n> \`/warn [member: @member] [reason: your-reason]\`", ephemeral: true})
            } else {
                reason = inputReason
            }
            await modHelper.warnMember(interaction.guild, guildProfile, member, reason, interaction.member)

            let responseEmbed = new MessageEmbed()
                .setDescription(`${member.toString()} has been warned. With reason: \`${reason}\``)
                .setColor('GOLD')
            return interaction.reply({embeds: [responseEmbed], ephemeral: true})
        }
    },
};