// Importation du module HTTP de Node.js
const http = require('http');
// Importation de l'application Express 
const app = require('./app');

// Fonction pour normaliser le port
// Renvoie un port valide sous la forme d'un nombre ou d'une chaîne
const normalizePort = val => {
  // Tente de convertir la valeur en nombre entier
  const port = parseInt(val, 10);
  // Si la conversion échoue (résultat n'est pas un nombre), retourne la valeur originale
  if (isNaN(port)) {
    return val;
  }
  // Si le port est un nombre positif ou zéro, le retourne
  if (port >= 0) {
    return port;
  }
  // Sinon, retourne false (port invalide)
  return false;
};

// Définition du port : utilise la variable d'environnement PORT ou 4000 par défaut
const port = normalizePort(process.env.PORT || '4000');
// Configuration du port dans l'application Express
app.set('port', port);

// Fonction de gestion des erreurs du serveur
const errorHandler = error => {
  // Si l'erreur n'est pas liée à l'écoute du serveur, la relance
  if (error.syscall !== 'listen') {
    throw error;
  }
  
  // Récupère l'adresse du serveur
  const address = server.address();
  // Détermine si l'adresse est une chaîne (pipe) ou un numéro de port
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  
  // Gestion des erreurs spécifiques
  switch (error.code) {
    case 'EACCES':
      // Erreur de permission
      console.error(bind + ' nécessite des privilèges élevés.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // Port déjà utilisé
      console.error(bind + ' est déjà utilisé.');
      process.exit(1);
      break;
    default:
      // Autre type d'erreur
      throw error;
  }
};

// Création du serveur HTTP avec l'application Express
const server = http.createServer(app);

// Gestion des erreurs du serveur
server.on('error', errorHandler);
// Gestion de l'événement d'écoute du serveur
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('En écoute sur ' + bind);
});

// Démarrage du serveur sur le port spécifié
server.listen(port);
