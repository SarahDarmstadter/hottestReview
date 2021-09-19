const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email : { type: String, required : true, unique : true},
    password : { type: String, required : true}
}, {collection: 'myFirstDatabase.users'});


userSchema.plugin(uniqueValidator);
// Plugin pour Mongoose qui purifie les champs du model avant de les enregistrer dans la base MongoDB. Utilise le HTML Sanitizer de Google Caja pour effectuer la désinfection.

module.exports = mongoose.model('User', userSchema);
