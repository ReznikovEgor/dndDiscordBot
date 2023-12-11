const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');


// looks for the gameName in the array of games in the json file
function gameExists(games, gameName) {
	return games.filter(function(g) {
		return g.name.toLowerCase() == gameName.toLowerCase();
	});
}

// finds the index of existing game
function findIndex(games, gameName) {
	let index = 0;
	while (games[index].name.toLowerCase() != gameName.toLowerCase()) {
		index++;
	}
	return index;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removegame')
		.setDescription('Removes a specific campaign')
		.addStringOption(option =>
			option
				.setName('gamename')
				.setDescription('Campaign to remove')
				.setRequired(true)),

	async execute(interaction) {
		const gameName = interaction.options.getString('gamename');
		const gamePath = path.join(__dirname, `../../data/${interaction.guild.id}.json`);
		const obj = JSON.parse(fs.readFileSync(gamePath, 'utf8'));
		const games = obj['games'];
		const gameIndex = gameExists(games, gameName)[0] != null ? findIndex(games, gameName) : -1;

		let response = '';

		if (gameIndex >= 0) {
			games.splice(gameIndex, 1);
			console.log(games);
			fs.writeFileSync(gamePath, JSON.stringify(obj, null, 2));
			response = 'The game was successfully removed';
		} else {
			response = 'That game does not exist. Use /listgames to see the existing games';
		}
		await interaction.reply(response);
	},
};