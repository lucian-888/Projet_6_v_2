// Importation du framework Express
const express = require('express');
// Importation de Mongoose pour la gestion de la base de données MongoDB
const mongoose = require('mongoose');

require('dotenv').config()

// Importation des routes pour les livres et les utilisateurs
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

// Importation du module 'path' pour gérer les chemins de fichiers
const path = require('path');

// Création de l'application Express
const app = express();

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGOOSE_CONECTION)
    //{ useNewUrlParser: true,
    //  useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((e) => console.log(e));

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Middleware pour gérer les CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  // Autorise l'accès à l'API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Définit les en-têtes autorisés
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // Définit les méthodes HTTP autorisées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Utilisation des routes pour les livres
app.use('/api/books', booksRoutes);
// Utilisation des routes pour l'authentification
app.use('/api/auth', userRoutes);
// Middleware pour servir les fichiers statiques du dossier 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exportation de l'application Express pour utilisation dans d'autres fichiers
module.exports = app;
