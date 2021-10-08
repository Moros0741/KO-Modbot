const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, database_srv } = require('./data/config.json');
const mongoose = require('mongoose')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES]});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
};

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
};

mongoose.connect(database_srv, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected to Knight-Owl/KOMod');
}).catch((err) => {
	console.error(err.message)
});

client.login(token);

//mcS40y6P5PIeLips

//mongodb+srv://Moros:mcS40y6P5PIeLips@komod.rlpli.mongodb.net/test

//Click Up TASK ID: CU-1jkdpfc