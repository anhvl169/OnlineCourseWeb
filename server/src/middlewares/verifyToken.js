// middlewares/auth.middleware.js
const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new Error('No token');

        const decoded = verifyToken(token);

        req.user = decoded; // { userId, roles }
        next();
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { authMiddleware };