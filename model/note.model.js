const mongoose = require("mongoose");
const { Schema } = mongoose;

const noteSchema = new Schema({
	companyId : [String],
	noteName: {
		type: String,
		lowercase : true,
		required : [true, "Note Name is required"]
	},
	note: [String],
	createdAt : {
		type : Date,
		default : Date.now
	},
	updatedAt : {
		type : Date,
		default : Date.now
	}
});

module.exports = mongoose.model("Note", noteSchema);