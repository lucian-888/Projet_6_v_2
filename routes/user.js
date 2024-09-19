// Importation du module Express
const express = require('express');
// Création d'un nouvel objet Router d'Express
const router = express.Router();

// Importation du contrôleur utilisateur
const userCtrl = require('../controllers/user');

{/*  // Middleware pour parser le corps des requêtes en JSON
router.use(express.json()); 

// Middleware pour gérer les CORS (Cross-Origin Resource Sharing)
router.use((req, res, next) => {
    // Autorise l'accès à l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Définit les en-têtes autorisés
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Définit les méthodes HTTP autorisées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    // Passe au middleware suivant
    next();
});  */}

// Définition de la route pour l'inscription (signup)
// Utilise la fonction signup du contrôleur utilisateur
router.post('/signup', userCtrl.signup);

// Définition de la route pour la connexion (login)
// Utilise la fonction login du contrôleur utilisateur
router.post('/login', userCtrl.login);

// Exportation du router pour utilisation dans d'autres fichiers
module.exports = router;
