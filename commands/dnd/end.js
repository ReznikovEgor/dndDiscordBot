const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('end')
		.setDescription('Ends the adventure')
		.addStringOption(option =>
			option
				.setName('gamename')
				.setDescription('Specify campaign or leave blank for current campaign')
				.setRequired(false)),
	// changes the names of the players
	async execute(interaction) {
		const { currentGame } = require(`../../data/${interaction.guild.id}.json`);
		const gamePath = path.join(__dirname, `../../data/${interaction.guild.id}.json`);
		const obj = JSON.parse(fs.readFileSync(gamePath, 'utf8'));
		const gameStatus = obj['active'];
		if (gameStatus) {
			const gameName = interaction.options.getString('gamename') != null ? interaction.options.getString('gamename') : currentGame;
			const players = obj['games'].filter(function(data) { return data.name == gameName; })[0]['players'];
			players.forEach((p) => {
				interaction.guild.members.fetch(p.id)
					.then(player => {
						player.setNickname(p.nickname);
					});
			});
			obj['active'] = false;
			fs.writeFileSync(gamePath, JSON.stringify(obj, null, 2));
			await interaction.reply(`The Current Game is: ${currentGame}\nThe Adventure has Ended :(`);
		} else {
			await interaction.reply('There is no current game running');
		}
	},
};