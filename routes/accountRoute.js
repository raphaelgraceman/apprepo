// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');


// Building the path to get Route to the account login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to handle registration
router.post('/register', utilities.handleErrors(accountController.registerAccount));


// Error handler middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke! Cannot access account now');
});

module.exports = router;

