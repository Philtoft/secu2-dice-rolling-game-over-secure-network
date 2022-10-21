const net = require("net");
require("dotenv").config();

const port = 8888;

const client1 = new net.Socket();

/**
 * Process:
 *
 * 1) Roll dice. Send commitment to server. Send key
 */

client1.connect(port, function () {
	let diceRoll = rollDice();

	// client1.write(diceRoll);

	client1.write("Commit: Public P: " + process.env.P);
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
