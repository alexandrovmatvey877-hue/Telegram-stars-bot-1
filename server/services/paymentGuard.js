const db = require("../config/database");


async function checkOrder(order_id){

    const result = await db.query(
        `
        SELECT *
        FROM orders
        WHERE order_id=$1
        `,
        [
            order_id
        ]
    );


    if(!result.rows.length){

        return null;

    }


    return result.rows[0];

}



async function markPaid(order_id, payment_id){

    const result = await db.query(

        `
        UPDATE orders

        SET

        status='paid',
        payment_id=$2,
        paid_at=NOW()

        WHERE order_id=$1

        AND status='pending'

        RETURNING *

        `,

        [
            order_id,
            payment_id
        ]

    );


    return result.rows[0];

}



module.exports={

    checkOrder,

    markPaid

};