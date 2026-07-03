// =====================================
// WHITE STARS Logger
// =====================================

function logger(req, res, next) {

    const start = Date.now();

    res.on("finish", () => {

        const time = Date.now() - start;

        const date = new Date().toLocaleString("ru-RU");

        console.log(
            `[${date}] ${req.method} ${req.originalUrl} | ${res.statusCode} | ${time} ms`
        );

    });

    next();

}

module.exports = logger;