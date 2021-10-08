const guildSchema = require('../models/guildSchema')
const userSchema = require('../models/userSchema')
const helper = require('../modules/helpers')


module.exports = {
    name: "guildMemberRemove",
    once: false,
    async execute(member) {
        let guildProfile = await guildSchema.findOne({"guildID": member.guild.id})
        let userProfile = await userSchema.findOne({"userID": member.id})

        // Marking Member not active
        try {
            userProfile.active = false
            userProfile.save();
        
        } catch (err) {
            console.error(err)
        }

        // Sending Member Left Message
        try { 
            if (guildProfile.logging.leaveLogs) {
                let membership = getDateDifference(member.joinedAt)
                let leaveEmbed = new MessageEmbed()
                    .setTitle("Member Left")
                    .setThumbnail(member.user.avatarURL({dynamic: true}))
                    .addField('User', `${member.user.tag} \n ${member.id}`, true)
                    .addField('\u200b', '\u200b', true)
                    .addField("Joined", `${member.joinedAt} \n \`${membership}\` days of membership`, true)
                    .setFooter(`Member Count: ${helper.formatNumber(member.guild.memberCount)}`, member.guild.iconURL({dynamic: true}))

                let channel = member.guild.channels.cache.find(channel => channel.id === guildProfile.logging.leaveLogs)
                
                await channel.send({embeds: [leaveEmbed]})
            }
        } catch (err) {
            console.error(err)
        }
    },
};