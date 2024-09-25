// Importation du module Express
const express = require('express');
// Importation du middleware d'authentification
const auth = require('../middleware/auth');
// Création d'un nouvel objet Router d'Express
const router = express.Router();
// Importation du middleware multer pour la gestion des fichiers
const multer = require('../middleware/multer-config');
// Importation du contrôleur des livres
const booksCtrl = require('../controllers/books');

// Définition des routes pour les livres

// Route pour obtenir les livres les mieux notés
router.get('/bestrating', booksCtrl.getBestRatedBooks);
// Route pour obtenir tous les livres
router.get('/', booksCtrl.getAllBooks);
// Route pour créer un nouveau livre (nécessite authentification et gestion de fichiers)
router.post('/', auth, multer, booksCtrl.createBook);
// Route pour obtenir un livre spécifique par son ID
router.get('/:id', booksCtrl.getOneBook);
// Route pour modifier un livre (nécessite authentification et gestion de fichiers)
router.put('/:id', auth, multer, booksCtrl.modifyBook);
// Route pour supprimer un livre (nécessite authentification)
router.delete('/:id', auth, booksCtrl.deleteBook);
// Route pour noter un livre (nécessite authentification)
router.post('/:id/rating', auth, booksCtrl.rateBook);

// Exportation du router pour utilisation dans d'autres fichiers
module.exports = router;
