const express = require('express');
const authController = require('../../controllers/auth/auth.controller');
const passport = require('./../../config/passport');
const router = express.Router();
const { authMiddleware } = require('../../middlewares/verifyToken');
const { loginRateLimit, registerRateLimit } = require('../../middlewares/ratelimit/authRateLimit');
router.post('/login', loginRateLimit, authController.login);
router.post('/register', registerRateLimit, authController.register);
router.get('/google', loginRateLimit, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', loginRateLimit,
    passport.authenticate('google', { session: false }),
    authController.googleCallback
);

router.get('/me', authMiddleware, async (req, res) => {
    res.json({
        user: req.user
    });
});

router.post('/forgot-password', authController.forgotPassword);
router.post('/new-password', authController.resetPassword);
module.exports = router;