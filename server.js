const net = require("net");
const { removeKeyword, splitArr } = require("./pedersen");
const Pedersen = require("./pedersen");
require("dotenv").config();

const port = 8888;

const server = net.createServer(onClientConnection);

const p = process.env.P;
const g = process.env.G;

// TODO: Should generate secret
const r = "ba1303c4f29bd959f585dc0dcfb3dbd0cebecd48";
const pedersen = new Pedersen(p, g);
const serverSecret = pedersen.newSecret();

/**
 * Udfordring:
 * 1) Hvordan får jeg serveren til at sende en besked til brugeren?
 */

server.listen(port, function () {
	console.log(`Server started on port ${port}`);
});

let serverCommit, serverMessage;

let clientCommit, clientSecret, clientMessage;

function onClientConnection(sock) {
	console.log("====================================");
	console.log("Started");
	console.log("====================================");

	console.log(`${sock.remoteAddress}:${sock.remotePort} Connected`);

	sock.on("data", function (data) {
		// 2) Server receives commit message
		if (data.toString().includes("Commit")) {
			clientCommit = splitArr(removeKeyword(data, "Commit: "));

			// 3) Receives commit from client
			// console.log("====================================");
			// console.log("3) Client Commit", clientCommit);
			// console.log("====================================");

			// 4)
			serverMessage = rollDice();
			serverCommit = pedersen.commit(serverMessage, serverSecret, r);

			// console.log("====================================");
			// console.log("4) Commit", serverCommit.toString());
			// console.log("====================================");

			// 5) Sends commit message to client
			sock.write("Commit: " + serverCommit.toString());
		}

		if (data.toString().includes("Secret")) {
			// 8) Receives Secret msg r
			clientSecret = data.toString().replace("Secret: ", "");

			console.log("====================================");
			console.log("8) Client Secret: ", clientSecret);
			console.log("====================================");

			// 9) sends Secret value s
			sock.write("Secret: " + serverSecret);
		}

		// 12) Receives message from client
		if (data.toString().includes("Message: ")) {
			clientMessage = data.toString().replace("Message: ", "");

			// console.log("====================================");
			// console.log("12) Client message", clientMessage);
			// console.log("====================================");

			// 13) send m' to client
			sock.write("Message: " + serverMessage);

			// 16) Verify that c=C(m, r)

			let clientGeneratedCommit = new Pedersen(p, g);

			// console.log("====================================");
			// console.log("Message", clientMessage);
			// console.log("Commit", clientCommit);
			// console.log("Secret", clientSecret);
			// console.log("====================================");

			let verify = clientGeneratedCommit.verify(
				clientMessage,
				[clientCommit],
				clientSecret
			);

			console.log("====================================");
			console.log("Client verify", verify);
			console.log("====================================");
		}
	});
}

function rollDice() {
	return (Math.floor(Math.random() * 6) + 1).toString();
}
