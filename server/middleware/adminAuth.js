const ADMIN_KEY = process.env.ADMIN_KEY;

if (!ADMIN_KEY) {

    console.error(
        "FATAL: переменная окружения ADMIN_KEY не задана. " +
        "Задайте её в настройках хостинга (Render → Environment) — " +
        "сервер не запустится без неё, чтобы админка не осталась с дефолтным паролем."
    );

    process.exit(1);

}

module.exports = (req, res, next) => {

    const key = req.headers["x-admin-key"];

    if (!key || key !== ADMIN_KEY) {

        return res.status(403).json({

            success: false,
            message: "Access denied"

        });

    }

    next();

};