const authBtn = document.getElementById("authBtn");
const authForm = document.querySelector(".auth-form");
const closeAuth = document.querySelector(".close-auth");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

authBtn.addEventListener("click", () => {
  authForm.style.display = "block";
});

closeAuth.addEventListener("click", () => {
  authForm.style.display = "none";
});

showSignup.addEventListener("click", () => {
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});

showLogin.addEventListener("click", () => {
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
});

document.querySelector(".search-toggle").addEventListener("click", () => {
  const searchBar = document.querySelector(".search-bar");
  searchBar.style.display = searchBar.style.display === "flex" ? "none" : "flex";
});
