module.exports = (app) => {
    const notes = require("../controllers/note.controller.js");  //require the controller file to handle CRUD operations

    app.post("/notes", notes.create); //create a new Note

    app.get("/notes", notes.findAll); //display all notes

    app.get("/notes/:noteId", notes.findOne); //get specific note with noteId
    
    app.put("/notes/:noteId", notes.update);  //update note with noteId

    app.delete("/notes/:noteId", notes.delete); //delete note with noteId
}