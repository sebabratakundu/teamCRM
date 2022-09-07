const express = require('express');
const {canView} = require("../middleware/permission.middleware");
const router = express.Router();

router.get('/', canView, (req, res) => {
	res.render('dashboard', {title: 'Dashboard'});
});

module.exports = router;