// controllers/auth.controller.js
const authService = require('./../../services/auth.service');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await authService.loginWithEmailAndPass(email, password);

        res.json(data);
        console.log("Login successful for user:", data.user.name);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

const googleCallback = async (req, res) => {
    try {
        const profile = req.user;

        if (!profile) {
            return res.status(400).json({ message: 'Google authentication failed' });
        }

        const { token, isNewUser, roles } = await authService.loginWithGoogle(profile);

        if (isNewUser || roles.length === 0) {
            return res.redirect(`http://localhost:3000/onboarding?token=${token}`);
        }

        res.redirect(`http://localhost:3000?token=${token}`);
    } catch (err) {
        console.error('Google login error:', err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { login, googleCallback};