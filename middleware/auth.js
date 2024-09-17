const jwt = require('jsonwebtoken');
 
{/*module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};*/}


module.exports = (req, res, next) => {
    console.log('Auth middleware triggered');
    console.log('Authorization header:', req.headers.authorization);

    try {
        // Check if the Authorization header is present
        if (!req.headers.authorization) {
            throw new Error('Authorization header is missing');
        }

        // Extract the token part from the Authorization header
        const token = req.headers.authorization.split(' ')[1]; // Expecting 'Bearer TOKEN'
        if (!token) {
            throw new Error('Token is missing in the Authorization header');
        }

        // Verify the token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        console.log('Decoded token:', decodedToken);

        // Extract userId from the decoded token and attach it to the request object
        const userId = decodedToken.userId;
        req.auth = { userId };
        console.log('Set req.auth:', req.auth);

        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        res.status(401).json({ error: error.message || 'Unauthorized request!' });
    }
};




