const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('dashboard', {title: 'dashboard'});
});

module.exports = router;