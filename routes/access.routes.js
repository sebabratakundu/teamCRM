const express = require("express");
const router = express.Router();
const accessController = require("../controller/access.controller");

router.get("/menu", (req, res) => {
	accessController.getMenu(req, res);
})

module.exports = router;