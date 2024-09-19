// Importation de multer, un middleware pour gérer les fichiers uploadés
const multer = require('multer');

// Définition d'un objet qui mappe les types MIME aux extensions de fichier
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration du stockage pour multer
const storage = multer.diskStorage({
  // Définition de la destination de stockage des fichiers
  destination: (req, file, callback) => {
    // Les fichiers seront sauvegardés dans le dossier 'images'
    callback(null, 'images');
  },
  // Définition du nom de fichier
  filename: (req, file, callback) => {
    // Remplace les espaces dans le nom original par des underscores
    const name = file.originalname.split(' ').join('_');
    // Récupère l'extension du fichier basée sur son type MIME
    const extension = MIME_TYPES[file.mimetype];
    // Crée un nom de fichier unique avec le nom modifié, la date actuelle, et l'extension
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Exportation du middleware multer configuré
module.exports = multer({storage: storage}).single('image');
