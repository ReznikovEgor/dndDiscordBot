const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { gameExists } = require('./modules/functions');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('creategame')
		.setDescription('Creates a new campaign')
		.addStringOption(option =>
			option
				.setName('gamename')
				.setDescription('New campaign\'s name')
				.setRequired(true)),

	async execute(interaction) {
		const gameName = interaction.options.getString('gamename');
		const gamePath = path.join(__dirname, `../../data/${interaction.guild.id}.json`);

		const obj = JSON.parse(fs.readFileSync(gamePath, 'utf8'));
		const games = obj['games'];
		let response = "";
		if (gameExists(games, gameName).length == 0) {
			if (games.length == 0) {
				obj['currentGame'] = gameName;
			}
			const newGame = {
				'name': gameName,
				'players': [],
			};
			games.push(newGame);
			fs.writeFileSync(gamePath, JSON.stringify(obj, null, 2));
			repsone = `The campaign ${gameName} was created successfully`;
		} else {
			response = 'A game with this name already exists';
		}
		await interaction.reply(response);
	},
};