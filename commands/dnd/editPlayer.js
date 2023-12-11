const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { playerExists } = require('./modules/functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('editplayer')
		.setDescription('Edit an existing player\' DND name')
		.addStringOption(option =>
			option
				.setName('nickname')
				.setDescription('Player\'s Discord name')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('gamename')
				.setDescription('Specify campaign or leave blank for current campaign')
				.setRequired(false))
		.addStringOption(option =>
			option
				.setName('dndname')
				.setDescription('Player\'s character name')
				.setRequired(false))
		.addStringOption(option =>
			option
				.setName('phonenumber')
				.setDescription('Player\'s new phone number')
				.setRequired(false)),
	// changes the names of the players
	async execute(interaction) {
		const { currentGame } = require(`../../data/${interaction.guild.id}.json`);
		// takes the strings from the users inputs
		const playerName = interaction.options.getString('nickname');
		const dndName = interaction.options.getString('dndname');
		const gameName = interaction.options.getString('gamename');
		// const phoneNumber = interaction.options.getString('phonenumber');

		if (playerName == '' && dndName == '') {
			await interaction.reply('Please provide either the DND name or the discord name');
		}

		// chooses either the provided game or the current selected game
		const selectedGame = gameName != null ? gameName : currentGame;
		const gamePath = path.join(__dirname, `../../data/${interaction.guild.id}.json`);
		const obj = JSON.parse(fs.readFileSync(gamePath, 'utf8'));
		const game = obj['games'].filter(function(data) { return data.name == selectedGame; })[0];
		const players = game['players'];

		if (playerExists(players, playerName)) {
			console.log('no finished');
		}

	},
};