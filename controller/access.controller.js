const tokenService = require("../services/token.service");
const menus = require("../jsonApi/menu.json");

const getMenu = (req, res) => {
	const token = tokenService.verifyToken(req);
	if (token.isVerified) {
		res.json({
			data: menus[token.data.role]
		})
	} else {
		res.status(401);
		res.json({
			status: 401,
			message: "Unauthorized user"
		});
	}
}

module.exports = {
	getMenu
}