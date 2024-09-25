const Book = require('../models/Book');
const fs = require('fs');

// Création d'un nouveau livre
exports.createBook = (req, res, next) => {
  // Parse l'objet livre du corps de la requête
  const bookObject = JSON.parse(req.body.book);
  // Supprime l'ID et userID fournis par le client pour des raisons de sécurité
  delete bookObject._id;
  delete bookObject._userId;
  // Crée une nouvelle instance de Book avec les données fournies et des valeurs par défaut
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId, // Utilise l'ID de l'utilisateur authentifié
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // Construit l'URL de l'image
    averageRating: 0, // Initialise la note moyenne à 0
    ratings: [] // Initialise les notations comme un tableau vide
  });

  // Sauvegarde le livre dans la base de données
  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

// Récupération d'un livre spécifique
exports.getOneBook = (req, res, next) => {
  // Recherche un livre par son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// Modification d'un livre
exports.modifyBook = (req, res, next) => {
  // Détermine si une nouvelle image a été uploadée
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  // Supprime le userId pour des raisons de sécurité
  delete bookObject._userId;
  // Recherche le livre à modifier
  Book.findOne({_id: req.params.id})
    .then((book) => {
      // Vérifie si l'utilisateur est autorisé à modifier le livre
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message : 'Non autorisé'});
      } else {
        // Met à jour le livre
        Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
          .then(() => res.status(200).json({message : 'Livre modifié!'}))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// Suppression d'un livre
exports.deleteBook = (req, res, next) => {
  // Recherche le livre à supprimer
  Book.findOne({ _id: req.params.id})
    .then(book => {
      // Vérifie si l'utilisateur est autorisé à supprimer le livre
      if (book.userId != req.auth.userId) {
        res.status(401).json({message: 'Non autorisé'});
      } else {
        // Extrait le nom du fichier image
        const filename = book.imageUrl.split('/images/')[1];
        // Supprime le fichier image
        fs.unlink(`images/${filename}`, () => {
          // Supprime le livre de la base de données
          Book.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: 'Livre supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      }
    })
    .catch(error => res.status(500).json({ error }));
};

// Récupération de tous les livres
exports.getAllBooks = (req, res, next) => {
  // Récupère tous les livres de la base de données
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Récupération des 3 livres les mieux notés
exports.getBestRatedBooks = (req, res, next) => {
  // Récupère tous les livres, les trie par note moyenne décroissante et limite à 3
  Book.find().sort({averageRating: -1}).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// Notation d'un livre
exports.rateBook = (req, res, next) => {
  const { rating } = req.body;
  const userId = req.auth.userId;
  // Vérifie si la note est valide
  if (rating < 0 || rating > 5) {
    return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5' });
  }
  
  // Recherche le livre à noter
  Book.findOne({_id: req.params.id})
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
      
      // Vérifie si l'utilisateur a déjà noté ce livre
      const userRating = book.ratings.find(r => r.userId.toString() === userId);
      if (userRating) {
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
      }
      
      // Ajoute la nouvelle note
      book.ratings.push({ userId, grade: rating });
      // Recalcule la note moyenne
      const totalRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = totalRatings / book.ratings.length;
      
      // Sauvegarde le livre mis à jour
      return book.save();
    })
    .then(updatedBook => res.status(200).json(updatedBook))
    .catch(error => res.status(500).json({ error }));
};



