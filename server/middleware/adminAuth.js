const ADMIN_KEY = process.env.ADMIN_KEY || "white-stars-super-admin";

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