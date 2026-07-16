console.log("🔥 WHEEL ADMIN LOADED");

window.WheelAdmin = {

    async load() {

        try {

            const data = await api(
                "/api/admin/wheel/prizes"
            );

            console.log("WHEEL PRIZES:", data);

            const box = document.getElementById("wheelPrizes");

            if (!box) {
                console.warn("wheelPrizes container not found");
                return;
            }


            box.innerHTML = "";


            const prizes = data.prizes || [];


            if (!prizes.length) {

                box.innerHTML = `
                    <div>
                        Призов нет
                    </div>
                `;

                return;
            }


            prizes.forEach(prize => {

                box.innerHTML += `

                <div class="wheel-prize-card">

                    <b>${prize.name}</b>

                    <br>

                    Тип:
                    ${prize.type}

                    <br>

                    Значение:
                    ${prize.value}

                    <br>

                    Шанс:
                    ${prize.chance}%

                </div>

                `;

            });


        } catch(err) {

            console.error(
                "WHEEL ADMIN ERROR:",
                err
            );

        }

    }

};


document.addEventListener(
    "DOMContentLoaded",
    () => {

        if(window.WheelAdmin){

            WheelAdmin.load();

        }

    }
);