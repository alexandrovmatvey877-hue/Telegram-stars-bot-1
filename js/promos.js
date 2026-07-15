const Promos = {


async load(){


    try{


        const data = await API.getPromos();


        const box =
        document.getElementById("promoList");


        if(!box) return;


        box.innerHTML="";


        data.promos.forEach(p=>{


            box.innerHTML += `

            <div class="promo-card">


                <h3>
                🎁 ${p.code}
                </h3>


                <p>
                Тип:
                ${p.type}
                </p>


                <p>
                Награда:
                ${p.value}
                </p>


                <p>
                Использований:
                ${p.used_count}
                /
                ${p.max_uses || "∞"}
                </p>


                <p>
                Статус:
                ${p.is_active ? "✅ Активен":"❌ Выключен"}
                </p>



                ${
                p.is_active
                ?
                `<button onclick="Promos.disable(${p.id})">
                Выключить
                </button>`
                :
                ""
                }


            </div>

            `;


        });



    }catch(err){

        console.error(err);

    }


},



async disable(id){


    await API.disablePromo(id);


    this.load();


}



};



document.addEventListener(
"DOMContentLoaded",
()=>{


const btn =
document.getElementById(
"createPromoBtn"
);


if(btn){


btn.onclick = async()=>{


const data={


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
),


expires_at:
document.getElementById("promoExpires").value || null


};



try{


await API.createPromo(data);


alert(
"Промокод создан"
);


Promos.load();



}catch(err){


alert(err.message);


}



};


}


});


window.Promos = Promos;