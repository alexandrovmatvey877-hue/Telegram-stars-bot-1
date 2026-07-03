let settings = {};

async function loadSettings() {

    try {

        settings = await API.getSettings();

        renderSettings("prices");

    } catch (e) {

        console.error(e);

        document.getElementById("settingsContent").innerHTML =
        `<div class="operation-card">
            ❌ Не удалось загрузить настройки
        </div>`;

    }

}

function switchSettings(tab){

    document
        .querySelectorAll(".settings-tab")
        .forEach(btn=>btn.classList.remove("active"));

    document
        .querySelector(`[data-settings="${tab}"]`)
        ?.classList.add("active");

    renderSettings(tab);

}

function renderSettings(tab){

    const box = document.getElementById("settingsContent");

    if(!box) return;

    if(tab==="prices"){

        box.innerHTML=`

<div class="setting-item">
<label>50 ⭐</label>
<input id="stars50" type="number" value="${settings.stars50||0}">
</div>

<div class="setting-item">
<label>75 ⭐</label>
<input id="stars75" type="number" value="${settings.stars75||0}">
</div>

<div class="setting-item">
<label>100 ⭐</label>
<input id="stars100" type="number" value="${settings.stars100||0}">
</div>

<div class="setting-item">
<label>150 ⭐</label>
<input id="stars150" type="number" value="${settings.stars150||0}">
</div>

<div class="setting-item">
<label>250 ⭐</label>
<input id="stars250" type="number" value="${settings.stars250||0}">
</div>

<div class="setting-item">
<label>500 ⭐</label>
<input id="stars500" type="number" value="${settings.stars500||0}">
</div>

<div class="setting-item">
<label>1000 ⭐</label>
<input id="stars1000" type="number" value="${settings.stars1000||0}">
</div>

<button class="save-button" onclick="savePrices()">
💾 Сохранить
</button>

`;

        return;
