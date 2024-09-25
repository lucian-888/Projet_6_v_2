// Importation du module Express
const express = require('express');
// Création d'un nouvel objet Router d'Express
const router = express.Router();
// Importation du contrôleur utilisateur
const userCtrl = require('../controllers/user');

// Définition de la route pour l'inscription (signup)
// Utilise la fonction signup du contrôleur utilisateur
router.post('/signup', userCtrl.signup);

// Définition de la route pour la connexion (login)
// Utilise la fonction login du contrôleur utilisateur
router.post('/login', userCtrl.login);

// Exportation du router pour utilisation dans d'autres fichiers
module.exports = router;
