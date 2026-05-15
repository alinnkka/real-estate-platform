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
const myPostsKey = `myPosts_${currentUser.email}`;

const propertiesCatalog = JSON.parse(localStorage.getItem("propertiesCatalog")) || {};

let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];
let viewed = JSON.parse(localStorage.getItem(viewedKey)) || [];
let myPosts = JSON.parse(localStorage.getItem(myPostsKey)) || [];
let editingPostTitle = null;
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
        photos: item.photos && item.photos.length > 0 ? item.photos : full.photos || [item.image]
    };
}

favorites = favorites.filter(item => typeof item === "object" && item.title).map(normalizeItem);
viewed = viewed.filter(item => typeof item === "object" && item.title).map(normalizeItem);
myPosts = myPosts.filter(item => typeof item === "object" && item.title);

localStorage.setItem(favoritesKey, JSON.stringify(favorites));
localStorage.setItem(viewedKey, JSON.stringify(viewed));
localStorage.setItem(myPostsKey, JSON.stringify(myPosts));

function updateFavoritesCount() {
    if (favoritesCount) {
        favoritesCount.textContent = favorites.length;
    }
}

function showTab(tabName) {
    profileTabs.forEach(tab => tab.classList.remove("active"));
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
    const photos = item.photos && item.photos.length > 0 ? item.photos : [item.image];

    profileModalImage.src = photos[0];
    profileModalTitle.textContent = item.title;
    profileModalLocation.textContent = item.location || "";
    profileModalDetails.textContent = item.details || "";
    profileModalPrice.textContent = item.price || "";

    profileModalDeal.textContent = item.deal || "Купівля";
    profileModalFloor.textContent = item.floor || "не вказано";
    profileModalState.textContent = item.state || "не вказано";
    profileModalDescription.textContent = item.description || "Додаткова інформація про об’єкт буде уточнена продавцем.";

    profileModalThumbs.forEach((thumb, index) => {
        if (photos[index]) {
            thumb.style.display = "block";
            thumb.src = photos[index];

            thumb.onclick = function () {
                profileModalImage.src = this.src;
            };
        } else {
            thumb.style.display = "none";
        }
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
        loadViewed();
        loadMyPosts();
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

function createCardHTML(item, heartClass, detailsClass, heartImage, withDelete = false) {
    return `
        <div class="property-card profile-property-card">
            ${withDelete ? `
    <button class="delete-post-btn"
            data-title="${item.title}">
        ×
    </button>

    <button class="edit-post-btn"
            data-title="${item.title}">
        ✏
    </button>
` : ""}

            <img src="${item.image}" alt="${item.title}">

            <div class="property-info">
                <span class="property-type">${item.type || "Нерухомість"}</span>
                <h3>${item.title}</h3>
                <p class="property-location">${item.location || ""}</p>
                <p class="property-details">${item.details || ""}</p>

                <div class="property-bottom">
                    <span class="price">${item.price || ""}</span>

                    <div class="card-buttons">
                        <img src="${heartImage}"
                             class="card-heart ${heartClass}"
                             data-title="${item.title}">

                        <button class="details-btn ${detailsClass}"
                                data-title="${item.title}">
                            Детальніше
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadFavorites() {
    if (!favoriteList) return;

    if (favorites.length === 0) {
        favoriteList.innerHTML = `<p class="empty-text">Поки що немає обраних оголошень.</p>`;
        return;
    }

    favoriteList.innerHTML = "";

    favorites.forEach(item => {
        favoriteList.innerHTML += createCardHTML(
            item,
            "profile-favorite-heart",
            "profile-details-btn",
            "heart-r.png"
        );
    });

    document.querySelectorAll(".profile-favorite-heart").forEach(heart => {
        heart.addEventListener("click", () => {
            const title = heart.dataset.title;

            favorites = favorites.filter(item => item.title !== title);
            localStorage.setItem(favoritesKey, JSON.stringify(favorites));

            updateFavoritesCount();
            loadFavorites();
            loadViewed();
            loadMyPosts();
        });
    });

    document.querySelectorAll(".profile-details-btn").forEach(button => {
        button.addEventListener("click", () => {
            const title = button.dataset.title;
            const item = favorites.find(item => item.title === title);

            if (item) openProfileModal(item);
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

        viewedList.innerHTML += createCardHTML(
            item,
            "viewed-favorite-heart",
            "viewed-details-btn",
            heartImage
        );
    });

    document.querySelectorAll(".viewed-details-btn").forEach(button => {
        button.addEventListener("click", () => {
            const title = button.dataset.title;
            const item = viewed.find(item => item.title === title);

            if (item) openProfileModal(item);
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
            loadMyPosts();
        });
    });
}

const showMyPostForm = document.getElementById("showMyPostForm");
const myPostForm = document.getElementById("myPostForm");
const myPostsList = document.getElementById("myPostsList");

if (showMyPostForm && myPostForm) {
    showMyPostForm.addEventListener("click", () => {
        myPostForm.style.display =
            myPostForm.style.display === "none" ? "grid" : "none";
    });
}

function readPostPhotos(files, callback) {
    const photos = [];
    const selectedFiles = Array.from(files).slice(0, 4);

    if (selectedFiles.length === 0) {
        callback(["avatar.png"]);
        return;
    }

    let loaded = 0;

    selectedFiles.forEach(file => {
        const reader = new FileReader();

        reader.onload = function () {
            photos.push(reader.result);
            loaded++;

            if (loaded === selectedFiles.length) {
                callback(photos);
            }
        };

        reader.readAsDataURL(file);
    });
}

if (myPostForm) {
    myPostForm.addEventListener("submit", event => {
        event.preventDefault();

        const files = document.getElementById("myPostPhotos").files;

        let existingPhotos = [];

        if (editingPostTitle) {
            const oldPost = myPosts.find(item => item.title === editingPostTitle);

            if (oldPost && oldPost.photos) {
                existingPhotos = oldPost.photos;
            }
        }

        if (files.length === 0 && existingPhotos.length > 0) {
            savePost(existingPhotos);
        } else {
            readPostPhotos(files, photos => {
                savePost(photos);
            });
        }
    });
}

function savePost(photos) {
    const title = document.getElementById("myPostTitle").value.trim();
    const city = document.getElementById("myPostCity").value.trim();
    const district = document.getElementById("myPostDistrict").value.trim();
    const type = document.getElementById("myPostType").value;
    const deal = document.getElementById("myPostDeal").value;
    const rooms = document.getElementById("myPostRooms").value;
    const area = document.getElementById("myPostArea").value;
    const priceValue = document.getElementById("myPostPrice").value;
    const floor = document.getElementById("myPostFloor").value.trim();
    const state = document.getElementById("myPostState").value.trim();
    const phone = document.getElementById("myPostPhone").value.trim();
    const description = document.getElementById("myPostDescription").value.trim();

    if (!title || !city || !type || !deal || !rooms || !area || !priceValue || !phone || !description) {
        alert("Заповніть основні поля оголошення");
        return;
    }

    const post = {
        title: title,
        city: city,
        district: district,
        type: type,
        deal: deal,
        rooms: rooms,
        area: area,
        price: "$" + Number(priceValue).toLocaleString("en-US"),
        floor: floor || "не вказано",
        state: state || "не вказано",
        phone: phone,
        description: description,
        image: photos[0],
        photos: photos,
        location: district ? `${city}, ${district}` : city,
        details: `${rooms} кімнати • ${area} м²`,
        sellerName: currentUser.name,
        sellerRole: "Власник",
        sellerAvatar: currentUser.avatar || "avatar.png"
    };

    if (editingPostTitle) {
        myPosts = myPosts.map(item => {
            if (item.title === editingPostTitle) {
                return post;
            }

            return item;
        });

        editingPostTitle = null;
    } else {
        myPosts.unshift(post);
    }

    localStorage.setItem(myPostsKey, JSON.stringify(myPosts));

    myPostForm.reset();
    myPostForm.style.display = "none";

    loadMyPosts();
}
function loadMyPosts() {
    if (!myPostsList) return;

    if (myPosts.length === 0) {
        myPostsList.innerHTML = `<p class="empty-text">Ви ще не додали жодного оголошення.</p>`;
        return;
    }

    myPostsList.innerHTML = "";

    myPosts.forEach(post => {
        const isFavorite = favorites.some(item => item.title === post.title);
        const heartImage = isFavorite ? "heart-r.png" : "heart-b.png";

        myPostsList.innerHTML += createCardHTML(
            post,
            "my-post-heart",
            "my-post-details",
            heartImage,
            true
        );
    });

    document.querySelectorAll(".my-post-details").forEach(button => {
        button.addEventListener("click", () => {
            const title = button.dataset.title;
            const post = myPosts.find(item => item.title === title);

            if (post) openProfileModal(post);
        });
    });

    document.querySelectorAll(".delete-post-btn").forEach(button => {
        button.addEventListener("click", () => {
            const title = button.dataset.title;

            myPosts = myPosts.filter(post => post.title !== title);
            favorites = favorites.filter(item => item.title !== title);
            viewed = viewed.filter(item => item.title !== title);

            localStorage.setItem(myPostsKey, JSON.stringify(myPosts));
            localStorage.setItem(favoritesKey, JSON.stringify(favorites));
            localStorage.setItem(viewedKey, JSON.stringify(viewed));

            updateFavoritesCount();
            loadFavorites();
            loadViewed();
            loadMyPosts();
        });
    });
    document.querySelectorAll(".edit-post-btn").forEach(button => {

        button.addEventListener("click", () => {

            const title = button.dataset.title;

            const post = myPosts.find(item => item.title === title);

            if (!post) return;

            editingPostTitle = title;

            myPostForm.style.display = "grid";

            document.getElementById("myPostTitle").value = post.title || "";
            document.getElementById("myPostCity").value = post.city || "";
            document.getElementById("myPostDistrict").value = post.district || "";
            document.getElementById("myPostType").value = post.type || "";
            document.getElementById("myPostDeal").value = post.deal || "";
            document.getElementById("myPostRooms").value = post.rooms || "";
            document.getElementById("myPostArea").value = post.area || "";

            document.getElementById("myPostPrice").value =
                post.price.replace("$", "").replace(/,/g, "");

            document.getElementById("myPostFloor").value = post.floor || "";
            document.getElementById("myPostState").value = post.state || "";
            document.getElementById("myPostPhone").value = post.phone || "";
            document.getElementById("myPostDescription").value = post.description || "";

            window.scrollTo({
                top:0,
                behavior:"smooth"
            });

        });

    });
    document.querySelectorAll(".my-post-heart").forEach(heart => {
        heart.addEventListener("click", () => {
            const title = heart.dataset.title;
            const post = myPosts.find(item => item.title === title);
            const exists = favorites.some(item => item.title === title);

            if (exists) {
                favorites = favorites.filter(item => item.title !== title);
                heart.src = "heart-b.png";
            } else if (post) {
                favorites.push(post);
                heart.src = "heart-r.png";
            }

            localStorage.setItem(favoritesKey, JSON.stringify(favorites));
            updateFavoritesCount();
            loadFavorites();
            loadViewed();
            loadMyPosts();
        });
    });
}

updateFavoritesCount();
loadFavorites();
loadViewed();
loadMyPosts();

if (window.location.hash === "#favorites") {
    showTab("favorites");
}

if (window.location.hash === "#viewed") {
    showTab("viewed");
}

if (window.location.hash === "#myAds") {
    showTab("myAds");
}

if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
    });
}