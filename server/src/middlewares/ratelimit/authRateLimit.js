const rateLimit =
    require("express-rate-limit");

if (
    process.env.NODE_ENV === 'test'
) {

    console.log(
        'Test environment: auth rate limit disabled'
    );

    module.exports = {

        loginRateLimit:
            (req, res, next) => next(),

        registerRateLimit:
            (req, res, next) => next(),

    };

} else {

    const loginRateLimit =
        rateLimit({

            windowMs:
                10 * 60 * 1000,

            max: 5,

            message: {

                message:
                    "Đăng nhập thất bại quá nhiều lần, vui lòng thử lại sau"

            },

        });

    const registerRateLimit =
        rateLimit({

            windowMs:
                60 * 60 * 1000,

            max: 3,

            message: {

                message:
                    "Đăng ký thất bại quá nhiều lần, vui lòng thử lại sau"

            },

        });

    module.exports = {

        loginRateLimit,
        registerRateLimit,

    };

}