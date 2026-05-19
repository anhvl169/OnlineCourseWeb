// services/auth.service.js
const bcrypt = require('bcrypt');
const userRepo = require('../repositories/user.repo');
const { signToken } = require('../utils/jwt');

const loginWithEmailAndPass = async (email, password) => {
    const user = await userRepo.findByEmail(email);
    console.log('User found:', user);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid password');

    const roles = await userRepo.getRolesByUserId(user.user_id);

    const token = signToken({
        userId: user.user_id,
        name: user.name,
        roles
    });

    return { user, token };
};

const loginWithGoogle = async (profile) => {
    let user = await userRepo.findByEmail(profile.email);

    let isNewUser = false;

    if (!user) {
        const userId = await userRepo.createUser({
            email: profile.email,
            name: profile.name,
            google_id: profile.id,
            password: null
        });

        await userRepo.assignRole(userId, 'Student');

        user = { user_id: userId, email: profile.email, name: profile.name };
        isNewUser = true;
    }

    const roles = await userRepo.getRolesByUserId(user.user_id);

    const token = signToken({
        userId: user.user_id,
        name: user.name,
        roles
    });

    return { user, token, isNewUser, roles };
};
const register = async ({ name, email, password }) => {

    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
        throw new Error("Email already exists");
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const userId = await userRepo.createUser({
        name,
        email,
        password: hashedPassword,
        google_id: null
    });


    await userRepo.assignRole(userId, 'Student');


    const roles = await userRepo.getRolesByUserId(userId);

    const token = signToken({
        userId,
        name,
        roles
    });

    return {
        user: { userId, name, email },
        token
    };
};


module.exports = { loginWithEmailAndPass, loginWithGoogle, register };