const mongoose = require('mongoose')

// USER SCHEMA FOR DATA
const Schema = mongoose.Schema

const messageSchema = new Schema({
    user_id: { type: mongoose.Schema.ObjectId, required:true},
    message: {type:String, required: true},
}, {
    timestamps:true,
})

const Exercise = mongoose.model('Messages', messageSchema)
module.exports = Exercise