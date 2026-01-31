const API_URL = "http://127.0.0.1:8000";

async function api(endpoint, method = "GET", body = null, requireAuth = false) {
    const headers = {
        "Content-Type": "application/json"
    };

    if (requireAuth) {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "login.html";
            return;
        }
        headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Operation failed");
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error; // Re-throw to be handled by caller
    }
}

function isLoggedIn() {
    return !!localStorage.getItem("token");
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

function checkAuthProtection() {
    if (!isLoggedIn()) {
        window.location.href = "login.html";
    }
}

// Display error in a specific element if it exists
function showError(message, elementId = "error-msg") {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.style.display = "block";
    } else {
        alert(message);
    }
}
