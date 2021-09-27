const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('View a member\'s or your own avatar')
        .addUserOption(option =>
            option.setName('member')
            .setDescription('Mention a member to view their avatar')
            .setRequired(false)
        ),
    async execute(interaction) {
        let member;
        try{
            let user = interaction.options.getUser('member')
            if (!user) {
                member = interaction.member
            } else {
                member = interaction.guild.members.cache.find(member => member.id === user.id)
            }
        } catch(err) {
            console.error(err)
        }
        let embed = new MessageEmbed()
            .setTitle(`${member.displayName}'s Avatar'`)
            .setDescription(`[Link](${member.user.avatarURL({dynamic: false})})`)
            .setImage(member.user.avatarURL({dynamic: true}))
            .setColor(member.displayHexColor)
        
        return interaction.reply({embeds: [embed], ephemeral: false})
    },
};