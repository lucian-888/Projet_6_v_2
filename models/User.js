// Importation de Mongoose, une bibliothèque pour interagir avec MongoDB
const mongoose = require('mongoose');
// Importation du plugin mongoose-unique-validator pour gérer les erreurs d'unicité
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma pour l'utilisateur
const userSchema = mongoose.Schema({
  // Champ email : doit être une chaîne, est requis, et doit être unique
  email: { type: String, required: true, unique: true },
  // Champ password : doit être une chaîne et est requis
  password: { type: String, required: true }
});

// Application du plugin uniqueValidator au schéma de l'utilisateur
userSchema.plugin(uniqueValidator);

// Exportation du modèle User
module.exports = 
    // Cette ligne vérifie si le modèle User existe déjà, sinon le crée
    mongoose.models.User || mongoose.model('User', userSchema)
