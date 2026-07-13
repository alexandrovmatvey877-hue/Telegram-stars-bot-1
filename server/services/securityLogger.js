const db = require("../config/database");


async function log(action, data) {

    try {

        await db.query(
            `
            INSERT INTO security_logs
            (
                action,
                data,
                created_at
            )
            VALUES
            ($1,$2,NOW())
            `,
            [
                action,
                JSON.stringify(data)
            ]
        );


    } catch(err) {

        console.error(
            "SECURITY LOG ERROR:",
            err.message
        );

    }

}


module.exports = {
    log
};