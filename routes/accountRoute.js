// Needed Resources
const regValidate = require("../utilities/account-validation");
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// Building the path to get Route to the account login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// New default route for account management
router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView));

// Building the Route to deliver the account login view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);


// Route to update-account
app.post('/update-account', (req, res) => {
  const { firstName, lastName, email, account_id } = req.body;
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.update-account)
});

app.post(
  "/change-password", (req, res) => {
  const newPassword = req.body.account_id;
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.update-account)
});


// Error handler middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke! Cannot access account now");
});

app.get('/logout', (req, res) => {
  res.clearCookie('token'); // Clear the JWT token cookie
  res.redirect('/'); // Redirect to the home view
});

module.exports = router;
