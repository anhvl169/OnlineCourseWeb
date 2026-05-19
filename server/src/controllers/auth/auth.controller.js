// controllers/auth.controller.js
const authService = require('../../services/auth.service');
const userRepo = require('../../repositories/user.repo');
const { sendEmail } = require('../../services/email.service');
const { generateResetToken } = require('../../utils/auth');
const bcrypt = require('bcrypt');
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

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({ message: 'Email is required' });
        }
        const user = await userRepo.findByEmail(email);
        if (!user) {
            return res.json({ message: 'If user exists, a password reset email will be sent' });
        }
        const token = generateResetToken();
        const expiresAt =
            new Date(
                Date.now() + 3 * 60 * 1000
            );

        await userRepo.passWordReset(user.user_id, { resetToken: token, resetTokenExpiresAt: expiresAt });
        const resetLink =
            `http://localhost:3000/new-password/${token}`;
        console.log(`Reset link for user ${email}: ${resetLink}`);
        await sendEmail(email,
            'Password Reset',
            `
                <h2>Đặt lại mật khẩu</h2>
                <p>
                    Nhấn link bên dưới:
                </p>
                <a href="${resetLink}">
                    Reset Password
                </a>
                <p>
                    Link hết hạn sau 3 phút.
                </p>
            `
        );
        console.log(`Password reset email sent to ${email}`);
        res.json({ message: 'If email exists, a password reset email will be sent' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }
        const reset = await userRepo.findByResetToken(token);
        if (!reset) {
            return res.status(400).json({ message: 'Invalid token' });
        }
        if (reset.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Expired token' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userRepo.updateUserPassword(reset.userId, hashedPassword);
        await userRepo.setTokenUsed(reset.id);
        res.json({ message: 'Password reset successful' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports = { login, googleCallback, register, forgotPassword, resetPassword };