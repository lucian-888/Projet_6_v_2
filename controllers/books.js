const Book = require('../models/Book');
const fs = require('fs');

// Création d'un nouveau livre
exports.createBook = (req, res, next) => {
  //console.log("Données reçues:", req.body);

  let bookObject;
  try {
    bookObject = JSON.parse(req.body.book);
  } catch (error) {
    bookObject = req.body;
  }

  //console.log("Book object:", bookObject);

  delete bookObject._id;
  // Ne supprimez pas userId ici, car il est nécessaire pour la notation initiale

  // Utilisez les ratings et averageRating existants s'ils sont fournis
  const initialRatings = bookObject.ratings || [];
  const initialAverageRating = bookObject.averageRating || 0;

  //console.log("Initial ratings:", initialRatings);
  //console.log("Initial average rating:", initialAverageRating);

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId, // Remplacez par l'ID de l'utilisateur authentifié
    imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null,
    ratings: initialRatings,
    averageRating: initialAverageRating
  });

  //console.log("Book to save:", book);

  book.save()
    .then((savedBook) => {
      res.status(201).json({ 
        message: initialRatings.length > 0 ? 'Livre enregistré et noté !' : 'Livre enregistré !',
        book: savedBook
      });
    })
    .catch(error => {
      console.error("Erreur lors de la sauvegarde:", error);
      res.status(400).json({ error })
    });
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
        res.status(403).json({ message : 'Non autorisé'});
      } else {
        // Met à jour le livre
        Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
          .then(() => res.status(200).json({message : 'Livre modifié!'}))
          .catch(error => res.status(400).json({ error }));
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
        res.status(403).json({message: 'Non autorisé'});
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
    .catch((error) => res.status(500).json({ error }));
};

// Récupération des 3 livres les mieux notés
exports.getBestRatedBooks = (req, res, next) => {
  // Récupère tous les livres, les trie par note moyenne décroissante et limite à 3
  Book.find().sort({averageRating: -1}).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(500).json({ error }));
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



{/*async function deleteBook() {
  try {
    const deletedBook = await Book.findByIdAndDelete("66f423229aa77a0c47781e6f");
    if (deletedBook) {
      console.log("Livre supprimé avec succès:", deletedBook);
    } else {
      console.log("Aucun livre trouvé avec cet ID");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du livre:", error);
  }
}

deleteBook();*/}