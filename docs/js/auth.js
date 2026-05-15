const authTitle = document.getElementById("authTitle");
const authName = document.getElementById("authName");
const authAvatar = document.getElementById("authAvatar");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const togglePassword = document.getElementById("togglePassword");
const authBtn = document.getElementById("authBtn");
const switchAuth = document.getElementById("switchAuth");
const toast = document.getElementById("toast");
let isRegister = false;
function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);

}
togglePassword.addEventListener("click", () => {

    if (authPassword.type === "password") {
        authPassword.type = "text";
        togglePassword.textContent = "Сховати";
    } else {
        authPassword.type = "password";
        togglePassword.textContent = "Показати";
    }

});
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
    let name = authName.value.trim();

    if (name.length > 0) {
        name =
            name.charAt(0).toUpperCase() +
            name.slice(1).toLowerCase();
    }

    const email = authEmail.value.trim().toLowerCase();
    const password = authPassword.value.trim();

    if (!email || !password) {
        showToast("Заповніть email і пароль");
        return;
    }

    const allowedDomains = [
        "gmail.com",
        "icloud.com",
        "ukr.net",
        "outlook.com"
    ];

    const emailParts = email.split("@");

    if (
        emailParts.length !== 2 ||
        !allowedDomains.includes(emailParts[1].toLowerCase())
    ) {
        showToast("Введіть коректний email. Дозволені домени: gmail@com, icloud@com, ukr@net, outlook@com");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (!email || !password) {
        showToast("Заповніть email і пароль");
        return;
    }

    if (isRegister) {
        if (!name) {
            showToast("Введіть ім’я");
            return;
        }

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            showToast("Користувач з таким email вже існує");
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

            showToast("Реєстрація успішна");
            window.location.href = "index.html";
        });

    } else {
        const user = users.find(user => user.email === email);

        if (!user) {
            showToast("Користувача з таким email не знайдено");
            return;
        }

        if (user.password !== password) {
            showToast("Неправильний пароль");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");

        showToast("Вхід успішний");
        window.location.href = "index.html";
    }
});