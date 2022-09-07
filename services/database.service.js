require("dotenv").config();
const mongoose = require("mongoose");
const Company = require("../model/company.model");
const User = require("../model/user.model");
const Client = require("../model/client.modal");
const Note = require("../model/note.model");
const dbName = process.env.DATABASE_NAME;
const dbPassword = process.env.DATABASE_PASSWORD;
const url = `mongodb+srv://teamcrm:${dbPassword}@teamcrm.kzmrw.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true
}

// connect to mongodb globally
mongoose.connect(url, options);

const Models = {
	companies: Company,
	users: User,
	clients: Client,
	notes: Note
}

const createRecord = async (formdata, collection_name) => {
	const currentModel = Models[collection_name];
	const company = new currentModel(formdata);
	const response = await company.save();

	return response;
}

const getRecordByQuery = async (query, collection_name) => {
	const currentModal = Models[collection_name];
	const response = await currentModal.find(query);

	return response;
}

const getRecordById = async (id, collection_name) => {
	const currentModal = Models[collection_name];
	const response = await currentModal.findById(id);

	return response;
}

const updateRecord = async (query, data, collection_name) => {
	const currentModel = Models[collection_name];
	const response = await currentModel.updateOne(query, data);

	return response;
}

const updateRecordById = async (id, data, collection_name) => {
	const currentModel = Models[collection_name];
	const response = await currentModel.findByIdAndUpdate(id, data, {new: true});

	return response;
}

const countRecords = async (query, collection_name) => {
	const currentModel = Models[collection_name];
	const response = await currentModel.countDocuments(query);

	return response;
}

const paginate = async (query, from, to, collection_name) => {
	const currentModel = Models[collection_name];
	const response = await currentModel.find(query).skip(from).limit(to);

	return response;
}

const deleteRecordById = async (id, collection_name) => {
	const currentModel = Models[collection_name];
	const response = await currentModel.findByIdAndDelete(id);

	return response;
}

module.exports = {
	createRecord,
	getRecordByQuery,
	getRecordById,
	updateRecord,
	updateRecordById,
	countRecords,
	paginate,
	deleteRecordById
}