//implementing validation logic for classification item
function validateClassification(req, res, next) {
    const { classification_name } = req.body;

    // Check for spaces or special characters
    const regex = /^[a-zA-Z0-9]+$/; 
    if (!classification_name || !regex.test(classification_name)) {
        req.flash('error', 'Classification name cannot contain spaces or special characters.');
        return res.redirect('/inv/add-classification'); // Redirect back to the form
    }

    next(); // Proceed to the controller if validation passes
}

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

module.exports = { validateClassification, validateInventory };