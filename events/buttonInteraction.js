module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        let profileData;
        let guildData;
        if (!interaction.isButton()) return;
            try {
                if (interaction.customId === 'nickname-change') {
                    console.log(interaction.message)
                    return interaction.reply('Woo! Button Clicked!!')
                }
            } catch (error) {
                console.error(error);
                return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        
    },
};