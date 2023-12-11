const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

function returnGames(gameNames) {
	let gamesText = '';
	gameNames.forEach((game) => {
		gamesText += `${game.name}\n`;
	});
	return gamesText;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listgames')
		.setDescription('Replies with all the campaigns'),
	async execute(interaction) {
		const gamePath = path.join(__dirname, `../../data/${interaction.guild.id}.json`);
		const obj = JSON.parse(fs.readFileSync(gamePath, 'utf8'));
		const gameNames = obj['games'];
		const toSend = returnGames(gameNames);
		await interaction.reply(`The games are \n${toSend}`);
	},
};