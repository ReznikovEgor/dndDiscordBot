const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { addToFile } = require('./modules/functions');

// returns the Discord Member's Id and Discord nickname using the provided username/nickname
async function retrieveId(nickName, guild) {
	const res = await guild.members.fetch();
	let id = 0;
	let name = '';
	res.forEach((member) => {
		if (member.user.username.toLowerCase() == nickName || (member.nickname != null ? member.nickname.toLowerCase() : '') == nickName
			|| (nickName.length >= 4 && member.user.username.toLowerCase().includes(nickName))) {
			id = member.id;
			name = member.nickname != undefined ? member.nickname : member.user.username;
		}
	});
	return [id, name];
}


// sets up the slash command
module.exports = {
	data: new SlashCommandBuilder()
		.setName('addplayer')
		.setDescription('Adds player to current campaign')
		.addStringOption(option =>
			option
				.setName('nickname')
				.setDescription('Player\'s Discord name')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('dndname')
				.setDescription('Player\'s character name')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('gamename')
				.setDescription('Specify campaign or leave blank for current campaign')
				.setRequired(false))
		.addStringOption(option =>
			option
				.setName('phonenumber')
				.setDescription('If you would like to remind players through text message, provide a phone number')
				.setRequired(false)),

	async execute(interaction) {

		const { currentGame } = require(`../../data/${interaction.guild.id}.json`);
		// takes the strings from the users inputs
		const nickName = interaction.options.getString('nickname');
		const dndName = interaction.options.getString('dndname');
		const gameName = interaction.options.getString('gamename');
		const phoneNumber = interaction.options.getString('phonenumber');

		// chooses either the provided game or the current selected game
		const selectedGame = gameName != null ? gameName : currentGame;
		const gamePath = path.join(__dirname, `../../data/${interaction.guild.id}.json`);

		const [userID, currentName] = await retrieveId(nickName.toLowerCase(), interaction.guild);
		console.log(`selectedGame:${selectedGame}`);
		let response = '';
		// checks if the player is in the server and retrieve their id
		if (userID && selectedGame != '') {
			console.log(`adding ${currentName}(${dndName}) to ${selectedGame}`);

			// checks if the json length will change after adding a player to the json file
			const jsonLengthBefore = fs.readFileSync(gamePath, 'utf8').length;
			addToFile({ 'nickname':currentName, 'dndname':dndName, 'id':userID, 'phonenumber':phoneNumber }, selectedGame, gamePath);
			const jsonLengthAfter = fs.readFileSync(gamePath, 'utf8').length;

			if (jsonLengthBefore == jsonLengthAfter) {
				response = `${nickName} has already been added to the campaign`;
			} else {
				response = `${nickName}(${dndName}) has been added to ${selectedGame}`;
			}
		} else if (selectedGame == '') {
			response = 'There are no campaigns, create a campaign before adding players';
		} else {
			response = 'User is not in this channel. \nPlease provide an existing username/nickname\nUse /listplayers to see the existing players';
		}
		await interaction.reply(response);
	},
};