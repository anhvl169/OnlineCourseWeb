const rateLimit =
    require("express-rate-limit");

if (
    process.env.NODE_ENV === 'test'
) {

    console.log(
        "Running in test environment, skipping rate limit"
    );

    module.exports = {

        aiRateLimitPerMinute:
            (req, res, next) => next(),

        aiRateLimitPerDay:
            (req, res, next) => next(),

        aiRateLimitPerWeek:
            (req, res, next) => next(),

    };

} else {

    const aiRateLimitPerMinute =
        rateLimit({

            windowMs:
                60 * 1000,

            max: 10,

            message: {

                message:
                    "Quá nhiều request, vui lòng thử lại sau"

            },

        });

    const aiRateLimitPerDay =
        rateLimit({

            windowMs:
                24 * 60 * 60 * 1000,

            max: 100,

            message: {

                message:
                    "Quá nhiều request, vui lòng thử lại sau"

            },

        });

    const aiRateLimitPerWeek =
        rateLimit({

            windowMs:
                7 * 24 * 60 * 60 * 1000,

            max: 500,

            message: {

                message:
                    "Quá nhiều request, vui lòng thử lại sau"

            },

        });

    module.exports = {

        aiRateLimitPerMinute,
        aiRateLimitPerDay,
        aiRateLimitPerWeek,

    };

}