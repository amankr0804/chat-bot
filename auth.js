// DOM Elements
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const toggleLinks = document.querySelectorAll(".toggle-link");
const loginFormDiv = document.querySelector(".login-form");
const signupFormDiv = document.querySelector(".signup-form");

// Wait for Firebase to be ready
let db, auth;
setTimeout(() => {
  db = window.firebaseDB;
  auth = window.firebaseAuth;
}, 1000);

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

  // Use Firebase Authentication
  if (!auth) {
    showError("loginError", "Firebase not initialized. Check your config.");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Store user session locally
      localStorage.setItem("currentUser", JSON.stringify({
        id: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || "User"
      }));
      // Redirect to chat
      window.location.href = "index.html";
    })
    .catch((error) => {
      if (error.code === "auth/user-not-found") {
        showError("loginError", "No account found with this email");
      } else if (error.code === "auth/wrong-password") {
        showError("loginError", "Incorrect password");
      } else {
        showError("loginError", error.message);
      }
    });
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

  // Use Firebase Authentication
  if (!auth) {
    showError("signupError", "Firebase not initialized. Check your config.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Update user profile with name
      return userCredential.user.updateProfile({
        displayName: name
      }).then(() => {
        // Save user data to Realtime Database
        if (db) {
          db.ref(`users/${userCredential.user.uid}`).set({
            name: name,
            email: email,
            createdAt: new Date().toISOString()
          });
        }

        // Store user session locally
        localStorage.setItem("currentUser", JSON.stringify({
          id: userCredential.user.uid,
          email: email,
          name: name
        }));

        // Redirect to chat
        window.location.href = "index.html";
      });
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        showError("signupError", "Email already registered");
      } else if (error.code === "auth/weak-password") {
        showError("signupPasswordError", "Password is too weak");
      } else {
        showError("signupError", error.message);
      }
    });
});
});
