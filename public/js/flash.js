// Check if the flash message exists
const flashMessage = document.getElementById("flash-message");
if (flashMessage) {
  // Set a timeout to hide the message after 30 seconds (30000 milliseconds)
  setTimeout(() => {
    flashMessage.style.display = "none";
  }, 3000);
}

const togglePasswordButton = document.getElementById("togglePassword");
const passwordInput = document.getElementById("accountPassword");

togglePasswordButton.addEventListener("click", function () {
  // Toggle the type attribute
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  // Toggle the button text
  this.textContent = type === "password" ? "Show" : "Hide";
});


