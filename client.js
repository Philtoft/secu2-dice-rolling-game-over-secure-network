const net = require("net");
const { splitArr, removeKeyword } = require("./pedersen.js");
const Pedersen = require("./pedersen.js");
require("dotenv").config();

const port = 8888;

const client1 = new net.Socket();

const p = process.env.P;
const g = process.env.G;
const s = process.env.SECRET;
const r = "e93c58e6f7f3f4b6f6f0e55f3a4191b87d58b7b1";
const pedersen = new Pedersen(p, g);

/**
 * Process:
 *
 * 1) Roll dice. Send commitment to server. Send key
 */
let serverCommit;

client1.connect(port, function () {
	// 1) Creates random dice roll
	let diceRoll = rollDice();

	// 2) sends a commit message

	console.log("====================================");
	console.log("2) Commit", pedersen.commit(diceRoll, s, r).toString());
	console.log("====================================");

	let commit = pedersen.commit(diceRoll, s, r);

	client1.write("Commit:" + commit.toString());
});

client1.on("data", function (data) {
	if (data.toString().includes("Commit")) {
		serverCommit = splitArr(removeKeyword(data, "Commit: "));

		console.log("====================================");
		console.log("6) Server Commit", serverCommit);
		console.log("====================================");
	}

	if (data.toString().includes("Key")) {
		console.log("====================================");
		console.log("Key data: " + data);
		console.log("====================================");
	}
});

function rollDice() {
	return (Math.floor(Math.random() * 6) + 1).toString();
}
