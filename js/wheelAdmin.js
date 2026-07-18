console.log("🔥 WHEEL ADMIN LOADED");


window.WheelAdmin = {

    async load() {

        try {

            const data = await API.getWheelPrizes();
alert(JSON.stringify(data));

            console.log("WHEEL DATA:", data);


            const box = document.getElementById("wheelPrizes");

            if (!box) {
                console.warn("wheelPrizes not found");
                return;
            }


            box.innerHTML = "";


            (data.prizes || []).forEach(p => {

                box.innerHTML += `
                    <div class="wheel-prize-card">
                        <b>${p.name}</b><br>
                        Тип: ${p.type}<br>
                        Значение: ${p.value}<br>
                        Шанс: ${p.chance}%
                    </div>
                `;

            });


        } catch(err){

            console.error(
                "WHEEL ADMIN ERROR",
                err
            );

        }

    }

};


document.addEventListener(
"DOMContentLoaded",
()=>{

    WheelAdmin.load();

});