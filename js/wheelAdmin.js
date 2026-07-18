console.log("🔥 WHEEL ADMIN LOADED");


window.WheelAdmin = {

    async load() {

        try {

            const data = await API.getWheelPrizes();
alert(JSON.stringify(data));

            console.log("WHEEL DATA:", data);


            const box = document.getElementById("wheelList");

            if (!box) {
                console.warn("wheelPrizes not found");
                return;
            }


            box.innerHTML = "";


            (data.prizes || []).forEach(p => {

                box.innerHTML += `
<div class="wheel-prize-card">

<div style="
width:20px;
height:20px;
background:${p.color};
border-radius:4px;
display:inline-block;
margin-right:10px;
"></div>

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