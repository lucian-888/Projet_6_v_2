// Importation de Mongoose, une bibliothèque pour interagir avec MongoDB
const mongoose = require('mongoose');

// Définition du schéma pour un livre
const bookSchema = mongoose.Schema({
  // ID de l'utilisateur qui a créé le livre
  userId: { type: String, required: true },
  // Titre du livre
  title: { type: String, required: true },
  // Auteur du livre
  author: { type: String, required: true },
  // URL de l'image de couverture du livre
  imageUrl: { type: String, required: true },
  // Année de publication du livre
  year: { type: Number, required: true },
  // Genre du livre
  genre: { type: String, required: true },
  // Tableau des notes attribuées au livre
  ratings: [
    {
      // ID de l'utilisateur qui a donné la note
      userId: { type: String, required: true },
      // Note attribuée (supposée être un nombre)
      grade: { type: Number, required: true }
    }
  ],
  // Note moyenne du livre
  averageRating: { type: Number, default: 0 }
});

// Exportation du modèle Book
module.exports = 
    // Cette ligne vérifie si le modèle Book existe déjà, sinon le crée
    mongoose.models.Book || mongoose.model('Book', bookSchema)
