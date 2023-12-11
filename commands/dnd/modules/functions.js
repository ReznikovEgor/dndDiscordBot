const fs = require('node:fs');
// const path = require('node:path');
// Functions for checking if object exists in a server's D&D JSON file

// checks if a player exists in a server's JSON
function playerExists(players, player) {
	return players.filter(function(p) {
		return p.nickname.toLowerCase() == player.toLowerCase();
	});
}

// checks if a game exists in a server's JSON
function gameExists(games, gameName) {
	return games.filter(function(g) {
		return g.name.toLowerCase() == gameName.toLowerCase();
	});
}

function findIndex(players, playerName) {
	let index = 0;
	while (players[index].nickname.toLowerCase() != playerName.toLowerCase() && players[index].dndname.toLowerCase() != playerName.toLowerCase()) {
		index++;
	}
	return index;
}

// Functions to edit game JSON file

// takes in a player object and writes to the games.json file
function addToFile(player, gameName, gamePath) {

	// reads games json file and extracts games object
	const obj = JSON.parse(fs.readFileSync(gamePath, 'utf8'));
	const game = obj['games'].filter(function(data) { return data.name == gameName; })[0];

	// if the player does not exist, add player to the current campaign
	if (playerExists(game['players'], player.nickname).length == 0) {
		game['players'].push(player);
		fs.writeFileSync(gamePath, JSON.stringify(obj, null, 2));
	}
}

module.exports = { playerExists, gameExists, findIndex, addToFile };