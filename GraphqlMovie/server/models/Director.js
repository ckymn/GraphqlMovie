const mongoose = require("mongoose");
const { Schema } = mongoose;


const directorSchema = new Schema({
	name: String,
    birth: Number
})

module.exports = mongoose.model("Director", directorSchema);