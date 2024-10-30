//Required Resources
const bcrypt = require("bcryptjs") //Password hasher
const accountModel = require("../models/account-model");
const utilities = require("../utilities");
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* *****************************************  Deliver login view* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}
/*  Deliver Registration view* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}
/* *****************************************  Process Registration* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("info", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword

  );
  if (regResult) {
    req.flash(
      "info",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("info", "Sorry, the registration failed.");
    res.status(501).render("account/login", {
      title: "Login",
      nav,
    });
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  console.log('here')
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("info", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("info", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


// Function to deliver the account management view
async function buildAccountManagementView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/accountManagementView", {
    title: "Account Management",
    nav,
    error: null,
  });
  req.session.error = null;
}




// Function to handle account updates
async function updateAccount(req, res) {
  const { account_id, account_email, account_password } = req.body;

  try {
      // Validate input data
      if (!account_id || !account_email) {
          return res.status(400).json({ message: 'User ID, username, and email are required.' });
      }

      // Find the user by ID
      const user = await accountModel.findById(account_id);
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      // Update user details
      user.email = email;

      // Save the updated user
      await user.save();

      // Respond with the updated user data
      res.status(200).json({ message: 'Account updated successfully.', user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating the account.' });
  }
}



// Function to handle password change
async function changePassword(req, res) {
  const { newPassword, account_id } = req.body;

  // Validate the new password (you can add more validation as needed)
  if (!newPassword || newPassword.length < 12) {
      // Set an error message if validation fails
      req.flash('info', 'Password must be at least 12 characters long.');
      return res.redirect('/update-account'); // Redirect back to the update view
  }

  try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password in the database
      const result = await registerAccount.updatePassword(account_id, hashedPassword);

      if (result) {
          // Set a success message if the update is successful
          req.flash('info', 'Password updated successfully.');
      } else {
          // Set a failure message if the update fails
          req.flash('info', 'Failed to update password. Please try again.');
      }
  } catch (error) {
      // Handle any unexpected errors
      req.flash('info', 'An error occurred while updating the password.');
  }

  // Redirect to the account management view
  res.redirect("/buildAccountManagementView");
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagementView, changePassword, updateAccount};
