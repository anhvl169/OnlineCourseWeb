const rateLimit =
    require("express-rate-limit");

if (
    process.env.NODE_ENV === 'test'
) {

    console.log(
        'Test environment: cart rate limit disabled'
    );

    module.exports = {

        cartRateLimit:
            (req, res, next) => next(),

    };

} else {

    const cartRateLimit =
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            message: {
                message:
                    "Quá nhiều request, vui lòng thử lại sau"
            },
        });

    module.exports = {
        cartRateLimit,
    };

}