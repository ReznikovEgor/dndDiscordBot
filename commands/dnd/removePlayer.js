const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

function playerExists(players, playerName) {
	return players.filter(function(p) {
		return p.dndname.toLowerCase() == playerName.toLowerCase() || p.nickname.toLowerCase() == playerName.toLowerCase();
	});
}

function findIndex(players, playerName) {
	let index = 0;
	while (players[index].nickname.toLowerCase() != playerName.toLowerCase() && players[index].dndname.toLowerCase() != playerName.toLowerCase()) {
		index++;
	}
	return index;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removeplayer')
		.setDescription('Removes the desired player')
		.addStringOption(option =>
			option
				.setName('playername')
				.setDescription('Player to remove from current campaign or specified game')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('gamename')
				.setDescription('Specify a campaign name or leave empty for current campagin')
				.setRequired(false)),

	async execute(interaction) {

		const { currentGame } = require(`../../data/${interaction.guild.id}.json`);
		const playerName = interaction.options.getString('playername');
		const gameName = interaction.options.getString('gamename');
		const selectedGame = gameName != null ? gameName : currentGame;
		const gamePath = path.join(__dirname, `../../data/${interaction.guild.id}.json`);
		const obj = JSON.parse(fs.readFileSync(gamePath, 'utf8'));
		const game = obj['games'].filter(function(data) { return data.name == selectedGame; })[0];
		const players = game['players'];
		console.log(players[0]);
		const playerIndex = playerExists(players, playerName)[0] != null ? findIndex(players, playerName) : -1;

		let response = '';
		if (playerIndex >= 0) {
			players.splice(playerIndex, 1);
			fs.writeFileSync(gamePath, JSON.stringify(obj, null, 2));
			response = 'The player was successfully removed';
		} else {
			response = 'That player is not in the selected game. Use /listplayers to see the players in the game';
		}
		await interaction.reply(response);
	},
};