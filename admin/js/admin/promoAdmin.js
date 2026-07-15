document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("createPromoBtn");

    if(btn){

        btn.onclick = create;

    }


    loadPromos();

});



async function loadPromos(){

    const box = document.getElementById("promoList");

    if(!box) return;


    try{

        const data = await API.getPromos();


        if(!data.success){

            box.innerHTML = "Нет промокодов";

            return;

        }


        box.innerHTML = "";


        data.promos.forEach(promo => {


            const div = document.createElement("div");

            div.className = "promo-item";


            div.innerHTML = `

<h3>
🎁 ${promo.code}
</h3>


<p>
Тип: ${promo.type}
</p>


<p>
Награда:
${promo.value}
</p>


<p>
Использовано:
${promo.used_count}/${promo.max_uses || "∞"}
</p>


<p>
Истекает:
${promo.expires_at || "Без срока"}
</p>


<p>
Статус:
${promo.is_active ? "🟢 Активен" : "🔴 Выключен"}
</p>


<button onclick="disablePromo(${promo.id})">
Отключить
</button>

            `;


            box.appendChild(div);


        });


    }catch(err){

        console.error(err);

        box.innerHTML =
        "Ошибка загрузки";

    }

}




async function create(){


    const data = {


        code:
        document.getElementById("promoCode").value,


        type:
        document.getElementById("promoType").value,


        value:
        Number(
            document.getElementById("promoValue").value
        ),


        max_uses:
        Number(
            document.getElementById("promoMaxUses").value
        ) || 0,


        expires_at:
        document.getElementById("promoExpires").value || null

    };



    try{


        await API.createPromo(data);


        alert("Промокод создан");


        loadPromos();



    }catch(err){

        alert(err.message);

    }

}




async function disablePromo(id){


    try{

        await API.disablePromo(id);


        loadPromos();


    }catch(err){

        alert(err.message);

    }

}