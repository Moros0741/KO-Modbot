const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Permissions } = require('discord.js')
const presetReasons = require('../data/responses.json')
const helper = require('../modules/helpers')
const modHelper = require('../modules/modActions')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription("Ban a user from this server.")
        .addUserOption(option =>
            option.setName('member')
            .setDescription("Mention the member to ban")
            .setRequired(false)
        )
        .addNumberOption(option =>
            option.setName('id')
            .setDescription("The ID of the member to ban")
            .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Reason for banning this member')
            .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('preset-reasons')
            .setDescription('Choose from pre-set reasons')
            .addChoice('Raiding/Nuking', 'rn')
            .addChoice("TOS Breach", 'dtos')
            .addChoice('NSFW Content', 'nsfw')
            .addChoice('Scamming', 'sc')
            .addChoice('Hate Speech', 'hs')
            .addChoice('DM Advertising', 'dmadv')
            .addChoice('Member Doxxing', 'dxx')
        ),
    async execute(interaction, guildProfile){
        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({content: "This command requires `BAN MEMBERS` permissions. Which you don't have.", ephemeral: true});

        } else {
            let reason;
            let choice = interaction.options.getString('preset-reasons')
            let member;

            try {
                let serverUser = interaction.options.getUser('member')
                let memberID = interaction.options.getNumber('ID')
                if (!serverUser) {
                    member = interaction.guild.members.cache.find(member => member.id === memberID)
                } else if (!serverUser && !memberID) {
                    return interaction.reply({contents: "Please try again and use either the 'member' or 'ID' options. \n\n**Examples:** \n> 1.\`/ban [ID: user-id] [reason: your-reason]\` \n> 2. \`/ban [member: @member] [reason: your-reason]\`", ephemeral: true})
                }
                member = interaction.guild.members.cache.find(member => member.id === serverUser.id)
            
            } catch(err) {
                console.error(err)
            }

            try {
                let inputReason = interaction.options.getString('reason')
                if (!inputReason) {
                    reason = presetReasons.reasons.bans.choices[choice]
                } else if (!inputReason && !choice) {
                    return interaction.reply({contents: "Please try again and use either the 'preset-reasons' or 'reason' options. \n\n**Examples:** \n> 1.\`/ban [ID: user-id] [reason: your-reason]\` \n> 2. \`/ban [member: @member] [preset-reasons: your-choice]\`", ephemeral: true})
                }
                reason = inputReason
            } catch (err) {
                console.error(err)
            }

            let resposne = new MessageEmbed()
                .setDescription(`${member.toString()} was banned with reason: ${reason}`)
                .setColor('RED')

            if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
                return interaction.reply({contents: "This command requires \`BAN MEMBERS\` permissions. Which you don't have."})

            } else if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS) && member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
                return interaction.reply({contents: "You cannot ban this member. They are of the same level as your or are staff.", ephemeral: true})
            } else {
                await modHelper.banMember(interaction.guild, guildProfile, member, reason, interaction.member)
                return interaction.reply({embeds: [response], ephemeral: true})
            }
        }
    },
};