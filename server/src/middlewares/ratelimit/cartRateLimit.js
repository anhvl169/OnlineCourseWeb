const rateLimit = require("express-rate-limit");

const cartRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        message: "Quá nhiều request, vui lòng thử lại sau"
    },
});

module.exports = {
    cartRateLimit
};