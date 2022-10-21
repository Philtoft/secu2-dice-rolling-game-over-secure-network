const net = require("net");

const port = 8888;

const server = net.createServer(onClientConnection);

/**
 * Udfordring:
 * 1) Hvordan får jeg serveren til at sende en besked til brugeren?
 */

server.listen(port, function () {
	console.log(`Server started on port ${port}`);
});

function onClientConnection(sock) {
	console.log("====================================");
	console.log("Started");
	console.log("====================================");

	console.log(`${sock.remoteAddress}:${sock.remotePort} Connected`);

	sock.on("data", function (data) {
		let diceRoll = rollDice();
		// console.log("====================================");
		// console.log("From client: " + data);
		// console.log("====================================");
		// sock.write("commit: " + diceRoll);

		if (data.toString().includes("Commit")) {
			console.log("====================================");
			console.log("Commit: " + data);
			console.log("====================================");

			sock.write("Commit: " + diceRoll);
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
