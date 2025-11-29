// DOM Elements
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const toggleLinks = document.querySelectorAll(".toggle-link");
const loginFormDiv = document.querySelector(".login-form");
const signupFormDiv = document.querySelector(".signup-form");

// Toggle between login and signup forms
toggleLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetForm = link.dataset.form;

    if (targetForm === "signup") {
      loginFormDiv.classList.remove("active");
      signupFormDiv.classList.add("active");
      clearErrors();
    } else {
      signupFormDiv.classList.remove("active");
      loginFormDiv.classList.add("active");
      clearErrors();
    }
  });
});

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Clear all error messages
function clearErrors() {
  document.querySelectorAll(".error-message").forEach(el => {
    el.textContent = "";
  });
}

// Show error for a specific field
function showError(fieldId, message) {
  const errorEl = document.getElementById(fieldId);
  if (errorEl) {
    errorEl.textContent = message;
  }
}

// Get all users from localStorage
function getAllUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Login form submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  let hasError = false;

  // Validation
  if (!email) {
    showError("loginEmailError", "Email is required");
    hasError = true;
  } else if (!isValidEmail(email)) {
    showError("loginEmailError", "Invalid email format");
    hasError = true;
  }

  if (!password) {
    showError("loginPasswordError", "Password is required");
    hasError = true;
  }

  if (hasError) return;

  // Check credentials
  const users = getAllUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Store current user session
    localStorage.setItem("currentUser", JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email
    }));
    // Redirect to chat
    window.location.href = "index.html";
  } else {
    showError("loginError", "Invalid email or password");
  }
});

// Signup form submission
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;

  let hasError = false;

  // Validation
  if (!name) {
    showError("signupNameError", "Full name is required");
    hasError = true;
  } else if (name.length < 3) {
    showError("signupNameError", "Name must be at least 3 characters");
    hasError = true;
  }

  if (!email) {
    showError("signupEmailError", "Email is required");
    hasError = true;
  } else if (!isValidEmail(email)) {
    showError("signupEmailError", "Invalid email format");
    hasError = true;
  }

  if (!password) {
    showError("signupPasswordError", "Password is required");
    hasError = true;
  } else if (password.length < 6) {
    showError("signupPasswordError", "Password must be at least 6 characters");
    hasError = true;
  }

  if (!confirmPassword) {
    showError("signupConfirmPasswordError", "Please confirm your password");
    hasError = true;
  } else if (password !== confirmPassword) {
    showError("signupConfirmPasswordError", "Passwords do not match");
    hasError = true;
  }

  if (hasError) return;

  // Check if email already exists
  const users = getAllUsers();
  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    showError("signupError", "Email already registered");
    return;
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  // Store current user session
  localStorage.setItem("currentUser", JSON.stringify({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email
  }));

  // Redirect to chat
  window.location.href = "index.html";
});
