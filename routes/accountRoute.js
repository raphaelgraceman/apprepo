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

//Route to get the update view
router.get('/update-account', (req, res) => {
  utilities.handleErrors(accountController.updateAccount)
});
// Route to update-account
router.post('/update-account', (req, res) => {
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.updateAccount)
});

router.post(
  "/change-password", (req, res) => {
  const newPassword = req.body.account_id;
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.updateAccount)
});


// Error handler middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke! Cannot access account now");
});

//router.get('/logout', (req, res) => {
  //res.clearCookie('token'); // Clear the JWT token cookie
  //res.redirect('/'); // Redirect to the home view
//});

router.get('/logout', (req, res) => {
  // Clear the user session or token
  req.session.destroy(err => {
      if (err) {
          return res.redirect('/'); // Redirect to home on error
      }
      res.render('logout'); // Render the logout view
  });
  utilities.handleErrors(accountController.logoutView)
});
module.exports = router;
