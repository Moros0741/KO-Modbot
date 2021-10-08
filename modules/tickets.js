const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js')
const guildSchema = require ('../models/guildSchema')
const ticketSchema = require('../models/ticketSchema')
const helper = require('../modules/helpers')

async function updateTicket(channel, ticketData) {
    let ticket = await ticketSchema.findOne({"ticketID": ticketData.ticketID, "isActive": true})
    ticket.channelID = channel.id
    ticket.save();
}

function getPermissions(member, ticketData, guildProfile) {
    let tType = ticketData.ticketType
    if (!tType){
        let permissions = [
            {
                id: member.id,
                allow: [
                    Permissions.FLAGS.SEND_MESSAGES,
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.READ_MESSAGE_HISTORY
                ]
            },
            {
                id: member.guild.id,
                deny: [
                    Permissions.FLAGS.VIEW_CHANNEL
                ]
            }
        ]
        return permissions
    } else if (tType === 'partner') {
        let permissions = [
            {
                id: member.id,
                allow: [
                    Permissions.FLAGS.SEND_MESSAGES,
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.READ_MESSAGE_HISTORY,
                    Permissions.FLAGS.ADD_REACTIONS,
                    Permissions.FLAGS.ATTACH_FILES
                ]
            },
        ]
        if (!guildProfile.systems.tickets.types.partnerships.roles) return permissions;

        for (role of guildProfile.systems.tickets.types.partnerships.roles) {
            let roleID = role.roleID
            let rolePerm = {
                id: roleID,
                allow: [
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.SEND_MESSAGES,
                    Permissions.FLAGS.READ_MESSAGE_HISTORY,
                    Permissions.FLAGS.ATTACH_FILES,
                    Permissions.FLAGS.ADD_REACTIONS
                ]
            }
            permissions.push(rolePerm)
        }
        return permissions
    } else if (tType === 'support') {
        let permissions = [
            {
                id: member.id,
                allow: [
                    Permissions.FLAGS.SEND_MESSAGES,
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.READ_MESSAGE_HISTORY,
                    Permissions.FLAGS.ADD_REACTIONS,
                    Permissions.FLAGS.ATTACH_FILES
                ]
            },
        ]
        if (!guildProfile.systems.tickets.types.support.roles) return permissions;

        for (role of guildProfile.systems.tickets.types.support.roles) {
            let roleID = role.roleID
            let rolePerm = {
                id: roleID,
                allow: [
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.SEND_MESSAGES,
                    Permissions.FLAGS.READ_MESSAGE_HISTORY,
                    Permissions.FLAGS.ATTACH_FILES,
                    Permissions.FLAGS.ADD_REACTIONS
                ]
            }
            permissions.push(rolePerm)
        };
        return permissions;
    } else if (tType === 'secure') {
        let permissions = [
            {
                id: member.id,
                allow: [
                    Permissions.FLAGS.SEND_MESSAGES,
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.READ_MESSAGE_HISTORY,
                    Permissions.FLAGS.ADD_REACTIONS,
                    Permissions.FLAGS.ATTACH_FILES
                ]
            },
        ]
        if (!guildProfile.systems.tickets.types.secureChannel.roles) return permissions;

        for (role of guildProfile.systems.tickets.types.secureChannel.roles) {
            let roleID = role.roleID
            let rolePerm = {
                id: roleID,
                allow: [
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.SEND_MESSAGES,
                    Permissions.FLAGS.READ_MESSAGE_HISTORY,
                    Permissions.FLAGS.ATTACH_FILES,
                    Permissions.FLAGS.ADD_REACTIONS
                ]
            }
            permissions.push(rolePerm)
        }
        return permissions
    }
};

async function sendTicketLog(guildProfile, interaction, ticket, status) {
    if (!guildProfile.logging.ticketLogs.active === true) return; 
    let channel = interaction.guild.channels.cache.find(channel => channel.id === guildProfile.logging.ticketLogs.channel)
    let embed;
    if (status === 'open') {
        embed = new MessageEmbed()
            .setTitle('Ticket Opened')
            .setDescription(`**Ticket ID:** \`# ${ticket.ticketID}\``)
            .addField('Creator', `<@${ticket.creatorID}>`, true)
            .addField('\u200b', '\u200b', true)
            .addField('Ticket Type', ticket.ticketType, true)
            .setColor('GREEN')
    } else if (status === 'close') {
        embed = new MessageEmbed()
            .setTitle('Ticket Closed')
            .setDescription(`**Ticket ID:** \`# ${ticket.ticketID}\``)
            .addField('Creator', `<@${ticket.creatorID}>`, true)
            .addField('\u200b', '\u200b', true)
            .addField('Ticket Type', ticket.ticketType, true)
            .addField("Ticket Transcripts", `[View Ticket Transcript](https://knightowl.gg/)`)
            .setColor('RED')
    }
    await channel.send({embeds: [embed]})
};

async function createTicketChannel(member, ticketData, guildProfile, interaction) {
    let permissions = getPermissions(member, ticketData, guildProfile)
    let category;
    let title;
    let description;
    let thumbnail;
    if (ticketData.ticketType === 'secure'){
        title = "Secure Channel"
        thumbnail = 'https://media.discordapp.net/attachments/883205604959748136/890746717320937542/final_614d101a066f0c002965408b_934801-removebg-preview_1.png'
        description = `
            ** <@${ticketData.creatorID}> Welcome to your Secure Channel. (\`# ${ticketData.ticketID}\`)

            Please read the following information carefully as it will detail the next steps for you.
            
            __**Prize Claiming**__
            > If you are claiming a prize please state so and an Administrator will be with you shortly
            
            __**Report Abuse by Member or Staff**__
            > Please send any information, images, messages, etc regarding this matter. Our Administrators or 
            one of the Owners will be with you shortly.

            **Interview for a position** 
            > Sit tight and a Administrator (Staff Manager) will be with you shortly to conduct the interview. Thanks!

            __** Close the Ticket **__ 
            > If you no longer need this ticket you can close it below by pressing on the \`Close Ticket\` button.
            `
            category = guildProfile.systems.tickets.types.secureChannel.category
    } else if (ticketData.ticketType === 'support') {
        title = "Support Ticket"
        thumbnail = 'https://media.discordapp.net/attachments/883205604959748136/890746720852541480/Untitled_design__2_-removebg-preview.png'
        description = `
            ** <@${ticketData.creatorID}> Welcome to your Support Ticket. (\`# ${ticketData.ticketID}\`)**
            
            Please read the following information carefully as it will detail the next steps for you.
            
            __** Reporting a User/Bug **__
            > Please send any screenshots you have taken, a brief synopsis of the issue(s). Staff will review it all and
            respond shortly.
            
            __** General Support **__
            > Please provide your question/topic of what you require support for. If you have any other information regarding
            this issue that would be appreciated as well. A staff member will review everything and respond accordingly when they can.
            
            __** Close the Ticket**__
            > If you no longer need this ticket you can close it below by pressing the \`Close Ticket\` button.
            `
            category = guildProfile.systems.tickets.types.support.category
    } else if (ticketData.ticketType === 'partner') {
        let adLink = 'https://discord.com/channels/834889044969783337/837024468705738782/837052937909174273'
        let reqLink = 'https://discord.com/channels/834889044969783337/836614780139208734/837170838334603325'
        title = "Partnership Submission"
        thumbnail = 'https://media.discordapp.net/attachments/883205604959748136/890746724426088498/Untitled_design__4_-removebg-preview.png'
        description = `
        ** <@${ticketData.creatorID}> Welcome to your Partnership Submission (\`# ${ticketData.ticketID}\`)**
        
        Please read the following information carefully as it will detail the next steps for you.
        
        __**Submitting a Server Ad**__
        > => Please send your servers advertisement in codeblock format.
        > => Please make sure you have nothing obstructing your invite link in anyway. This includes markdown of any type.
        
        __**Posting Knight Owl's Ad**__
        > => The advertisement for knight owl can be found in: [#📰︰our・ad](${adLink}).
        > => Once posted please send a Screen shot of the posted ad in your server's partnership channel.

        __**Requirements**__
        Knight Owl does not and will never partner with servers that contain or are involved in the following: 
        > => NSFW (18+) servers
        > => Invite Reward
        > => Hate Speech/Racism
        > => Hacking / Malicious Coding/Programming
        > => Servers that breach Discord's or another platform's Terms of Service / Guidelines.
        > => for our base requirements [Click Here](${reqLink})

        __**Close Ticket**__
        > If you no longer need this ticket you can close it below by pressing on the \`Close Ticket\` button.
        `
        category = guildProfile.systems.tickets.types.partnerships.category
    }
    let channel = await member.guild.channels.create(ticketData.channelName, {
        parent: category,
        reason: "Ticket Creation", 
        permissionOverwrites: permissions
    });


    let ticketEmbed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setThumbnail(thumbnail)
        .setFooter(`${member.guild.name}`, member.guild.iconURL({dynamic: true}))
        .setColor(member.guild.me.displayHexColor)

    let row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('close-ticket')
                .setStyle('PRIMARY')
                .setLabel('Close Ticket')
        )
    await updateTicket(channel, ticketData)
    await channel.send({embeds: [ticketEmbed], components: [row]})
    await sendTicketLog(guildProfile, interaction, ticketData, 'open')
    
};

exports.createTicket = async function(member, ticketType, guildProfile, interaction) {
    let ticketData;
    let ticketIDNumber = helper.getTicketID(guildProfile);
    try {
        let newTicket = new ticketSchema({
            ticketID: ticketIDNumber,
            ticketType: ticketType,
            channelName: `ticket-${member.displayName}`,
            creator: member.displayName,
            creatorID: member.id,
            createdDate: Date.now(),
        });
        newTicket.save();
        ticketData = newTicket
    } catch (err) {
        console.error(err)
    };
    
    await createTicketChannel(member, ticketData, guildProfile, interaction)
};

exports.createTicketMessage = async function(channel, tType){
    let title;
    let description;
    let thumbnail;
    let row;
    if (tType === 'partner') {
        title = 'Partnership Submissions'
        description = `
        Press the button below to open a ticket to:
        > => Speak with a Partner Manager
        > => Submit your server's Ad for review`
        thumbnail = 'https://media.discordapp.net/attachments/883205604959748136/890746724426088498/Untitled_design__4_-removebg-preview.png'
        row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Partnership Submission')
                    .setCustomId('partner')
                    .setStyle('PRIMARY')
            )
                
    } else if (tType === 'secure') {
        title = 'Secure Channel'
        description = `
        Press the button below to open a channel to:
        > => Claim a prize
        > => Report a staff member
        > => Speak to an Owner or Administrator`
        thumbnail = 'https://media.discordapp.net/attachments/883205604959748136/890746717320937542/final_614d101a066f0c002965408b_934801-removebg-preview_1.png'
        row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Open Secure Channel')
                    .setCustomId('secure')
                    .setStyle('PRIMARY')
            )
    } else if (tType === 'support') {
        title = 'Support Ticket'
        description = `
        Press the button below to open a channel to:
        > => Receive general support
        > => Reeport a member/bug
        > => Recieve Usage information.`
        thumbnail = 'https://media.discordapp.net/attachments/883205604959748136/890746720852541480/Untitled_design__2_-removebg-preview.png'
        row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Open Support Ticket')
                    .setCustomId('support')
                    .setStyle('PRIMARY')
            )
    }
    let embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setThumbnail(thumbnail)
        .setColor(channel.guild.me.displayHexColor)
    
    let m = await channel.send({embeds: [embed], components: [row]})
    return m.id
};

exports.sendConfirmation = function(interaction) {
    let row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('yes-close')
                .setLabel('Yes, Close')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('do-not-close')
                .setLabel('No, Cancel')
                .setStyle('DANGER')
        )
    let embed = new MessageEmbed()
        .setTitle("Are you sure?")
        .setDescription('Are you sure you want to close this ticket? Please choose below.')
        .setColor(interaction.guild.me.displayHexColor)
    return interaction.reply({embeds: [embed], components: [row]})

};

exports.closeTicket = async function(interaction, guildProfile) {
    let ticket = await ticketSchema.findOne({channelID: interaction.channel.id})
    if (!ticket || ticket.isActive === false) {
        return interaction.reply({content: `Something went wrong. There are no open tickets that meet the criteria: ChannelID: \`${interaction.channel.id}\``, ephemeral: true});
    
    } else {
        await interaction.channel.delete({reason: `Ticket closed by ${interaction.user.tag}`})
        ticket.isActive = false
        ticket.save();
        await sendTicketLog(guildProfile, interaction, ticket, 'close')
    }
}
