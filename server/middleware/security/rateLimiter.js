const requests = new Map();

const WINDOW = 60 * 1000; // 1 минута
const LIMIT = 100;        // максимум 100 запросов

module.exports = (req, res, next) => {

    const ip =
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "unknown";

    const now = Date.now();

    if (!requests.has(ip)) {

        requests.set(ip, {
            count: 1,
            start: now
        });

        return next();

    }

    const data = requests.get(ip);

    if (now - data.start > WINDOW) {

        data.count = 1;
        data.start = now;

        return next();

    }

    data.count++;

    if (data.count > LIMIT) {

        return res.status(429).json({
            success: false,
            error: "Too many requests"
        });

    }

    next();

};