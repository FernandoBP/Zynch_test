const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    names: String,
    phone: String,
    "e-mail": String
});


const ModelUser = mongoose.model("users", userSchema);
module.exports = ModelUser;
