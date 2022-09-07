const express = require('express');
const {canView} = require("../middleware/permission.middleware");
const router = express.Router();
const noteController = require('../controller/note.controller');

router.get('/', canView, (req, res) => {
	res.render('note', {title: 'Note'});
});

router.get('/:from/:to', (req, res) => {
	noteController.paginate(req, res);
})

router.get('/total', (req, res) => {
	noteController.countNotes(req, res);
})

router.post('/', (req, res) => {
	noteController.create(req, res);
})

router.delete('/:id', (req, res) => {
	noteController.deleteNote(req, res);
})

module.exports = router;