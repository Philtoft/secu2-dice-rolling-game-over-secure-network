const net = require("net");
const { removeKeyword, splitArr } = require("./pedersen");
const Pedersen = require("./pedersen");
require("dotenv").config();

const port = 8888;

const server = net.createServer(onClientConnection);

const p = process.env.P;
const g = process.env.G;

// TODO: Should generate secret
const s = process.env.SECRET;
const r = "ba1303c4f29bd959f585dc0dcfb3dbd0cebecd48";
const pedersen = new Pedersen(p, g);

/**
 * Udfordring:
 * 1) Hvordan får jeg serveren til at sende en besked til brugeren?
 */

server.listen(port, function () {
	console.log(`Server started on port ${port}`);
});

let serverCommit, serverRandom, serverMessage;

let clientCommit, clientRandom, clientMessage;

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
			console.log("====================================");
			console.log("3) Client Commit", clientCommit);
			console.log("====================================");

			// 4)
			serverMessage = rollDice();
			serverCommit = pedersen.commit(serverMessage, s, r);

			console.log("====================================");
			console.log("4) Commit", serverCommit);
			console.log("====================================");

			// 5) Sends commit message to client
			sock.write("Commit: " + serverCommit.toString());
		}

		if (data.toString().includes("Random")) {
			// 8) Receives random msg r
			clientRandom = data.toString().replace("Random: ", "");

			console.log("====================================");
			console.log("8) Client Random: ", clientRandom);
			console.log("====================================");

			// 9) sends random value r
			sock.write("Random: " + r);
		}

		// 12) Receives message from client
		if (data.toString().includes("Message: ")) {
			clientMessage = data.toString().replace("Message: ", "");

			console.log("====================================");
			console.log("12) Client message", clientMessage);
			console.log("====================================");

			// 13) send m' to client
			sock.write("Message: " + serverMessage);
		}
	});
}

function rollDice() {
	return (Math.floor(Math.random() * 6) + 1).toString();
}
