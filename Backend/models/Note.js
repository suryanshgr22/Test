const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        title:{
            type:String,
            required:true,         
        },
        text:{
            type:String,
            required:true,        
        }
    },
    {timestamps:true}
)

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;