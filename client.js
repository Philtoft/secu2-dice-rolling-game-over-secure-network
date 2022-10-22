const net = require("net");
const { splitArr, removeKeyword } = require("./pedersen.js");
const Pedersen = require("./pedersen.js");
require("dotenv").config();

const port = 8888;

const client1 = new net.Socket();

const p = process.env.P;
const g = process.env.G;
// TODO: Should generate secret
const clientSecret = process.env.SECRET;
const r = "e93c58e6f7f3f4b6f6f0e55f3a4191b87d58b7b1";
const pedersen = new Pedersen(p, g);

/**
 * Process:
 *
 * 1) Roll dice. Send commitment to server. Send key
 */
let serverCommit, serverSecret, serverMessage;

let clientCommit, clientMessage;

client1.connect(port, function () {
	// 1) Creates random dice roll
	clientMessage = rollDice();

	clientCommit = pedersen.commit(clientMessage, clientSecret, r);

	// 2) sends a commit message
	// console.log("====================================");
	// console.log("2) Commit", clientCommit.toString());
	// console.log("====================================");

	client1.write("Commit:" + clientCommit.toString());
});

client1.on("data", function (data) {
	// 6) Receives server commit
	if (data.toString().includes("Commit")) {
		serverCommit = splitArr(removeKeyword(data, "Commit: "));

		// console.log("====================================");
		// console.log("6) Server commit", serverCommit);
		// console.log("====================================");

		// 7) Sends r to server
		client1.write("Secret: " + clientSecret);
	}

	// 10 receives value r from server
	if (data.toString().includes("Secret")) {
		serverSecret = data.toString().replace("Secret: ", "");

		// console.log("====================================");
		// console.log("10) Server Secret", serverSecret);
		// console.log("====================================");

		// 11) Sends message to server
		client1.write("Message: " + clientMessage);
	}

	// 14) Receives server message
	if (data.toString().includes("Message")) {
		serverMessage = data.toString().replace("Message: ", "");

		// console.log("====================================");
		// console.log("14) Server message", serverMessage);
		// console.log("====================================");

		// 15) Verify that c = C(m', 'r)
		let serverGeneratedCommit = new Pedersen(p, g);

		// console.log("====================================");
		// console.log("Message", serverMessage);
		// console.log("Commit", serverCommit);
		// console.log("Secret", serverSecret);
		// console.log("====================================");

		let verify = serverGeneratedCommit.verify(
			serverMessage,
			serverCommit,
			serverSecret
		);

		// console.log("====================================");
		// console.log("Server commit", serverCommit);
		// console.log("Server verify", verify);
		// console.log("====================================");

		// De bruger combine...
	}
});

function rollDice() {
	return (Math.floor(Math.random() * 6) + 1).toString();
}
