require("dotenv").config();

module.exports = {
	getGenerator() {
		return process.env.G;
	},
};
