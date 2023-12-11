const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('begin')
		.setDescription('Begins the adventure')
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
		if (!gameStatus) {
			const gameName = interaction.options.getString('gamename') != null ? interaction.options.getString('gamename') : currentGame;
			const players = obj['games'].filter(function(data) { return data.name == gameName; })[0]['players'];
			players.forEach((p) => {
				console.log(`id: ${p.id}\ndndname:${p.dndname}`);
				interaction.guild.members.fetch(p.id)
					.then(player => {
						player.setNickname(p.dndname);
					});
			});
			obj['active'] = true;
			fs.writeFileSync(gamePath, JSON.stringify(obj, null, 2));
			await interaction.reply(`The Current Game is: ${currentGame}\nThe Adventure has Begun!`);
		} else {
			await interaction.reply(`The Game: ${currentGame} is already running, end that game first before beginning another adventure`);
		}
	},
};