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

    reader.onload = function(event) {

        const img = new Image();

        img.onload = function() {

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const maxWidth = 300;
            const scaleSize = maxWidth / img.width;

            canvas.width = maxWidth;
            canvas.height = img.height * scaleSize;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

            callback(compressedBase64);
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}

authBtn.addEventListener("click", async () => {
    let name = authName.value.trim();

    if (name.length > 0) {
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
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
        showToast("Введіть коректний email. Дозволені домени: gmail.com, icloud.com, ukr.net, outlook.com");
        return;
    }

    if (isRegister) {
        if (!name) {
            showToast("Введіть ім’я");
            return;
        }

        getAvatarBase64(authAvatar.files[0], async function (avatar) {
            try {
                const response = await fetch("http://localhost:5000/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                        avatar: avatar
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    showToast(data.message);
                    return;
                }

                
                localStorage.setItem("currentUser", JSON.stringify(data.user));
                localStorage.setItem("isLoggedIn", "true");

                window.location.href = "./index.html";

                } catch (error) {
                    console.log(error);
                }
        });

    } else {
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                showToast(data.message);
                return;
            }

            
            localStorage.setItem("currentUser", JSON.stringify(data.user));
            localStorage.setItem("isLoggedIn", "true");

            window.location.href = "./index.html";

            } catch (error) {
                console.log(error);
            }
    }
});