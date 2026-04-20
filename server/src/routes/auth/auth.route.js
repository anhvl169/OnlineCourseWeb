const express = require('express');
const authController = require('../../controllers/auth/authController');
const passport = require('./../../config/passport');
const router = express.Router();
const { authMiddleware } = require('../../middlewares/verifyToken');
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    authController.googleCallback
);

router.get('/me', authMiddleware, async (req, res) => {
    res.json({
        user: req.user
    });
});
module.exports = router;