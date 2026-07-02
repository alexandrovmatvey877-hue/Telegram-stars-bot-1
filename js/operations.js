let operations = [];

async function loadOperations() {

    const box = document.getElementById("operationsList");

    if (!box) return;

    try {

        operations = await API.getOperations();

        renderOperations();

    } catch (e) {

        console.error(e);

        box.innerHTML = `
        <div class="operation-card">
            История операций пока недоступна.
        </div>`;

    }

}

function renderOperations() {

    const box = document.getElementById("operationsList");

    if (!box) return;

    if (!operations || operations.length === 0) {

        box.innerHTML = `
        <div class="operation-card">
            Операций пока нет.
        </div>`;

        return;

    }

    box.innerHTML = "";

    operations.forEach(op => {

        const date = op.created_at
            ? new Date(op.created_at).toLocaleString("ru-RU")
            : "—";

        box.innerHTML += `

<div class="operation-card">

    <div style="display:flex;justify-content:space-between;align-items:center;">

        <div>

            <div style="font-weight:700;">
                ${op.username || op.telegram_id || "Пользователь"}
            </div>

            <div style="font-size:13px;color:#777;margin-top:4px;">
                ${op.type || "Операция"}
            </div>

        </div>

        <div style="text-align:right;">

            <div style="font-weight:700;">
                ${op.amount || 0} ₽
            </div>

            <div style="font-size:12px;color:#999;">
                ${date}
            </div>

        </div>

    </div>

</div>

`;

    });

}

window.Operations = {

    loadOperations

};