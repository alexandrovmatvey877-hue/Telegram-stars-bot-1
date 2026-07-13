const track = document.querySelector(".promo-track");

const dots = document.querySelectorAll(".dots span");


let index = 0;


function slide(){

    index++;

    if(index >= dots.length){
        index = 0;
    }


    track.style.transform =
    `translateX(-${index * 100}%)`;


    dots.forEach(dot =>
        dot.classList.remove("active")
    );


    dots[index].classList.add("active");

}


setInterval(slide, 5000);