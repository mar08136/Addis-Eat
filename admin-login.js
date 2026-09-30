const loginForm = document.querySelector("#admin-login-form");
const usernameInput = document.querySelector("#admin-username");
const passwordInput = document.querySelector("#admin-password");
const loginError = document.querySelector("#admin-login-error");

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

if (sessionStorage.getItem("addisEatsAdminLoggedIn") === "true") {
    window.location.href = "admin-dashboard.html";
}

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (loginError) {
            loginError.classList.remove("show");
            loginError.textContent = "";
        }

        if (!username || !password) {
            showLoginError("Please enter your username and password.");
            return;
        }

        if (
            username !== ADMIN_USERNAME ||
            password !== ADMIN_PASSWORD
        ) {
            showLoginError("Incorrect username or password.");
            return;
        }

        sessionStorage.setItem(
            "addisEatsAdminLoggedIn",
            "true"
        );

        window.location.href = "admin-dashboard.html";
    });
}

function showLoginError(message) {
    if (!loginError) {
        return;
    }

    loginError.textContent = message;
    loginError.classList.add("show");
}