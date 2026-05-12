const authTitle = document.getElementById("authTitle");
const authName = document.getElementById("authName");
const authAvatar = document.getElementById("authAvatar");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authBtn = document.getElementById("authBtn");
const switchAuth = document.getElementById("switchAuth");

let isRegister = false;

switchAuth.addEventListener("click", () => {
    isRegister = !isRegister;

    if (isRegister) {
        authTitle.textContent = "Реєстрація";
        authName.style.display = "block";
        authAvatar.style.display = "block";
        authBtn.textContent = "Зареєструватися";
        switchAuth.innerHTML = 'Вже є акаунт? <span>Увійти</span>';
    } else {
        authTitle.textContent = "Вхід";
        authName.style.display = "none";
        authAvatar.style.display = "none";
        authBtn.textContent = "Увійти";
        switchAuth.innerHTML = 'Немає акаунта? <span>Зареєструватися</span>';
    }
});

function getAvatarBase64(file, callback) {
    if (!file) {
        callback("avatar.png");
        return;
    }

    const reader = new FileReader();

    reader.onload = function() {
        callback(reader.result);
    };

    reader.readAsDataURL(file);
}

authBtn.addEventListener("click", () => {
    const name = authName.value.trim();
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (!email || !password) {
        alert("Заповніть email і пароль");
        return;
    }

    if (isRegister) {
        if (!name) {
            alert("Введіть ім’я");
            return;
        }

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            alert("Користувач з таким email вже існує");
            return;
        }

        getAvatarBase64(authAvatar.files[0], function(avatar) {
            const user = {
                name: name,
                email: email,
                password: password,
                avatar: avatar
            };

            users.push(user);

            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("currentUser", JSON.stringify(user));
            localStorage.setItem("isLoggedIn", "true");

            alert("Реєстрація успішна");
            window.location.href = "index.html";
        });

    } else {
        const user = users.find(user => user.email === email);

        if (!user) {
            alert("Користувача з таким email не знайдено");
            return;
        }

        if (user.password !== password) {
            alert("Неправильний пароль");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");

        alert("Вхід успішний");
        window.location.href = "index.html";
    }
});