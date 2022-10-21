const net = require("net");
const Pedersen = require("./pedersen.js");
require("dotenv").config();
var pedersen = require("./pedersen.js");

const port = 8888;

const client1 = new net.Socket();

// generates weird outout...
let p = "925f15d93a513b441a78826069b4580e3ee37fc5";
let g = "959144013c88c9782d5edd2d12f54885aa4ba687";
let r = "e93c58e6f7f3f4b6f6f0e55f3a4191b87d58b7b1";
let secret = "1184c47884aeead9816654a63d4209d6e8e906e29";

/**
 * Process:
 *
 * 1) Roll dice. Send commitment to server. Send key
 */

client1.connect(port, function () {
	// Step 1
	let diceRoll = rollDice();

	// 2)
	const pedersen = new Pedersen(p, g);

	console.log("====================================");
	console.log("1) Commit", pedersen.commit(diceRoll, secret, r).toString());
	console.log("====================================");

	// client1.write(diceRoll);
});

client1.on("data", function (data) {
	// console.log("====================================");
	// console.log(data.toString());
	// console.log("====================================");

	let key;

	if (data.toString().includes("Commit")) {
		console.log("====================================");
		console.log("Commit: " + data);
		console.log("====================================");
		client1.write("Key: " + Math.floor(Math.random() * 10001));
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
