function loadMenu(){

document.body.insertAdjacentHTML(
"beforeend",

`

<nav class="bottom-menu">


<button onclick="location.href='/index.html'">

<span>🏠</span>
<small>Главная</small>

</button>


<button onclick="location.href='/pages/profile.html'">

<span>👤</span>
<small>Профиль</small>

</button>


<button onclick="location.href='/pages/wheel.html'">

<span>🎡</span>
<small>Колесо</small>

</button>


<button onclick="location.href='/pages/settings.html'">

<span>⚙️</span>
<small>Настройки</small>

</button>


</nav>

`

);

}


loadMenu();