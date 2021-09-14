const { SlashCommandBuilder } = require('@discordjs/builders')
const guildSchema = require('../models/guildSchema')
const { MessageEmbed, Permissions } = require('discord.js')
const helper = require('../modules/helpers')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod-invites')
        .setDescription('Configure Invite Module or the Auto-Mod.')
        .addStringOption(option =>
            option.setName('action')
            .setDescription("What would you like to do?")
            .addChoice('View', 'view')
            .addChoice('Toggle', 'toggle')
            .addChoice('+ Channel', '+channel')
            .addChoice('- Channel', '-channel')
            .addChoice('+ Link', '+link')
            .addChoice('- Link', '-link')
            .addChoice('Set Log', 'setlog')
        )
        .addStringOption(option =>
            option.setName('url')
            .setDescription('Input a string value')
            .setRequired(false)
        )
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription("Channel to add/remove")
            .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName('toggle')
            .setDescription('Turn System on/off')
            .setRequired(false)
        ),
    async execute(interaction, guildProfile) {
        let choice = interaction.options.getString('action')
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply({content: "This command is only for Administrators.", ephemeral: true})
        } else {
            if (choice === 'view'){
                let settings = guildProfile.systems.invites
                let status = helper.getState(settings.active)
                let settingsEmbed = new MessageEmbed()
                    .setTitle('AUTOMOD: Invites Settings')
                    .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                    .setColor(interaction.guild.me.displayHexColor)
                    .addFields([
                        {name: "Module Status", value: status, inline: true},
                        {name: '\u200b', value: '\u200b', inline: true},
                        {name: "Log Channel", value: `${settings.logChannel || "Not Set"}`, inline: true},
                        {name: "Monitored Channels", value: `${settings.channels.map(channel => `<#${channel.channelID}>`).join(", ") || "None"}`, inline: false},
                        {name: "Blacklisted Links", value: `${settings.links.map(link => `\`${link.url || "None"}\``).join(", ")}`, inline: false}
                    ])
                    .setFooter("Use \`/invites\` to configure Invites System.")

                return interaction.reply({embeds: [settingsEmbed], ephemeral: true})
            } else if (choice === 'toggle') {
                try {
                    let toggled = interaction.options.getBoolean('toggle')
                    if (!toggled) {
                        return interaction.reply({content: "Please try again and use the 'toggle' option. \n\n**EXAMPLE** \n\`/automod-invites [Toggle] [toggle: true/false]\`", ephemeral: true})
                    } else {
                        guildProfile.systems.invites.active.updateOne({active: toggled})
                        guildProfile.save()
                        let status = helper.getStatusEmoji(toggled)
                        return interaction.reply({content: `Invites System is now: \`${status}\``, ephemeral: true})
                    }
                } catch(error) {
                    console.error(error)
                }
            } else if (choice === '+channel') {
                try {
                    let channel = interaction.options.getChannel('channel')
                    if (!channel) {
                        return interaction.reply({content: "Please try again and use the 'channel' option. \n\n**EXAMPLE:** \n\`/automod-invites [+ Channel] [channel: #mention]\`", ephemeral: true})
                    } else {
                        console.log(channel.id)
                        guildProfile.systems.invites.channels.push({
                            channelID: channel.id
                        });
                        guildProfile.save()
                        return interaction.reply({content: `Invites will now be monitored in ${channel.toString()}`, ephemeral: true})
                    }
                } catch(error) {
                    console.error(error)
                }
            } else if (choice === '-channel') {
                try {
                    let channel = interaction.options.getChannel('channel')
                    if (!channel) {
                        return interaction.reply({content: "Please try again and use the 'channel' option. \n\n**EXAMPLE:** \n\`/automod-invites [+ Channel] [channel: #mention]\`", ephemeral: true})
                    } else {
                        guildProfile.systems.invites.channels.update(
                            { channelID: channel.id },
                            { $pull: { channelID: channel.id } }
                        );
                        guildProfile.save()
                        return interaction.reply({content: `Invites will no longer be monitored in ${channel.toString()}`, ephemeral: true})
                    }
                } catch (error) {
                    console.error(error)
                }
            } else if (choice === '+link') {
                try {
                    let url = interaction.options.getString('url')
                    if (!url) {
                        return interaction.reply({content: "Please try again and use the 'url' option. \n\n**EXAMPLE**\n\`/automod-invites [+ Link] [url: invite-url-to-blacklist]\`", ephemeral: true})
                    } else {
                        guildProfile.systems.invites.links.push({
                            url: url
                        });
                        guildProfile.save()
                        return interaction.reply({content: `Added ${url} to invite blacklist.`, ephemeral: true})
                    }
                } catch (error) {
                    console.error(error)
                }
            } else if (choice === '-link') {
                try {
                    let url = interaction.options.getString('url')
                    if (!url) {
                        return interaction.reply({content: "Please try again and use the 'url' option. \n\n**EXAMPLE**\n\`/automod-invites [- Link] [url: invite-url-to-blacklist]\`", ephemeral: true})
                    } else {
                        guildProfile.systems.invites.links.update(
                            { url: url },
                            { $pull: { url: url } }
                        );
                        guildProfile.save()
                        return interaction.reply({content: `Removed ${url} from invite blacklist.`, ephemeral: true})
                    }
                } catch (error) {
                    console.error(error)
                }
            } else if (choice === 'setlog') {
                try {
                    let channel = interaction.options.getChannel('channel')
                    if (!channel) {
                        return interaction.reply({content: "Please try again and use the 'channel' option. \n\n**EXAMPLE:** \n\`/automod-invites [Set Log] [channel: #mention]\`", ephemeral: true})
                    } else {
                        guildProfile.systems.invites.logChannel.updateOne({
                            logChannel: channel.id
                        });
                        guildProfile.save()
                        return interaction.reply({content: `Let Invite System's Log Channel to: ${channel.toString()}`, ephemeral: true})
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        }
    },
};