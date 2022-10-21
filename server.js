const net = require("net");
const { removeKeyword, splitArr } = require("./pedersen");
const Pedersen = require("./pedersen");
require("dotenv").config();

const port = 8888;

const server = net.createServer(onClientConnection);

const p = process.env.P;
const g = process.env.G;
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

let clientCommit;

function onClientConnection(sock) {
	console.log("====================================");
	console.log("Started");
	console.log("====================================");

	console.log(`${sock.remoteAddress}:${sock.remotePort} Connected`);

	sock.on("data", function (data) {
		let diceRoll = rollDice();

		// 2) Server receives commit message
		if (data.toString().includes("Commit")) {
			clientCommit = splitArr(removeKeyword(data, "Commit: "));

			// Splits commit from client
			console.log("====================================");
			console.log("3) Client Commit", clientCommit);
			console.log("====================================");

			let commit = pedersen.commit(diceRoll, s, r);

			sock.write("Commit: " + commit.toString());
		}

		if (data.toString().includes("Key")) {
			console.log("====================================");
			console.log("Key data: " + data);
			console.log("====================================");

			sock.write("Key: " + Math.floor(Math.random() * 10001));
		}
	});
}

function rollDice() {
	return (Math.floor(Math.random() * 6) + 1).toString();
}
