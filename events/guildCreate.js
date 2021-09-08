const guildSchema = require('../models/guildSchema')
const commandSchema = require('../models/commandSchema')
const { MessageEmbed } = require('discord.js')
const { version } = require('../config.json')

module.exports = {
    name: "guildCreate",
    async execute(guild) {
        console.log("Made it into Execute")
        let guildProfile = await guildSchema.findOne({guildID: guild.id})
        if (!guildProfile) {
            await guildSchema.create({
                guildID: guild.id,
                taxRate: 0,
            })
        }
        guildProfile.save();
    },
};