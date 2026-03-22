// ======= AUTH MODULE =======

// Backend Base URL
const API_BASE = "http://localhost:4000/api/auth";

// Save token
function saveToken(token) {
    localStorage.setItem("token", token);
}

// Save user data including profile picture
function saveUserData(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

// Get user data
function getUserData() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

// Get token
function getToken() {
    return localStorage.getItem("token");
}

// Logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully");
    window.location.reload();
}



// ============ USER SIGNUP ============

async function signupUser() {
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    if (!username || !email || !password) {
        alert("All fields are required!");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (!data.success) {
            alert(data.message);
            return;
        }

        saveToken(data.token);
        saveUserData(data.user);
        alert("Signup successful!");
        window.location.reload();

    } catch (err) {
        alert("Signup failed: " + err.message);
    }
}



// ============ USER LOGIN ============

async function loginUser() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        alert("Email and password required");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!data.success) {
            alert(data.message);
            return;
        }

        saveToken(data.token);
        saveUserData(data.user);
        alert("Login successful!");
        window.location.reload();

    } catch (err) {
        alert("Login failed: " + err.message);
    }
}



// ============ CHECK LOGIN STATUS ============

function isLoggedIn() {
    return getToken() !== null;
}
