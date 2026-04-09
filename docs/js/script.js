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
  if (hero) {
    hero.style.backgroundImage = `url(${images[index]})`;
  }
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  });
}

setInterval(() => {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
}, 8000);

showImage(currentIndex);

const slides = document.querySelectorAll(".reviews-slide");
const dots = document.querySelectorAll(".dot");
const prevReviewBtn = document.querySelector(".reviews-arrow.left");
const nextReviewBtn = document.querySelector(".reviews-arrow.right");

let reviewIndex = 0;

function showSlide(i) {
  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  if (slides[i]) slides[i].classList.add("active");
  if (dots[i]) dots[i].classList.add("active");
}

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    reviewIndex = i;
    showSlide(reviewIndex);
  });
});

if (nextReviewBtn) {
  nextReviewBtn.addEventListener("click", () => {
    reviewIndex++;
    if (reviewIndex >= slides.length) {
      reviewIndex = 0;
    }
    showSlide(reviewIndex);
  });
}

if (prevReviewBtn) {
  prevReviewBtn.addEventListener("click", () => {
    reviewIndex--;
    if (reviewIndex < 0) {
      reviewIndex = slides.length - 1;
    }
    showSlide(reviewIndex);
  });
}

showSlide(reviewIndex);

const propertyCards = document.querySelectorAll(".property-card");
const typeFilter = document.getElementById("typeFilter");
const cityFilter = document.getElementById("cityFilter");
const roomsFilter = document.getElementById("roomsFilter");
const areaFrom = document.getElementById("areaFrom");
const areaTo = document.getElementById("areaTo");
const priceFrom = document.getElementById("priceFrom");
const priceTo = document.getElementById("priceTo");
const resetBtn = document.getElementById("resetBtn");
const currencyButtons = document.querySelectorAll(".currency-btn");
const dealButtons = document.querySelectorAll(".deal-btn")
const sortFilter = document.getElementById("sortFilter")
let currentDeal = ""
const noResults = document.getElementById("noResults");
const searchBtn = document.getElementById("searchBtn");

let currentCurrency = "usd";
const exchangeRate = 40;

function formatPrice(value, currency) {
  if (currency === "usd") {
    return "$" + Number(value).toLocaleString("en-US");
  }
  return Number(value * exchangeRate).toLocaleString("uk-UA") + " ₴";
}

function updatePrices() {
  propertyCards.forEach(card => {
    const usdPrice = Number(card.dataset.priceUsd);
    const priceElement = card.querySelector(".price");
    if (priceElement) {
      priceElement.textContent = formatPrice(usdPrice, currentCurrency);
    }
  });
}

function filterProperties() {
  const selectedType = typeFilter ? typeFilter.value : "";
  const selectedCity = cityFilter ? cityFilter.value : "";
  const selectedRooms = roomsFilter ? roomsFilter.value : "";
  const selectedAreaFrom = areaFrom ? areaFrom.value : "";
  const selectedAreaTo = areaTo ? areaTo.value : "";
  const selectedPriceFrom = priceFrom ? priceFrom.value : "";
  const selectedPriceTo = priceTo ? priceTo.value : "";
  const selectedDeal = currentDeal;

  let visibleCount = 0;

  propertyCards.forEach(card => {
    const cardType = card.dataset.type;
    const cardCity = card.dataset.city;
    const cardRooms = Number(card.dataset.rooms);
    const cardArea = Number(card.dataset.area);
    const cardPriceUsd = Number(card.dataset.priceUsd);

    const cardPrice = currentCurrency === "usd"
      ? cardPriceUsd
      : cardPriceUsd * exchangeRate;

    let showCard = true;

    if (selectedType && cardType !== selectedType) {
      showCard = false;
    }

    if (selectedCity && cardCity !== selectedCity) {
      showCard = false;
    }

    if (selectedRooms) {
      if (selectedRooms === "4") {
        if (cardRooms < 4) {
          showCard = false;
        }
      } else {
        if (cardRooms !== Number(selectedRooms)) {
          showCard = false;
        }
      }
    }

    if (selectedAreaFrom && cardArea < Number(selectedAreaFrom)) {
      showCard = false;
    }

    if (selectedAreaTo && cardArea > Number(selectedAreaTo)) {
      showCard = false;
    }

    if (selectedPriceFrom && cardPrice < Number(selectedPriceFrom)) {
      showCard = false;
    }

    if (selectedPriceTo && cardPrice > Number(selectedPriceTo)) {
      showCard = false;
    }
    if (selectedDeal && card.dataset.deal !== selectedDeal) {
    showCard = false;
    }

    card.style.display = showCard ? "" : "none";

    if (showCard) {
      visibleCount++;
    }
  });

  if (noResults) {
    noResults.style.display = visibleCount === 0 ? "block" : "none";
  }
}

function attachAutoFilter(element, eventType = "input") {
  if (element) {
    element.addEventListener(eventType, filterProperties);
  }
}

attachAutoFilter(typeFilter, "change");
attachAutoFilter(cityFilter, "change");
attachAutoFilter(roomsFilter, "change");
attachAutoFilter(areaFrom, "input");
attachAutoFilter(areaTo, "input");
attachAutoFilter(priceFrom, "input");
attachAutoFilter(priceTo, "input");

currencyButtons.forEach(button => {
  button.addEventListener("click", () => {
    currencyButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentCurrency = button.dataset.currency;
    updatePrices();
    filterProperties();
  });
});

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (typeFilter) typeFilter.value = "";
    if (cityFilter) cityFilter.value = "";
    if (roomsFilter) roomsFilter.value = "";
    if (areaFrom) areaFrom.value = "";
    if (areaTo) areaTo.value = "";
    if (priceFrom) priceFrom.value = "";
    if (priceTo) priceTo.value = "";

    updatePrices();
    filterProperties();
  });
}

if (searchBtn) {
  searchBtn.style.display = "none";
}

updatePrices();
filterProperties();
dealButtons.forEach(button => {
    button.addEventListener("click", () => {
        dealButtons.forEach(btn => btn.classList.remove("active"))
        button.classList.add("active")
        currentDeal = button.dataset.deal
        filterProperties()
    })
})
sortFilter.addEventListener("change", () => {
    const value = sortFilter.value
    const container = document.querySelector(".properties-grid")
    const cards = Array.from(propertyCards)

    cards.sort((a, b) => {
        const priceA = Number(a.dataset.priceUsd)
        const priceB = Number(b.dataset.priceUsd)

        if (value === "cheap") return priceA - priceB
        if (value === "expensive") return priceB - priceA
        return 0
    })

    cards.forEach(card => container.appendChild(card))
})