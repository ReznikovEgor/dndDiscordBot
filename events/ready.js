const { Events } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);


		const directory = path.join(__dirname, '../data');
		const files = fs.readdirSync(directory);

		// makes sure that all the game statuses are false on bot startup
		files.forEach(file => {
			const filePath = path.join(__dirname, `../data/${file}`);
			const obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
			const gameStatus = obj['active'];
			if (gameStatus) {
				obj['active'] = false;
				fs.writeFileSync(filePath, JSON.stringify(obj, null, 2));
				console.log(`fixed game status for ${file}`);
			}
		});
	},
};