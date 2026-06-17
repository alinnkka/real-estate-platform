fetch("http://localhost:5000/api/test")
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.log("Помилка:", error);
    });


let lastScroll = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll && currentScroll > 100) {
    header.classList.add("hide"); // вниз
  } else {
    header.classList.remove("hide"); // вверх
  }

  lastScroll = currentScroll;
});
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

const reviewBtn = document.querySelector(".review-btn");
const reviewLoginModal = document.getElementById("reviewLoginModal");
const reviewLoginClose = document.getElementById("reviewLoginClose");

const reviewModal = document.getElementById("reviewModal");
const reviewModalClose = document.getElementById("reviewModalClose");
const saveReviewBtn = document.getElementById("saveReviewBtn");

const reviewText = document.getElementById("reviewText");
const reviewRole = document.getElementById("reviewRole");
const reviewStars = document.getElementById("reviewStars");


let reviewIndex = 0;
let allReviews = [];

function createReviewCard(review) {
    return `
        <div class="review-card">
            <div class="review-user">
                <img src="${review.avatar}" alt="${review.name}">
                <div>
                    <h3>${review.name}</h3>
                    <span>${review.role}</span>
                </div>
            </div>

            <div class="stars">${review.stars}</div>
            <p>${review.text}</p>
        </div>
    `;
}

function collectDefaultReviews() {
    const cards = document.querySelectorAll(".reviews-slide .review-card");

    cards.forEach(card => {
        allReviews.push(card.outerHTML);
    });
}

function loadUserReviews() {
    const reviews = JSON.parse(localStorage.getItem("userReviews")) || [];

    reviews.forEach(review => {
        allReviews.unshift(createReviewCard(review));
    });
}

function renderReviews() {
    const reviewsContainer = document.querySelector(".reviews-container");

    if (!reviewsContainer) return;

    reviewsContainer.innerHTML = "";

    const slide = document.createElement("div");
    slide.className = "reviews-slide active";

    for (let i = 0; i < 3; i++) {
        const reviewPosition = (reviewIndex + i) % allReviews.length;
        slide.innerHTML += allReviews[reviewPosition];
    }

    reviewsContainer.appendChild(slide);
}

if (reviewBtn) {
    reviewBtn.addEventListener("click", event => {
        event.preventDefault();

        const logged = localStorage.getItem("isLoggedIn");

        if (logged !== "true") {
            reviewLoginModal.style.display = "flex";
        } else {
            reviewModal.style.display = "flex";
        }
    });
}

if (saveReviewBtn) {
    saveReviewBtn.addEventListener("click", event => {
        event.preventDefault();

        const text = reviewText.value.trim();
        const user = JSON.parse(localStorage.getItem("currentUser"));

        if (!text) {
            alert("Напишіть відгук");
            return;
        }

        if (!user) {
            reviewModal.style.display = "none";
            reviewLoginModal.style.display = "flex";
            return;
        }

        const review = {
            name: user.name,
            avatar: user.avatar || "avatar.png",
            role: reviewRole.value,
            stars: reviewStars.value,
            text: text
        };

        const reviews = JSON.parse(localStorage.getItem("userReviews")) || [];
        reviews.unshift(review);
        localStorage.setItem("userReviews", JSON.stringify(reviews));

        allReviews.unshift(createReviewCard(review));
        reviewIndex = 0;
        renderReviews();

        reviewText.value = "";
        reviewModal.style.display = "none";
    });
}

if (reviewModalClose) {
    reviewModalClose.addEventListener("click", () => {
        reviewModal.style.display = "none";
    });
}

if (reviewModal) {
    reviewModal.addEventListener("click", event => {
        if (event.target === reviewModal) {
            reviewModal.style.display = "none";
        }
    });
}

if (reviewLoginClose) {
    reviewLoginClose.addEventListener("click", () => {
        reviewLoginModal.style.display = "none";
    });
}

if (reviewLoginModal) {
    reviewLoginModal.addEventListener("click", event => {
        if (event.target === reviewLoginModal) {
            reviewLoginModal.style.display = "none";
        }
    });
}

const prevReviewBtn = document.querySelector(".reviews-arrow.left");
const nextReviewBtn = document.querySelector(".reviews-arrow.right");

if (nextReviewBtn) {
    nextReviewBtn.addEventListener("click", () => {
        reviewIndex++;

        if (reviewIndex >= allReviews.length) {
            reviewIndex = 0;
        }

        renderReviews();
    });
}

if (prevReviewBtn) {
    prevReviewBtn.addEventListener("click", () => {
        reviewIndex--;

        if (reviewIndex < 0) {
            reviewIndex = allReviews.length - 1;
        }

        renderReviews();
    });
}

collectDefaultReviews();
loadUserReviews();
renderReviews();

let propertyCards = document.querySelectorAll(".property-card");
function renderUserPostsOnHome() {
    const propertiesGrid = document.querySelector(".properties-grid");
    const allPosts = JSON.parse(localStorage.getItem("allUserPosts")) || [];

    if (!propertiesGrid || allPosts.length === 0) return;

    allPosts.forEach(post => {
        const postCard = document.createElement("div");

        postCard.className = "property-card";
        postCard.dataset.type = post.type;
        postCard.dataset.city = post.city;
        postCard.dataset.rooms = post.rooms;
        postCard.dataset.area = post.area;
        postCard.dataset.priceUsd = post.price.replace("$", "").replace(/,/g, "");
        postCard.dataset.deal = post.deal;
        postCard.dataset.phone = post.phone;
        postCard.dataset.name = post.sellerName;
        postCard.dataset.role = post.sellerRole;
        postCard.dataset.avatar = post.sellerAvatar;

        postCard.innerHTML = `
            <img src="${post.image}" alt="${post.title}">

            <div class="property-info">
                <span class="property-type">${post.type}</span>
                <h3>${post.title}</h3>
                <p class="property-location">${post.location}</p>
                <p class="property-details">${post.details}</p>

                <div class="property-bottom">
                    <span class="price">${post.price}</span>

                    <div class="card-buttons">
                        <img src="heart-b.png" class="card-heart">
                        <a href="#" class="details-btn">Детальніше</a>
                    </div>
                </div>
            </div>
        `;

        propertiesGrid.prepend(postCard);
        
    });
}


async function loadPropertiesFromDatabase() {
    try {
        const response = await fetch("http://localhost:5000/api/properties");
        const properties = await response.json();

        const propertiesGrid = document.querySelector(".properties-grid");

        if (!propertiesGrid) return;

        properties.forEach(property => {
            const postCard = document.createElement("div");

            let photos = [];

            try {
                photos = JSON.parse(property.photos);
            } catch (e) {
                photos = [property.image];
            }

            postCard.className = "property-card";
            postCard.dataset.type = property.type;
            postCard.dataset.city = property.city;
            postCard.dataset.rooms = property.rooms;
            postCard.dataset.area = property.area;
            postCard.dataset.priceUsd = property.price;
            postCard.dataset.deal = property.deal;
            postCard.dataset.phone = property.phone || "";
            postCard.dataset.name = property.seller_name || "Власник";
            postCard.dataset.role = "Власник";
            postCard.dataset.avatar = property.seller_avatar || "avatar.png";

            postCard.innerHTML = `
                <img src="${property.image}" alt="${property.title}">

                <div class="property-info">
                    <span class="property-type">${property.type}</span>
                    <h3>${property.title}</h3>
                    <p class="property-location">${property.district ? property.city + ", " + property.district : property.city}</p>
                    <p class="property-details">${property.rooms} кімнати • ${property.area} м²</p>

                    <div class="property-bottom">
                        <span class="price">$${Number(property.price).toLocaleString("en-US")}</span>

                        <div class="card-buttons">
                            <img src="heart-b.png" class="card-heart">
                            <a href="#" class="details-btn">Детальніше</a>
                        </div>
                    </div>
                </div>
            `;

            propertiesGrid.prepend(postCard);

            propertyExtraData[property.title] = {
                floor: property.floor || "не вказано",
                state: property.state || "не вказано",
                description: property.description || "Додаткова інформація відсутня.",
                photos: photos
            };
        });

        propertyCards = document.querySelectorAll(".property-card");
        updatePrices();
        filterProperties();
        attachPropertyEvents();
    } catch (error) {
        console.log("Помилка завантаження оголошень з БД:", error);
    }
}

function attachPropertyEvents() {
    document.querySelectorAll(".details-btn").forEach(button => {
        button.onclick = function(event) {
            event.preventDefault();

            const card = this.closest(".property-card");
            if (!card) return;

            const title = card.querySelector("h3").textContent.trim();
            const extra = propertyExtraData[title];
            
            const phone = card.dataset.phone;
            const name = card.dataset.name;
            const role = card.dataset.role;
            const avatar = card.dataset.avatar;

            const contactBtn = document.querySelector(".contact-btn");
            const sellerName = document.getElementById("sellerName");
            const sellerRole = document.getElementById("sellerRole");
            const sellerAvatar = document.getElementById("sellerAvatar");

            if (sellerName) sellerName.textContent = name || "Власник";
            if (sellerRole) sellerRole.textContent = role || "Користувач";
            if (sellerAvatar) sellerAvatar.src = avatar || "avatar.png";

            if (contactBtn) {
                contactBtn.dataset.phone = phone || "";
                contactBtn.textContent = "Зв’язатися з продавцем";
                contactBtn.classList.remove("phone-visible");
                contactBtn.style.pointerEvents = "auto";
            }
            modalTitle.textContent = title;
            modalLocation.textContent = card.querySelector(".property-location").textContent;
            modalDetails.textContent = card.querySelector(".property-details").textContent;
            modalPrice.textContent = card.querySelector(".price").textContent;

            modalDeal.textContent = card.dataset.deal || "Купівля";
            modalFloor.textContent = extra ? extra.floor : "не вказано";
            modalState.textContent = extra ? extra.state : "не вказано";
            modalDescription.textContent = extra ? extra.description : "Додаткова інформація відсутня.";

            const photos = extra && extra.photos ? extra.photos : [card.querySelector("img").src];

            modalImage.src = photos[0];

            modalThumbs.forEach((thumb, index) => {
                if (photos[index]) {
                    thumb.style.display = "block";
                    thumb.src = photos[index];

                    thumb.onclick = function() {
                        modalImage.src = this.src;
                    };
                } else {
                    thumb.style.display = "none";
                }
            });

            modal.style.display = "flex";

            setTimeout(() => {
                modal.classList.add("show");
            }, 10);
        };
    });
}

propertyCards = document.querySelectorAll(".property-card");
const togglePropertiesBtn = document.getElementById("togglePropertiesBtn");
let showAllProperties = false;
const initialVisibleCount = 9;
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
function updateVisibleProperties() {
  const filteredCards = Array.from(propertyCards).filter(card => card.dataset.filtered !== "false");

  filteredCards.forEach((card, index) => {
    if (!showAllProperties && index >= initialVisibleCount) {
      card.style.display = "none";
    } else {
      card.style.display = "";
    }
  });

  if (togglePropertiesBtn) {
    if (filteredCards.length <= initialVisibleCount) {
      togglePropertiesBtn.style.display = "none";
    } else {
      togglePropertiesBtn.style.display = "inline-block";
      togglePropertiesBtn.textContent = showAllProperties ? "Менше оголошень" : "Більше оголошень";
    }
  }
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
  showAllProperties = false;
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
    card.dataset.filtered = showCard ? "true" : "false";
    card.style.display = showCard ? "" : "none";

    if (showCard) {
      visibleCount++;
    }
  });

  if (noResults) {
    noResults.style.display = visibleCount === 0 ? "block" : "none";
  }
  updateVisibleProperties();
}
updateVisibleProperties();

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
    showAllProperties = false;

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
    showAllProperties = false;
})
if (togglePropertiesBtn) {
  togglePropertiesBtn.addEventListener("click", () => {
    const buttonTop = togglePropertiesBtn.getBoundingClientRect().top + window.pageYOffset;

    showAllProperties = !showAllProperties;
    updateVisibleProperties();

    if (!showAllProperties) {
      window.scrollTo(0, buttonTop - 60);
    }
  });
}


const modal = document.getElementById("propertyModal");
const modalClose = document.querySelector(".modal-close");

const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalLocation = document.getElementById("modalLocation");
const modalDetails = document.getElementById("modalDetails");
const modalPrice = document.getElementById("modalPrice");

const modalDeal = document.getElementById("modalDeal");
const modalFloor = document.getElementById("modalFloor");
const modalState = document.getElementById("modalState");
const modalDescription = document.getElementById("modalDescription");
const modalThumbs = document.querySelectorAll(".modal-thumb");

const propertyExtraData = {
  "Квартира в ЖК відпочинок": {
    floor: "4 з 9",
    state: "з ремонтом",
    description: "Затишна квартира у сучасному житловому комплексі з гарною інфраструктурою та зручним розташуванням.",
    photos: [
        "https://respect.kharkov.ua/wp-content/uploads/2021/05/Dizayn-odnokomnatnoy-kvartiry.jpg",
        "https://nabuduvaly.com/wp-content/uploads/2023/12/Dyzayn-kvartyry-50-kv-m-kukhnia-vitalnia-foto-5.jpg",
        "https://polyakova.biz/content/portfolio/314/previewlist-314.jpg"
    ]
},

"Квартира в центрі міста": {
    floor: "3 з 5",
    state: "житловий стан",
    description: "Компактна квартира в центрі Одеси, ідеально підходить для проживання або оренди.",
    photos: [
        "https://assets.leoceramika.com/assets/global/upload/files/59-1.jpg",
        "https://nabuduvaly.com/wp-content/uploads/2023/10/Dyzayn-kvartyry-skladnoi-formy-foto-3.jpg",
        "https://nabuduvaly.com/wp-content/uploads/2023/10/Dyzayn-kvartyry-skladnoi-formy-foto-4.jpg"
    ]
},

"Просторий будинок для сім’ї": {
    floor: "2 поверхи",
    state: "сучасний ремонт",
    description: "Великий будинок з подвір’ям, гаражем та зоною відпочинку для всієї родини.",
    photos: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        "https://homeart.com.ua/wp-content/uploads/2024/12/interier-vitalni-v-pryvatnomu-budynku-20-819x1024.jpg",
        "https://homeart.com.ua/wp-content/uploads/2024/12/interier-vitalni-v-pryvatnomu-budynku-21-820x1024.jpg"
    ]
},

"Компактна квартира в центрі": {
    floor: "5 з 10",
    state: "новобудова",
    description: "Сучасна квартира у новому будинку з гарним ремонтом та зручною локацією.",
    photos: [
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
        "https://interiorsmall.ru/wp-content/uploads/edinyj-interyer-malenkoy-kvartiry-14.jpg",
        "https://cdn0.divan.ru/img/v1/bNB_X4h0r3fhdE_0gSl7Rlae___n1w8UXmCZbZGmIbc/rs:fit:1920:1440:0:0/g:ce:0:0/bg:ffffff/q:85/czM6Ly9kaXZhbi93aWtpLWFydGljbGUvNDUyOTM1NC5qcGc.jpg"
    ]
},

"Без комісії!": {
    floor: "6 з 10",
    state: "з ремонтом",
    description: "Квартира без додаткових комісій, повністю готова до заселення.",
    photos: [
        "https://www.remontov.kiev.ua/wp-content/uploads/2023/02/pe17-1.jpg",
        "https://moskomplekt.ru/wp-content/uploads/2017/04/dizayn-malenkoy-kvartiry-2.jpg",
        "https://cdn.lifehacker.ru/wp-content/uploads/2020/04/image2_1587460076-e1587460140274-630x315.jpg"
    ]
},

"Будинок із сучасним фасадом": {
    floor: "2 поверхи",
    state: "новий",
    description: "Будинок з сучасною архітектурою та стильним дизайном фасаду.",
    photos: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
        "https://homeart.com.ua/wp-content/uploads/2024/12/interier-vitalni-v-pryvatnomu-budynku-2-1024x717.jpg",
        "https://soprano.in.ua/storage/sefirstscreen/620a1feccc01e1644830700.jpg"
    ]
},

"Квартира в новобудові": {
    floor: "10 з 16",
    state: "новий ремонт",
    description: "Квартира в новому будинку з сучасним плануванням і гарною інфраструктурою.",
    photos: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://homeart.com.ua/wp-content/uploads/2024/12/interier-vitalni-v-pryvatnomu-budynku-3-1024x1024.jpg",
        "https://homeart.com.ua/wp-content/uploads/2024/12/interier-vitalni-v-pryvatnomu-budynku-4-1024x1024.jpg"
    ]
},

"Дуплекс з новим ремонтом готовий до продажу": {
    floor: "2 поверхи",
    state: "новий ремонт",
    description: "Сучасний дуплекс з якісним ремонтом, готовий до заселення.",
    photos: [
        "https://ireland.apollo.olxcdn.com/v1/files/fgk7h6jgpnof3-UA/image;s=1080x814",
        "https://rikka-khust.com/wp-content/uploads/2025/07/25-06-15-1978-88-web.jpeg",
        "https://rikka-khust.com/wp-content/uploads/2025/07/25-06-15-2014-web.jpeg"
    ]
},

"Довгострокова оренда в ЖК Big Ben": {
    floor: "7 з 12",
    state: "з ремонтом",
    description: "Квартира для довгострокової оренди з усіма необхідними зручностями.",
    photos: [
        "https://nabuduvaly.com/wp-content/uploads/2023/11/Odnokimnatna-kvartyra-45-kv-m-kukhnia-vitalnia-foto-5.jpg",
        "https://rikka-khust.com/wp-content/uploads/2025/07/25-06-15-2034-web.jpeg",
        "https://rikka-khust.com/wp-content/uploads/2025/07/25-06-15-2030-web.jpeg"
    ]
},

"Просторий будинок": {
    floor: "2 поверхи",
    state: "житловий стан",
    description: "Великий будинок для комфортного проживання з усією необхідною інфраструктурою.",
    photos: [
        "https://proektcottage.com.ua/wp-content/uploads/2018/06/r2_0002-1.jpg",
        "https://dominant-wood.com.ua/images/statii/komnaty-v-derevyannom-dome/kabinet-1.jpg",
        "https://budportal.lutsk.ua/uploads/posts/2016-12/1481278032_0.jpg"
    ]
},

"Стильна квартира для молодої сім’ї": {
    floor: "5 з 9",
    state: "сучасний ремонт",
    description: "Ідеальна квартира для молодої сім’ї з гарним дизайном та комфортним плануванням.",
    photos: [
        "https://images.unsplash.com/photo-1448630360428-65456885c650",
        "https://familycomfort.in.ua/content/uploads/images/76wha7.png",
        "https://kruizer.com.ua/wp-content/uploads/2022/09/eab79f6f6215fe887baad7e4c9884e79.jpeg"
    ]
},

"Затишна квартира біля метро": {
    floor: "3 з 9",
    state: "житловий стан",
    description: "Квартира поруч із метро, зручна для щоденного проживання.",
    photos: [
        "https://emotion.biz.ua/proekti/066_misto_kvitiv/001.jpg",
        "https://idei-dekoru.com/wp-content/uploads/2017/12/677a270e1c2f5cb6d9bfacb4c38ca44f.jpg",
        "https://i.pinimg.com/236x/98/fc/9d/98fc9d282a7c59a26235eb2b34806497.jpg"
    ]
},

"Квартира з дизайнерським ремонтом": {
    floor: "8 з 12",
    state: "дизайнерський ремонт",
    description: "Стильна квартира з унікальним інтер’єром та якісними матеріалами.",
    photos: [
        "https://polyakova.biz/content/portfolio/353/previewlist-353.jpg",
        "https://faina-khata.com/wp-content/uploads/2025/09/Spalnia-i-vitalnia-v-odniy-kimnati-foto-5.jpg",
        "https://homeart.com.ua/wp-content/uploads/2025/03/dyzain-spalni-vitalni-5-1024x889.jpg"
    ]
},

"Квартира з панорамними вікнами": {
    floor: "12 з 16",
    state: "новий ремонт",
    description: "Світла квартира з великими панорамними вікнами та гарним видом.",
    photos: [
        "https://images.unsplash.com/photo-1484154218962-a197022b5858",
        "https://kupistul.ua/public/upload/blog/kak_sovmestit_spalnyu_i_gostinuyu_8_idey_s_foto_primerami_17121327064448_image.jpeg",
        "https://nabuduvaly.com/wp-content/uploads/2022/07/Zonuvannia-vitalni-i-spalni-foto-21.jpg"
    ]
},

"Будинок із терасою та двором": {
    floor: "2 поверхи",
    state: "з ремонтом",
    description: "Будинок з великою терасою, подвір’ям та місцем для відпочинку.",
    photos: [
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
        "https://faina-khata.com/wp-content/uploads/2025/06/Spalnia-i-vitalnia-v-odniy-kimnati-foto-8-819x1024.jpg",
        "https://i.pinimg.com/originals/ba/25/d7/ba25d7a76f552fe051485238956c88f8.jpg"
    ]
},

"Оренда квартири біля моря": {
    floor: "5 з 10",
    state: "з ремонтом",
    description: "Квартира поруч із морем, ідеальна для відпочинку або життя.",
    photos: [
        "https://oneandhome.ru/sites/default/files/blog2022/sovremennaya-kvartira-modnie-resheniya-i-stilnie-idei-02.JPG",
        "https://idei-dekoru.com/wp-content/uploads/2016/02/gostinaya_i_spalnya_v_odnoy_komnate_02-650x433.jpg",
        "https://kruizer.com.ua/wp-content/uploads/2022/09/e8b9172c44603bd5f3d61dd6e1823577.jpeg"
    ]
},

"Оренда заміського будинку": {
    floor: "2 поверхи",
    state: "житловий стан",
    description: "Заміський будинок для оренди з просторою територією.",
    photos: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://kruizer.com.ua/wp-content/uploads/2022/09/23aeda22421bb8862af46beaff25def8.jpeg",
        "https://nabuduvaly.com/wp-content/uploads/2022/07/Dyzayn-spalni-z-vitalneiu-u-svitlykh-tonakh-foto-41.jpg"
    ]
},
    "Сучасна квартира в Києві": {
        floor: "8 з 16",
        state: "сучасний ремонт",
        description: "Простора квартира в Печерському районі з якісним ремонтом, зручним плануванням та гарною транспортною доступністю.",
        photos: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
            "https://market-images.lunstatic.net/lun-ua/480/360/images/offers/1862987548545806.jpg",
            "https://faina-khata.com/wp-content/uploads/2025/06/Spalnia-i-vitalnia-v-odniy-kimnati-foto-5-819x1024.jpg"
        ]
    },
    "Затишний будинок у Львові": {
        floor: "2 поверхи",
        state: "житловий стан",
        description: "Затишний будинок для сім’ї з просторими кімнатами, двором та зручним розташуванням у спокійному районі Львова.",
        photos: [
            "https://manhattan-up.com.ua/wp-content/uploads/2023/10/yak-vyglyadaye-kvartyra-studiya-1.jpg.webp",
            "https://dominant-wood.com.ua/images/statii/komnaty-v-derevyannom-dome/kladovka.jpg",
            "https://dominant-wood.com.ua/images/statii/komnaty-v-derevyannom-dome/kladovka-1.jpg"
        ]
    },
    "Світла квартира біля моря": {
        floor: "6 з 12",
        state: "з ремонтом",
        description: "Світла квартира неподалік моря з функціональним плануванням, просторою кухнею та зручним доступом до інфраструктури.",
        photos: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
            "https://polyakova.biz/content/portfolio/353/previewlist-353.jpg",
            "https://oneandhome.ru/sites/default/files/blog2022/sovremennaya-kvartira-modnie-resheniya-i-stilnie-idei-02.JPG"
        ]
    }
};
const allUserPostsForExtraData = JSON.parse(localStorage.getItem("allUserPosts")) || [];

allUserPostsForExtraData.forEach(post => {
    propertyExtraData[post.title] = {
        floor: post.floor || "не вказано",
        state: post.state || "не вказано",
        description: post.description || "Додаткова інформація відсутня.",
        photos: post.photos || [post.image]
    };
});
function getCardFullData(card) {
    const title = card.querySelector("h3").textContent.trim();
    const extra = propertyExtraData[title];

    return {
        title: title,
        image: card.querySelector("img").src,
        type: card.dataset.type,
        deal: card.dataset.deal,
        location: card.querySelector(".property-location").textContent,
        details: card.querySelector(".property-details").textContent,
        price: card.querySelector(".price").textContent,
        phone: card.dataset.phone,
        sellerName: card.dataset.name,
        sellerRole: card.dataset.role,
        sellerAvatar: card.dataset.avatar,
        floor: extra ? extra.floor : "не вказано",
        state: extra ? extra.state : "не вказано",
        description: extra ? extra.description : "Додаткова інформація про об’єкт буде уточнена продавцем.",
        photos: extra ? extra.photos : [card.querySelector("img").src]
    };
}

function savePropertiesCatalog() {
    const catalog = {};

    document.querySelectorAll(".property-card").forEach(card => {
        const item = getCardFullData(card);
        catalog[item.title] = item;
    });

    localStorage.setItem("propertiesCatalog", JSON.stringify(catalog));
}

savePropertiesCatalog();

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

let favorites = [];
let viewed = [];

let favoritesKey = null;
let viewedKey = null;

if (currentUser) {
    favoritesKey = `favorites_${currentUser.email}`;
    viewedKey = `viewed_${currentUser.email}`;

    favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];
    viewed = JSON.parse(localStorage.getItem(viewedKey)) || [];
}

document.querySelectorAll(".details-btn").forEach(button => {
    button.addEventListener("click", function(event) {
        event.preventDefault();
        const modalHeart = document.querySelector(".modal-heart");
        const card = this.closest(".property-card");
        const title = card.querySelector("h3").textContent.trim();
        const extra = propertyExtraData[title];
        const viewedItem = getCardFullData(card);

        const existingViewed = viewed.find(item => item.title === title);

        if (!existingViewed) {
        viewed.unshift(viewedItem);

        if (viewed.length > 20) {
        viewed.pop();
        }

         localStorage.setItem(viewedKey, JSON.stringify(viewed));
        }
        const phone = card.dataset.phone;
        const contactBtn = document.querySelector(".contact-btn");
        const name = card.dataset.name;
        const role = card.dataset.role;
        const avatar = card.dataset.avatar;

        const sellerName = document.getElementById("sellerName");
        const sellerRole = document.getElementById("sellerRole");
        const sellerAvatar = document.getElementById("sellerAvatar");

if (sellerName) sellerName.textContent = name || "Невідомо";
if (sellerRole) sellerRole.textContent = role || "Продавець";
if (sellerAvatar) sellerAvatar.src = avatar || "avatar.png";
        if (contactBtn) {
        contactBtn.dataset.phone = phone;
        contactBtn.textContent = "Зв’язатися з продавцем";
        contactBtn.classList.remove("phone-visible");
        contactBtn.style.pointerEvents = "auto";
        }
        modalTitle.textContent = title;
        modalLocation.textContent = card.querySelector(".property-location").textContent;
        modalDetails.textContent = card.querySelector(".property-details").textContent;
        modalPrice.textContent = card.querySelector(".price").textContent;
      


function isModalFavorite(){
    return favorites.some(item => item.title === title);
}

modalHeart.src = isModalFavorite() ? "heart-r.png" : "heart-b.png";

modalHeart.onclick = function() {
    const logged = localStorage.getItem("isLoggedIn");

    if (logged !== "true") {
        openLoginModal();
        return;
    }

    if (isModalFavorite()) {
        favorites = favorites.filter(item => item.title !== title);
        modalHeart.src = "heart-b.png";
    } else {
        const favoriteItem = getCardFullData(card);
        favorites.push(favoriteItem);
        modalHeart.src = "heart-r.png";
    }

    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    updateFavoritesCount();

    document.querySelectorAll(".property-card").forEach(card => {
        if (card.querySelector("h3").textContent.trim() === title) {
            const heart = card.querySelector(".card-heart");
            heart.src = isModalFavorite() ? "heart-r.png" : "heart-b.png";
        }
    });
};
        modalDeal.textContent = card.dataset.deal || "Купівля";
        modalFloor.textContent = extra ? extra.floor : "не вказано";
        modalState.textContent = extra ? extra.state : "не вказано";
        modalDescription.textContent = extra ? extra.description : "Додаткова інформація відсутня.";

        const photos = extra ? extra.photos : [card.querySelector("img").src];

        modalImage.src = photos[0];

        modalThumbs.forEach((thumb, index) => {
            thumb.src = photos[index] || photos[0];

            thumb.onclick = function() {
                modalImage.src = this.src;
            };
        });

        modal.style.display = "flex";

        setTimeout(() => {
        modal.classList.add("show");
        }, 10);
    });
});

modalClose.addEventListener("click", function() {

    modal.classList.remove("show");

    setTimeout(() => {
        modal.style.display = "none";
    }, 500);

});

modal.addEventListener("click", function(event) {

    if (event.target === modal) {

        modal.classList.remove("show");

        setTimeout(() => {
            modal.style.display = "none";
        }, 500);

    }

});


const cardHearts = document.querySelectorAll(".card-heart");
const favoritesCount = document.getElementById("favoritesCount");



function updateFavoritesCount(){
    if (favoritesCount) {
        favoritesCount.textContent = favorites.length;
    }
}



cardHearts.forEach(heart => {
    const card = heart.closest(".property-card");
    const title = card.querySelector("h3").textContent.trim();

    function isFavorite(){
        return favorites.some(item => item.title === title);
    }

    heart.src = isFavorite() ? "heart-r.png" : "heart-b.png";

    heart.addEventListener("click", () => {
    const logged = localStorage.getItem("isLoggedIn");

    if (logged !== "true") {
    openLoginModal();
    return;
    }

        if (isFavorite()) {
            favorites = favorites.filter(item => item.title !== title);
            heart.src = "heart-b.png";
        } else {
        const favoriteItem = getCardFullData(card);

            favorites.push(favoriteItem);
            heart.src = "heart-r.png";
        }

        localStorage.setItem(favoritesKey, JSON.stringify(favorites));
        updateFavoritesCount();
    });
});

updateFavoritesCount();

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("contact-btn")) {
        e.preventDefault();

        const rawPhone = e.target.dataset.phone;

        function formatPhone(phone) {
            if (!phone) {
                return "Номер не вказано";
            }

            return phone.replace(
                /(\+380)(\d{2})(\d{3})(\d{2})(\d{2})/,
                "$1 $2 $3 $4 $5"
            );
        }

        const formattedPhone = formatPhone(rawPhone);

        e.target.textContent = formattedPhone;
        e.target.classList.add("phone-visible");

        e.target.style.pointerEvents = "none";
    }
});


const headerAvatar = document.getElementById("headerAvatar");
const headerUserName = document.getElementById("headerUserName");
const logoutBtn = document.getElementById("logoutBtn");
const profileBtn = document.querySelector(".profile-btn");


const isLoggedIn = localStorage.getItem("isLoggedIn");


if (isLoggedIn === "true" && currentUser) {
    if (headerUserName) headerUserName.textContent = currentUser.name;
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (profileBtn) profileBtn.href = "profile.html";

    if (headerAvatar) {
        headerAvatar.src = "avatar.png";

        fetch(`http://localhost:5000/api/users/${currentUser.id}/avatar`)
            .then(response => response.json())
            .then(data => {
                headerAvatar.src = data.avatar || "avatar.png";
            })
            .catch(error => {
                headerAvatar.src = "avatar.png";
            });
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");

        window.location.reload();
    });
}



const loginModal = document.getElementById("loginModal");
const loginModalClose = document.querySelector(".login-modal-close");
const addBtn = document.querySelector(".add-btn");

function openLoginModal(){
    if (loginModal) {
        loginModal.style.display = "flex";
    }
}

function closeLoginModal(){
    if (loginModal) {
        loginModal.style.display = "none";
    }
}

if (loginModalClose) {
    loginModalClose.addEventListener("click", closeLoginModal);
}

if (loginModal) {
    loginModal.addEventListener("click", function(event){
        if (event.target === loginModal) {
            closeLoginModal();
        }
    });
}

if (addBtn) {
    addBtn.addEventListener("click", function(event){
        const logged = localStorage.getItem("isLoggedIn");

        if (logged !== "true") {
            event.preventDefault();
            openLoginModal();
        } else {
            event.preventDefault();
            window.location.href = "profile.html";
        }
    });
}

const headerAddPostBtn = document.getElementById("headerAddPostBtn");

if (headerAddPostBtn) {
    headerAddPostBtn.addEventListener("click", event => {
        event.preventDefault();

        const logged = localStorage.getItem("isLoggedIn");

        if (logged === "true") {
            window.location.href = "profile.html#myAds";
        } else {
            openLoginModal();
        }
    });
}
loadPropertiesFromDatabase();