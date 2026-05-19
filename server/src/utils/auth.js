// import jwt_decode from "jwt-decode";
const jwt_decode = require("jwt-decode");
const crypto = require("crypto");

const getToken = () => {
    return localStorage.getItem("token");
};

const getUser = () => {
    const token = getToken();
    if (!token) return null;

    try {
        return jwt_decode(token);
    } catch {
        return null;
    }
};

const isAuthenticated = () => {
    return !!getToken();
};

const hasRole = (roles) => {
    const user = getUser();
    if (!user) return false;

    return roles.includes(user.role);
};

const generateResetToken = () => {

    return crypto
        .randomBytes(32)
        .toString("hex");
};

module.exports = {
    getToken,
    getUser,
    isAuthenticated,
    hasRole,
    generateResetToken
};