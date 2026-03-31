// js/script.js

const images = [
  "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
  "https://www.arhome.com.ua/image/catalog/22022021-8.jpg"
];

let currentIndex = 0;
const hero = document.querySelector(".hero");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

function showImage(index) {
  hero.style.backgroundImage = `url(${images[index]})`;
}

// кнопки для ручного перегортання
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
});

// автоматичне перелистування 
setInterval(() => {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
}, 8000);

// показати перше фото при завантаженні
showImage(currentIndex);

const slides = document.querySelectorAll(".reviews-slide")
const dots = document.querySelectorAll(".dot")
const prevReviewBtn = document.querySelector(".reviews-arrow.left")
const nextReviewBtn = document.querySelector(".reviews-arrow.right")

let reviewIndex = 0

function showSlide(i){
    slides.forEach(slide => slide.classList.remove("active"))
    dots.forEach(dot => dot.classList.remove("active"))

    slides[i].classList.add("active")
    dots[i].classList.add("active")
}

dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
        reviewIndex = i
        showSlide(reviewIndex)
    })
})

nextReviewBtn.addEventListener("click", () => {
    reviewIndex++
    if(reviewIndex >= slides.length){
        reviewIndex = 0
    }
    showSlide(reviewIndex)
})

prevReviewBtn.addEventListener("click", () => {
    reviewIndex--
    if(reviewIndex < 0){
        reviewIndex = slides.length - 1
    }
    showSlide(reviewIndex)
})

showSlide(reviewIndex)
