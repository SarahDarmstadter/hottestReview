const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

//definition du schema de données attendues par la BDD
const sauceSchema = mongoose.Schema({
        userId: { type: String, required: true },
        name: { type: String, required: true, maxlength: [15, 'Nombre de caractères limité à 15'] },
        manufacturer: { type: String, required: true, maxlength: [30, 'Nombre de caractères limité à 30'] },
        description: { type: String, required: true },
        mainPepper: { type: String, required: true, maxlength: [15, 'Nombre de caractères limité à 15'] },
        imageUrl: { type: String, required: true },
        heat: { type: Number, required: true },
        likes: { type: Number, required: false, default: 0 },
        dislikes: { type: Number, required: false, default: 0 },
        usersLiked: { type: [String], required: false },
        usersDisliked: { type: [String], required: false }, 
});

// Plugin pour Mongoose qui purifie les champs du model avant de les enregistrer dans la base MongoDB. 
// Utilise le HTML Sanitizer de Google Caja pour effectuer la désinfection.
sauceSchema.plugin(sanitizerPlugin);

module.exports = mongoose.model('Sauce', sauceSchema);

