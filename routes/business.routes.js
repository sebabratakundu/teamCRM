const express = require("express");
const router = express.Router();
const {canView} = require("../middleware/permission.middleware");

router.get("/", canView, (req, res) => {
	res.render("business", {title: 'Business'});
})

module.exports = router;