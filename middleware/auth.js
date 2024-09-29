const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try {
        // Vérifie si l'en-tête d'autorisation est présent
        if (!req.headers.authorization) {
            throw new Error('Authorization header is missing');
        }

        // Extrait la partie token de l'en-tête d'autorisation
        const token = req.headers.authorization.split(' ')[1]; // Expecting 'Bearer TOKEN'
        if (!token) {
            throw new Error('Token is missing in the Authorization header');
        }

        // Vérifie le token
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);

        // Extrait l'userId du token décodé et l'attache à l'objet de requête
        const userId = decodedToken.userId;
        req.auth = { userId };

        next();
    } catch (error) {
        res.status(401).json({ error: error.message || 'Unauthorized request!' });
    }
};




