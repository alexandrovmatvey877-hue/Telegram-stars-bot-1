console.log("🔥 WHEEL ADMIN LOADED");


window.WheelAdmin = {

    async load() {

        try {

            const data = await API.getWheelPrizes();

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

<div style="display:flex;align-items:center;gap:10px;">

<div style="
width:20px;
height:20px;
background:${p.color};
border-radius:4px;
flex-shrink:0;
"></div>

<div>
<b>${p.name}</b><br>
Тип: ${p.type}<br>
Значение: ${p.value}<br>
Шанс: ${p.chance}%
</div>

</div>

<br>

<button
style="
width:100%;
padding:10px;
background:#ff4d4f;
color:white;
border:none;
border-radius:10px;
cursor:pointer;
"
onclick="WheelAdmin.deletePrize(${p.id})">
🗑 Удалить
</button>

</div>
`;
});

        } catch(err){

            console.error(
                "WHEEL ADMIN ERROR",
                err
            );

        }

    },

async deletePrize(id){

    if(!confirm("Удалить приз?"))
        return;

    try{

        await api(
    "/api/admin/wheel/prizes/" + id,
    "DELETE"
);

        this.load();

    }catch(err){

        console.error(err);

        alert("Ошибка удаления");

    }

},
async addPrize(){

    try{

        await api(
            "/api/admin/wheel/prizes",
            "POST",
            {
                name: document.getElementById("wheelName").value,
                type: document.getElementById("wheelType").value,
                value: Number(document.getElementById("wheelValue").value),
                chance: Number(document.getElementById("wheelChance").value),
                color: document.getElementById("wheelColor").value
            }
        );

        this.load();

    }catch(err){

        console.error(err);
        alert(err.message);

    }

}

document.addEventListener("DOMContentLoaded",()=>{

    WheelAdmin.load();


    const btn = document.getElementById("addWheelPrizeBtn");


    if(btn){

        btn.onclick = async()=>{

            await api(
                "/api/admin/wheel/prizes",
                "POST",
                {
                    name: document.getElementById("wheelName").value,
                    type: document.getElementById("wheelType").value,
                    value: Number(document.getElementById("wheelValue").value),
                    chance: Number(document.getElementById("wheelChance").value),
                    color: document.getElementById("wheelColor").value
                }
            );


            alert("Приз добавлен");


            WheelAdmin.load();

        };

    }

});