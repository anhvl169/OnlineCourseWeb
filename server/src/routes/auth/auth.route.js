const express = require('express');
const authController = require('../../controllers/auth/authController');
const passport = require('./../../config/passport');
const router = express.Router();

router.post('/login', authController.login);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    authController.googleCallback
);

module.exports = router;