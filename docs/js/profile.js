const profileAvatar = document.getElementById("profileAvatar");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileLogoutBtn = document.getElementById("profileLogoutBtn");

const profileTabs = document.querySelectorAll(".profile-tab");
const profileContents = document.querySelectorAll(".profile-content");
const favoriteList = document.getElementById("favoriteList");
const viewedList = document.getElementById("viewedList");
const favoritesCount = document.getElementById("favoritesCount");

const headerAvatar = document.getElementById("headerAvatar");
const headerUserName = document.getElementById("headerUserName");

const profilePropertyModal = document.getElementById("profilePropertyModal");
const profileModalClose = document.getElementById("profileModalClose");
const profileModalImage = document.getElementById("profileModalImage");
const profileModalTitle = document.getElementById("profileModalTitle");
const profileModalLocation = document.getElementById("profileModalLocation");
const profileModalDetails = document.getElementById("profileModalDetails");
const profileModalPrice = document.getElementById("profileModalPrice");
const profileModalDeal = document.getElementById("profileModalDeal");
const profileModalFloor = document.getElementById("profileModalFloor");
const profileModalState = document.getElementById("profileModalState");
const profileModalDescription = document.getElementById("profileModalDescription");
const profileModalThumbs = document.querySelectorAll(".profile-modal-thumb");

const profileSellerAvatar = document.getElementById("profileSellerAvatar");
const profileSellerName = document.getElementById("profileSellerName");
const profileSellerRole = document.getElementById("profileSellerRole");
const profileContactBtn = document.getElementById("profileContactBtn");
const profileModalHeart = document.getElementById("profileModalHeart");

const isLoggedIn = localStorage.getItem("isLoggedIn");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (isLoggedIn !== "true" || !currentUser) {
    window.location.href = "auth.html";
}

profileAvatar.src = currentUser.avatar || "avatar.png";
profileName.textContent = currentUser.name;
profileEmail.textContent = currentUser.email;

if (headerAvatar) headerAvatar.src = currentUser.avatar || "avatar.png";
if (headerUserName) headerUserName.textContent = currentUser.name;

const favoritesKey = `favorites_${currentUser.email}`;
const viewedKey = `viewed_${currentUser.email}`;
const propertiesCatalog = JSON.parse(localStorage.getItem("propertiesCatalog")) || {};

let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];
let viewed = JSON.parse(localStorage.getItem(viewedKey)) || [];

function normalizeItem(item) {
    const full = propertiesCatalog[item.title] || {};

    return {
        ...full,
        ...item,
        phone: item.phone || full.phone,
        sellerName: item.sellerName || full.sellerName,
        sellerRole: item.sellerRole || full.sellerRole,
        sellerAvatar: item.sellerAvatar || full.sellerAvatar,
        floor: item.floor || full.floor || "не вказано",
        state: item.state || full.state || "не вказано",
        description: item.description || full.description || "Додаткова інформація про об’єкт буде уточнена продавцем.",
        photos: item.photos && item.photos.length > 1 ? item.photos : full.photos || [item.image]
    };
}

favorites = favorites
    .filter(item => typeof item === "object" && item.title)
    .map(normalizeItem);

viewed = viewed
    .filter(item => typeof item === "object" && item.title)
    .map(normalizeItem);

localStorage.setItem(favoritesKey, JSON.stringify(favorites));
localStorage.setItem(viewedKey, JSON.stringify(viewed));

function updateFavoritesCount() {
    if (favoritesCount) {
        favoritesCount.textContent = favorites.length;
    }
}

function showTab(tabName) {
    profileTabs.forEach(item => item.classList.remove("active"));
    profileContents.forEach(content => content.classList.remove("active"));

    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    const activeContent = document.getElementById(tabName);

    if (activeTab) activeTab.classList.add("active");
    if (activeContent) activeContent.classList.add("active");
}

profileTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        showTab(tab.dataset.tab);
    });
});

function openProfileModal(item) {
    const photos = item.photos || [item.image];

    profileModalImage.src = photos[0];
    profileModalTitle.textContent = item.title;
    profileModalLocation.textContent = item.location;
    profileModalDetails.textContent = item.details;
    profileModalPrice.textContent = item.price;

    profileModalDeal.textContent = item.deal || "Купівля";
    profileModalFloor.textContent = item.floor || "не вказано";
    profileModalState.textContent = item.state || "не вказано";
    profileModalDescription.textContent = item.description || "Додаткова інформація про об’єкт буде уточнена продавцем.";

    profileModalThumbs.forEach((thumb, index) => {
        thumb.src = photos[index] || photos[0];

        thumb.onclick = function () {
            profileModalImage.src = this.src;
        };
    });

    profileSellerAvatar.src = item.sellerAvatar || "avatar.png";
    profileSellerName.textContent = item.sellerName || "Продавець";
    profileSellerRole.textContent = item.sellerRole || "Рієлтор";

    profileContactBtn.textContent = "Зв’язатися з продавцем";
    profileContactBtn.dataset.phone = item.phone || "";
    profileContactBtn.style.display = "inline-block";
    profileContactBtn.style.pointerEvents = "auto";

    const isFavorite = favorites.some(fav => fav.title === item.title);
    profileModalHeart.src = isFavorite ? "heart-r.png" : "heart-b.png";

    profileModalHeart.onclick = () => {
        const exists = favorites.some(fav => fav.title === item.title);

        if (exists) {
            favorites = favorites.filter(fav => fav.title !== item.title);
            profileModalHeart.src = "heart-b.png";
        } else {
            favorites.push(item);
            profileModalHeart.src = "heart-r.png";
        }

        localStorage.setItem(favoritesKey, JSON.stringify(favorites));
        updateFavoritesCount();
        loadFavorites();
    };

    profilePropertyModal.style.display = "flex";

    setTimeout(() => {
        profilePropertyModal.classList.add("show");
    }, 10);
}

function closeProfileModal() {
    profilePropertyModal.classList.remove("show");

    setTimeout(() => {
        profilePropertyModal.style.display = "none";
    }, 300);
}

if (profileModalClose) {
    profileModalClose.addEventListener("click", closeProfileModal);
}

if (profilePropertyModal) {
    profilePropertyModal.addEventListener("click", event => {
        if (event.target === profilePropertyModal) {
            closeProfileModal();
        }
    });
}

if (profileContactBtn) {
    profileContactBtn.addEventListener("click", () => {
        const phone = profileContactBtn.dataset.phone;

        if (phone) {
            profileContactBtn.textContent = phone.replace(
                /(\+380)(\d{2})(\d{3})(\d{2})(\d{2})/,
                "$1 $2 $3 $4 $5"
            );

            profileContactBtn.style.pointerEvents = "none";
        }
    });
}

function loadFavorites() {
    if (!favoriteList) return;

    if (favorites.length === 0) {
        favoriteList.innerHTML = `<p class="empty-text">Поки що немає обраних оголошень.</p>`;
        return;
    }

    favoriteList.innerHTML = "";

    favorites.forEach(item => {
        favoriteList.innerHTML += `
            <div class="property-card profile-property-card">
                <img src="${item.image}" alt="${item.title}">

                <div class="property-info">
                    <span class="property-type">${item.type || "Нерухомість"}</span>
                    <h3>${item.title}</h3>
                    <p class="property-location">${item.location}</p>
                    <p class="property-details">${item.details}</p>

                    <div class="property-bottom">
                        <span class="price">${item.price}</span>

                        <div class="card-buttons">
                            <img src="heart-r.png"
                                 class="card-heart profile-favorite-heart"
                                 data-title="${item.title}">

                            <button class="details-btn profile-details-btn"
                                    data-title="${item.title}">
                                Детальніше
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    document.querySelectorAll(".profile-favorite-heart").forEach(heart => {
        heart.addEventListener("click", () => {
            const title = heart.dataset.title;

            favorites = favorites.filter(item => item.title !== title);
            localStorage.setItem(favoritesKey, JSON.stringify(favorites));

            updateFavoritesCount();
            loadFavorites();
        });
    });

    document.querySelectorAll(".profile-details-btn").forEach(button => {
        button.addEventListener("click", () => {
            const title = button.dataset.title;
            const item = favorites.find(item => item.title === title);

            if (item) {
                openProfileModal(item);
            }
        });
    });
}

function loadViewed() {
    if (!viewedList) return;

    if (viewed.length === 0) {
        viewedList.innerHTML = `<p class="empty-text">Поки що немає переглянутих оголошень.</p>`;
        return;
    }

    viewedList.innerHTML = "";

    viewed.forEach(item => {
        const isFavorite = favorites.some(fav => fav.title === item.title);
        const heartImage = isFavorite ? "heart-r.png" : "heart-b.png";

        viewedList.innerHTML += `
            <div class="property-card profile-property-card">
                <img src="${item.image}" alt="${item.title}">

                <div class="property-info">
                    <span class="property-type">${item.type || "Нерухомість"}</span>
                    <h3>${item.title}</h3>
                    <p class="property-location">${item.location}</p>
                    <p class="property-details">${item.details}</p>

                    <div class="property-bottom">
                        <span class="price">${item.price}</span>

                        <div class="card-buttons">
                            <img src="${heartImage}"
                                 class="card-heart viewed-favorite-heart"
                                 data-title="${item.title}">

                            <button class="details-btn viewed-details-btn"
                                    data-title="${item.title}">
                                Детальніше
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    document.querySelectorAll(".viewed-details-btn").forEach(button => {
        button.addEventListener("click", () => {
            const title = button.dataset.title;
            const item = viewed.find(item => item.title === title);

            if (item) {
                openProfileModal(item);
            }
        });
    });

    document.querySelectorAll(".viewed-favorite-heart").forEach(heart => {
        heart.addEventListener("click", () => {
            const title = heart.dataset.title;
            const item = viewed.find(item => item.title === title);

            const exists = favorites.some(fav => fav.title === title);

            if (exists) {
                favorites = favorites.filter(fav => fav.title !== title);
                heart.src = "heart-b.png";
            } else if (item) {
                favorites.push(item);
                heart.src = "heart-r.png";
            }

            localStorage.setItem(favoritesKey, JSON.stringify(favorites));
            updateFavoritesCount();
            loadFavorites();
            loadViewed();
        });
    });
}

updateFavoritesCount();
loadFavorites();
loadViewed();

if (window.location.hash === "#favorites") {
    showTab("favorites");
}

if (window.location.hash === "#viewed") {
    showTab("viewed");
}

if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
    });
}