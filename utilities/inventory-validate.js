const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");




//implementing validation logic for inventory item
function validateInventory(req, res, next) {
    const { inv_make, inv_model, classification_id } = req.body;

    // Basic validation checks
    if (!inv_make || !inv_model || !classification_id) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/inv/add-inventory'); // Redirect back to the form
    }
    next(); // Proceed to the controller if validation passes
}


//implementing validation to direct errors to the edit view
function checkUpdateData(req, res, next) {
    const { inv_id, inv_make, inv_model, classification_id } = req.body;

    // Basic validation checks
    if (!inv_id || !inv_make || !inv_model || !classification_id) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/inv/edit-inventory'); // Redirect back to the form
    }

    next(); // Proceed to the controller if validation passes
}



module.exports = { validateInventory, checkUpdateData };