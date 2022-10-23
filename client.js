const net = require("net");
const { splitArr, removeKeyword } = require("./pedersen.js");
const Pedersen = require("./pedersen.js");
require("dotenv").config();

const port = 8888;

const client1 = new net.Socket();

const p = process.env.P;
const g = process.env.G;
// TODO: Should generate secret
const pedersen = new Pedersen(p, g);
const clientSecret = pedersen.newSecret();

let serverCommit, serverSecret, serverMessage;

let clientCommit, clientMessage;

client1.connect(port, function () {
	// 1) Creates random dice roll
	clientMessage = rollDice();

	clientCommit = pedersen.commit(clientMessage, clientSecret);

	client1.write("Commit: " + clientCommit.toString());
});

client1.on("data", function (data) {
	// 6) Receives server commit
	if (data.toString().includes("Commit")) {
		serverCommit = splitArr(removeKeyword(data, "Commit: "));

		// 7) Sends r to server
		client1.write("Secret: " + clientSecret);
	}

	// 10 receives value r from server
	if (data.toString().includes("Secret")) {
		serverSecret = data.toString().replace("Secret: ", "");

		// 11) Sends message to server
		client1.write("Message: " + clientMessage);
	}

	// 14) Receives server message
	if (data.toString().includes("Message")) {
		serverMessage = data.toString().replace("Message: ", "");

		let verify = pedersen.verify(serverMessage, [serverCommit], serverSecret);

		console.log("====================================");
		console.log("Server verified", verify);
		console.log("====================================");

		// De bruger combine...
	}
});

function rollDice() {
	return (Math.floor(Math.random() * 6) + 1).toString();
}
