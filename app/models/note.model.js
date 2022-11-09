const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
    title: String,
    content: String
}, {
    timestamps: true
});

module.exports = mongoose.model("Note", noteSchema);

//The model for notes are created. timestamps is built in to generate time stamps for each element in the database
// createdAt and updatedAt are automatically added
