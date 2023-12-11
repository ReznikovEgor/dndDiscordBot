const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');


// const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// sets up the slash command, provides an optional parameter for a specific campaign or will default to the current campaign
module.exports = {
	data: new SlashCommandBuilder()
		.setName('listplayers')
		.setDescription('Replies with a list of all the players')
		.addStringOption(option =>
			option
				.setName('gamename')
				.setDescription('Specify campaign or leave blank for current campaign')
				.setRequired(false)),

	async execute(interaction) {

		const { currentGame } = require(`../../data/${interaction.guild.id}.json`);
		const gameName = interaction.options.getString('gamename');
		const selectedGame = gameName != null ? gameName : currentGame;

		// replys to the user with a list of the players current discord name/nickname and their dnd character's name
		const gamePath = path.join(__dirname, `../../data/${interaction.guild.id}.json`);
		const obj = JSON.parse(fs.readFileSync(gamePath, 'utf8'));
		const game = obj['games'].filter(function(data) { return data.name == selectedGame; })[0];
		const players = game['players'];
		let playerText = '';
		players.forEach((player) => {
			playerText += `${player.nickname}(${player.dndname})\n`;
		});
		interaction.reply(`The Players in ${currentGame} are \n${playerText}`);
	},
};