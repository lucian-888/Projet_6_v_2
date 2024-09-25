const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const crypto = require('crypto');

// Définition d'un objet qui mappe les types MIME aux extensions de fichier
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

// Configuration du stockage temporaire pour multer
const storage = multer.memoryStorage();

// Fonction pour optimiser l'image
const optimizeImage = async (buffer, mimetype) => {
  // Générer un nom de fichier unique basé sur le contenu de l'image
  const hash = crypto.createHash('md5').update(buffer).digest('hex');
  const extension = MIME_TYPES[mimetype];
  const filename = `${hash}.webp`;

  // Optimiser l'image
  const optimizedImageBuffer = await sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  return { buffer: optimizedImageBuffer, filename };
};

// Middleware pour gérer l'upload et l'optimisation des images
const uploadAndOptimize = multer({ storage: storage }).single('image');

const processImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const { buffer, filename } = await optimizeImage(req.file.buffer);

    // Sauvegarder l'image optimisée
    await sharp(buffer).toFile(path.join('images', filename));

    // Mettre à jour req.file avec les nouvelles informations
    req.file.filename = filename;
    req.file.path = path.join('images', filename);
    req.file.mimetype = 'image/webp';
    next();
  } catch (error) {
    next(error);
  }
};

// Exportation du middleware combiné
module.exports = [uploadAndOptimize, processImage];
