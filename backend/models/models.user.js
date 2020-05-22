const mongoose = require('mongoose')

// USER SCHEMA FOR DATA
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type:String, required: true, unique: true, trim: true, minlength:1},
    name: {type:String, required:true, trim:true, minlength:1},
    password: {type:String, required:true, minlength:1}
}, {
    timestamps:true,
})

const User = mongoose.model('Users', userSchema)

module.exports = User