// Importation de bcrypt pour le hachage des mots de passe
const bcrypt = require('bcrypt');
// Importation de jsonwebtoken pour la création de tokens JWT
const jwt = require('jsonwebtoken');

// Importation du modèle User
const User = require('../models/User');

// Fonction pour l'inscription (signup)
exports.signup = (req, res, next) => {
    // Hachage du mot de passe avec un coût de 10
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Création d'un nouvel utilisateur avec l'email fourni et le mot de passe haché
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // Sauvegarde de l'utilisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

// Fonction pour la connexion (login)
exports.login = (req, res, next) => {
    // Recherche de l'utilisateur par son email
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si l'utilisateur n'est pas trouvé
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            // Comparaison du mot de passe fourni avec le hash stocké
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si le mot de passe est incorrect
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    // Si le mot de passe est correct, création et envoi du token
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 }
