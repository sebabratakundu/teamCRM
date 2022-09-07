const tokenService = require("../services/token.service");
const viewPermission = require("../jsonApi/permission/view.json")


const canView = (req, res, next) => {
	const token = tokenService.verifyToken(req);
	if (token.isVerified) {
		const role = token.data.role;
		let route = req.originalUrl;
		if (route.indexOf("?") !== -1) {
			route = route.split("?")[0];
		}

		if (viewPermission[role].indexOf(route) !== -1) {
			next();
		} else {
			res.status(403);
			res.redirect("/access-denide");
		}
	}
}

module.exports = {
	canView
};