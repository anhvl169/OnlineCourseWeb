const rateLimit = require("express-rate-limit");

const aiRateLimitPerMinute = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: {
        message: "Quá nhiều request, vui lòng thử lại sau"
    },
});
const aiRateLimitPerDay = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 100,
    message: {
        message: "Quá nhiều request, vui lòng thử lại sau"
    },
});

const aiRateLimitPerWeek = rateLimit({
    windowMs: 7 * 24 * 60 * 60 * 1000,
    max: 500,
    message: {
        message: "Quá nhiều request, vui lòng thử lại sau"
    },
});

module.exports = {
    aiRateLimitPerMinute,
    aiRateLimitPerDay,
    aiRateLimitPerWeek
};
