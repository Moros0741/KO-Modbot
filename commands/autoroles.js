const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Permissions } = require('discord.js')
const helper = require('../modules/helpers')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoroles')
        .setDescription('Configure Invite Module or the Auto-Mod.')
        .addStringOption(option =>
            option.setName('action')
            .setDescription("What would you like to do?")
            .addChoice('View', 'view')
            .addChoice('Toggle', 'toggle')
            .addChoice('+ Role', '+role')
            .addChoice('- Role', '-role')
            .addChoice('Set Log', 'setlog')
        )
        .addRoleOption(option =>
            option.setName('role')
            .setDescription('Mention a role to add.')
            .setRequired(false)
        )
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription("Mention a channel to set for logging.")
            .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName('toggle')
            .setDescription('Turn System on/off')
            .setRequired(false)
        ),
    async execute(interaction, guildProfile) {
        let choice = interaction.options.getString('choice')
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply({content: "This command is only for Administrators.", ephemeral: true})
        } else {
            if (choice === 'view') {
                let settings = guildProfile.systems.autoRoles
                let autoRoleEmbed = new MessageEmbed()
                    .setTitle("AUTOMOD: AutoRole Settings")
                    .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                    .setColor(interaction.guild.me.displayHexColor)
                    .addFields([
                        {name: "Module Status", value: helper.getState(settings.active), inline: true},
                        {name: '\u200b', value: '\u200b', inline: true},
                        {name: "Log Channel", value: `<#${settings.logChannel}>` || "Not Set", inline: true},
                        {name: "Roles", value: `${settings.roles.map(role => role.toString()).join(', ')}` || "None", inline: false}
                    ])

                return interaction.reply({embeds: [autoRoleEmbed], ephemeral: true})
            } else if (choice === 'toggle') {
                let toggle = interaction.options.getBoolean('toggle')
                if (!toggle) {
                    return interaction.reply({contents: "Please try again and use the 'toggle' option. \n\n**Example:** \n\`/autoroles [toggle] [toggle: true/false]\`", ephemeral: true})
                } else {
                    try {
                        settings.active = toggle
                        guildProfile.save();
                    } catch (error) {
                        console.error(error)
                    }
                    return interaction.reply({content: `Auto Roles module is now ${helper.getState(toggle)}`, ephemeral: true})
                }
            } else if (choice === '+role') {
                let role = interaction.options.getRole('role')
                if (!role) {
                    return interaction.reply({content: "Please try again and use the 'role' option. \n\n**Example:** \n\`/autoroles [Choice: + Role] [Role: @role]\`", ephemeral: true})
                } else {
                    try {
                        settings.roles.push({
                            roleID: role.id
                        })
                        guildProfile.save();
                    } catch (error) {
                        console.error(error)
                    }
                }
                return interaction.reply({content: `Added \`${role.name}\` to Auto Roles Module`, ephemeral: true})
            } else if (choice === '-role') {
                let role = interaction.options.getRole('role')
                if (!role) {
                    return interaction.reply({content: "Please try again and use the 'role' option. \n\n**Example:** \n\`/autoroles [Choice: - Role] [Role: @role]\`", ephemeral: true})
                } else {
                    try {
                        guildProfile.systems.autoRoles.roles.update(
                            { role: role.id },
                            { $pull: { role: role.id } }
                        );
                        guildProfile.save()
                    } catch (error) {
                        console.error(error)
                    }
                }
            } else if(choice === 'setlog') {
                let channel = interaction.options.getChannel('channel')
                if (!channel) {
                    return interaction.reply({content: "Please try again and use the 'channel' option. \n\n**Example:** \n\`/autoroles [Choice: Set Log] [channel: #channel]\`", ephemeral: true})
                } else {
                    try {
                        settings.logChannel = channel.id
                        guildProfile.save();
                    } catch (error) {
                        console.error(error)
                    }
                    return interaction.reply({content: `Auto-Roles will now be logged in ${channel.toString()}.`, ephemeral: true})
                }
            }
        }
    },
};