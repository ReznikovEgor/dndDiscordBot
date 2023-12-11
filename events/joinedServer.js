const { Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const dataPath = path.join(__dirname, '../data/');

// this event triggers when the discord bot joins a new discord guild
module.exports = {
	name: Events.GuildCreate,
	once: true,
	execute(guild) {
		console.log(`Bot joined ${guild}`);
		// checks if there is a json file with the guild id when joining
		if (!fs.existsSync(`${dataPath}/${guild.id}.json`)) {
			const newJSON = {
				'active': false,
				'currentGame': '',
				'games': [],
			};
			// creates a new json file for the new guild
			fs.writeFileSync(`${dataPath}${guild.id}.json`, JSON.stringify(newJSON));
		}
	},
};