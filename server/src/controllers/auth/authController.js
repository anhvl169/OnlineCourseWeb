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
            return res.status(400).json({ message: 'Google auth failed' });
        }

        const { token } = await authService.loginWithGoogle(profile);

        return res.redirect(`http://localhost:3000/auth/callback?token=${token}`);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const data = await authService.register({ name, email, password });

        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
module.exports = { login, googleCallback, register };