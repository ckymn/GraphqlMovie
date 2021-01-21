const mongoose = require("mongoose");
const { Schema } = mongoose;


// graphql'deki movie veritabani
const movieSchema = new Schema({
	title: String,
	description: String,
	year: Number,
	directorId: String
})


module.exports = mongoose.model("Movie",movieSchema);