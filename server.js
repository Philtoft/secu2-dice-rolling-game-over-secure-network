const net = require("net");
const { removeKeyword, splitArr } = require("./pedersen");
const Pedersen = require("./pedersen");
require("dotenv").config();

const port = 8888;

const server = net.createServer(onClientConnection);

const p = process.env.P;
const g = process.env.G;

// TODO: Should generate secret
const pedersen = new Pedersen(p, g);
const serverSecret = pedersen.newSecret();

server.listen(port);

let serverCommit, serverMessage;

let clientCommit, clientSecret, clientMessage;

function onClientConnection(sock) {
	sock.on("data", function (data) {
		// 2) Server receives commit message
		if (data.toString().includes("Commit")) {
			clientCommit = splitArr(removeKeyword(data, "Commit: "));

			// 4)
			serverMessage = rollDice();
			serverCommit = pedersen.commit(serverMessage, serverSecret);

			// 5) Sends commit message to client
			sock.write("Commit: " + serverCommit.toString());
		}

		if (data.toString().includes("Secret")) {
			// 8) Receives Secret msg r
			clientSecret = data.toString().replace("Secret: ", "");

			// 9) sends Secret value s
			sock.write("Secret: " + serverSecret);
		}

		// 12) Receives message from client
		if (data.toString().includes("Message: ")) {
			clientMessage = data.toString().replace("Message: ", "");

			// 13) send m' to client
			sock.write("Message: " + serverMessage);

			let verify = pedersen.verify(clientMessage, [clientCommit], clientSecret);

			console.log("====================================");
			console.log("Alice verified", verify);
			console.log("====================================");
		}
	});
}

function rollDice() {
	return (Math.floor(Math.random() * 6) + 1).toString();
}
