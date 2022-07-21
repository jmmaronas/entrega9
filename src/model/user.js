const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true, trim: true },
    email: { type: String, trim: true }
})

module.exports = mongoose.model("User", userSchema)