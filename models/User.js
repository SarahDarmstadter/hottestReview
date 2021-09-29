const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email : { type: String, required : true, unique : true},
    password : { type: String, required : true}
}, {collection: 'myFirstDatabase.users'});

// Plugin pour Mongoose s'assure que les champs sont bien uniques
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
