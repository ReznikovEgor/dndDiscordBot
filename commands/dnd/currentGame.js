const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('currentgame')
		.setDescription('Replies with the current game'),
	async execute(interaction) {
		const gamePath = path.join(__dirname, `../../data/${interaction.guild.id}.json`);
		const obj = JSON.parse(fs.readFileSync(gamePath, 'utf8'));
		let response = '';
		if (obj['currentGame'] == '') {
			response = 'There are no games, please create a game using /creategame';
		} else {
			response = `The current game is ${obj['currentGame']}`;
		}
		await interaction.reply(response);

	},
};