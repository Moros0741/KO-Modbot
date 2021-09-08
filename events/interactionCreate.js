const ProfileSchema = require('../models/profileSchema')
const GuildSchema = require('../models/GuildSchema')

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        let profileData;
        let guildData;
        if (!interaction.isCommand()) return;
        
        const command = interaction.client.commands.get(interaction.commandName);
    
        if (!command) return;
        try {
            profileData = await ProfileSchema.findOne({userID: interaction.user.id});
            if (!profileData) {
                let profile = await ProfileSchema.create({
                    userID: interaction.user.id,
                    serverID: interaction.guild.id,
                    balance: 0
                });
                profile.save();
                return profileData = profile;
            }
        } catch(err) {
            console.error(err.message);
        };
        try {
            guildData = await GuildSchema.findOne({guildID: interaction.guild.id})
            if (!guildData) {
                let guildProfile = await GuildSchema.create({
                    guildID: interaction.guild.id
                })
                guildProfile.save()
                return guildData = guildProfile
            }
        } catch(err) {
            console.error(err.message)
        }

        try {
            await command.execute(interaction, profileData, guildData);
        } catch (error) {
            console.error(error.message);
            return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};