const tokenService = require("../services/token.service");
const databaseService = require("../services/database.service");

const countNotes = async (req, res) => {
	const token = tokenService.verifyToken(req);
	if (token.isVerified) {
		const query = {
			companyId: token.data._id
		}
		try {
			const response = await databaseService.countRecords(query, "notes");
			res.json({
				data: response
			})
		} catch (error) {
			res.status(500);
			res.json({
				message: "internal server error"
			})
		}
	} else {
		res.status(401);
		res.json({
			message: "unauthorized user"
		})
	}
}

const paginate = async (req, res) => {
	const token = tokenService.verifyToken(req);
	if (token.isVerified) {
		const from = Number(req.params.from);
		const to = Number(req.params.to);
		const query = {
			companyId: token.data._id,
		}
		const response = await databaseService.paginate(query, from, to, "notes");
		res.json({
			data: response
		})
	} else {
		res.status(401);
		res.json({
			message: "unauthorized user"
		})
	}
}

const create = async (req, res) => {
	const token = tokenService.verifyToken(req);
	if (token.isVerified) {
		const formdata = {
			companyId: token.data._id,
			...req.body
		}

		try {
			const response = await databaseService.createRecord(formdata, "notes");
			res.status(201);
			res.json({
				data: response,
				message: "record created"
			});
		} catch (error) {
			if (error.type && error.type == "duplicate") {
				res.status(409);
				res.json({
					...error
				})
			} else {
				res.status(400);
				res.json(Object.entries(error.errors).map((err) => {
					return err[1];
				}));
			}
		}
	} else {
		res.status(401);
		res.json({
			message: "unauthorized user"
		})
	}
}

const deleteNote = async (req, res) => {
	const token = tokenService.verifyToken(req);
	if (token.isVerified) {
		const clientId = req.params.id;
		try {
			const response = await databaseService.deleteRecordById(clientId, "notes");
			if (response != null) {
				res.json({
					message: "your record has been deleted"
				})
			} else {
				res.status(400);
				res.json({
					message: "no client found"
				})
			}
		} catch (error) {
			res.status(500);
			res.json({
				message: "internal server error"
			})
		}
	} else {
		res.status(401);
		res.json({
			message: "unauthorized user"
		})
	}
}


module.exports = {
	countNotes,
	paginate,
	create,
	deleteNote
}