const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton, Permissions } = require('discord.js')
const helper = require('../modules/helpers')
const userSchema = require('../models/userSchema')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription("Display comprehensive information about a member.")
        .addUserOption(option =>
            option.setName('member')
            .setDescription('Mention a member.')
            .setRequired(false)
        ),
    async execute(interaction) {
        let member;
        let user;
        let mentioned = interaction.options.getUser('member');
        let userProfile;
        if (!mentioned) {
            member = interaction.member;
            user = interaction.user;
        } else {
            user = mentioned;
            member = await interaction.guild.members.fetch(mentioned.id);
        }
        try{
            profile = await userSchema.findOne({userID: member.id})
            if (!profile) {
                let newProfile = new userSchema({
                    userID: member.id,
                    nickname: member.displayName
                });
                newProfile.save()
                userProfile = newProfile
            } else {
                userProfile = profile
            }
        } catch (error) {
            console.error(error)
        };
        let roles = helper.remove(member.roles.cache.map(role => role.toString()), '@everyone')
        let infoEmbed = new MessageEmbed()
            .setTitle("Member Information")
            .setColor(member.displayHexColor)
            .setThumbnail(user.avatarURL({dynamic: true}))
            .addFields([
                {name: "Name & ID", value: `${member.displayName} \n${user.tag} \n(${member.id})`, inline: true},
                {name: "\u200b", value: "\u200b", inline: true},
                {name: "Mod Actions", value: `Warns: \`${userProfile.warnings.length}\` \nMutes: \`${userProfile.mutes.length}\` \nStatus: \`${userProfile.status}\``, inline: true},
                {name: "Joined Discord", value: `${user.createdAt}`, inline: true},
                {name: "\u200b", value: "\u200b", inline: true},
                {name: `Joined ${interaction.guild.name}`, value: `${member.joinedAt}`, inline: true}
            ]);
            if (member.presence != null) {
                infoEmbed.addField("Status ", `${helper.getStatusEmoji(member.presence.status)}`, false)
                for (activity of member.presence.activities.map(activity => `**${activity.name}** \n> ${activity.details} \n> ${activity.state}`)) {
                    infoEmbed.addField("\u200b", `${activity}`, true)
                }
            } else {
                infoEmbed.addField("Status", "<a:gray:849056394426843167> \`Offline\`", false)
            }
            infoEmbed.addField(`Roles (${roles.length})`, roles.join(', '), false)

        let row;
        if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS) && interaction.member != member) {
            row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle('SECONDARY')
                        .setLabel('Change Nickname')
                        .setCustomId('nickname-change')
                        .setDisabled(true)
                )
        } else if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS) && interaction.member === member || interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS) && interaction.member === member) {
            row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle('SECONDARY')
                        .setLabel('Change Nickname')
                        .setCustomId('nickname-change')
                )
        } else if (interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS) && interaction.member != member && member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle('SECONDARY')
                        .setLabel('Change Nickname')
                        .setCustomId('nickname-change')
                        .setDisabled(true),
                    new MessageButton()
                        .setStyle('SECONDARY')
                        .setLabel('Warn')
                        .setCustomId('warn')
                        .setDisabled(true),
                    new MessageButton()
                        .setStyle('SECONDARY')
                        .setLabel('Mute')
                        .setCustomId('mute')
                        .setDisabled(true),
                    new MessageButton()
                        .setStyle('DANGER')
                        .setLabel('Kick')
                        .setCustomId('kick')
                        .setDisabled(true),
                    new MessageButton()
                        .setStyle('DANGER')
                        .setLabel('Ban')
                        .setCustomId('ban')
                        .setDisabled(true)
                )
        } else if (interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS) && interaction.member != member) {
            row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle('SECONDARY')
                        .setLabel('Change Nickname')
                        .setCustomId('nickname-change'),
                    new MessageButton()
                        .setStyle('SECONDARY')
                        .setLabel('Warn')
                        .setCustomId('warn'),
                    new MessageButton()
                        .setStyle('SECONDARY')
                        .setLabel('Mute')
                        .setCustomId('mute'),
                    new MessageButton()
                        .setStyle('DANGER')
                        .setLabel('Kick')
                        .setCustomId('kick'),
                    new MessageButton()
                        .setStyle('DANGER')
                        .setLabel('Ban')
                        .setCustomId('ban')
                )
        } 
        return interaction.reply({embeds: [infoEmbed], components: [row], ephemeral: false})        
    },
};