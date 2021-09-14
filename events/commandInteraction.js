const guildSchema = require('../models/guildSchema')
const userSchema = require('../models/userSchema')

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        let profileData;
        let guildProfile;
        try {
            guildProfile = await guildSchema.findOne({guildID: interaction.guild.id})
            if (!guildProfile) {
                let serverprofile = new guildSchema({
                    guildID: interaction.guild.id
                });
                serverprofile.save()
                return guildProfile = serverprofile
            }
        } catch(error) {
            console.error(error)
        };
        try {
            userProfile = await userSchema.findOne({userID: interaction.user.id})
            if (!userProfile) {
                let memberprofile = new userSchema({
                    userID: interaction.user.id,
                    nickname: interaction.member.displayName
                });
                memberprofile.save()
                return profileData = memberprofile;
            } 
        } catch(error) {
            console.error(error)
        };

        if (!interaction.isCommand()) return;
        
        const command = interaction.client.commands.get(interaction.commandName);
    
        if (!command) return;
        
        try {
            await command.execute(interaction, guildProfile);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};