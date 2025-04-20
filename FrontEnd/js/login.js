//login page integration
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      console.log("hello");
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      authenticateUser(email, password);
    });
  }
});
// AUTHENTICATE USER
async function authenticateUser(email, password) {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("authToken", data.token);
      window.location.href = "index.html"; // Redirect to homepage
    } else {
      alert("Invalid username or password");
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
}
//click logo redirect to home page
document.getElementById("logo").addEventListener("click", function () {
  window.location.href = "index.html"; // Replace with your homepage URL
});
