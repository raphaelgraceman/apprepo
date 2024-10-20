// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require('../utilities');
const invController = require("../controllers/invController")
const validateClassification  = require("../utilities/inventory-validate")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


// Route to build vehicle details  
router.get("/detail/:id", invController.buildByVehicleId);

// Route for the management view
router.get("/", (invController.inventoryManagementView));



// Route to get the add-classification view
router.get('/inv/add-classification', (req, res) => {
    res.render('inventory/add-classication'); 
});

//Route to post add classification view
router.post('/inv/add-classification', async (req, res) => {
    const classificationName = req.body.classificationName;

    // Server-side validation
    if (!classificationName || classificationName.includes(' ') || /[!@#$%^&*()_+={}$$:;"'<>,.?/\\|]/.test(classificationName)) {
        req.flash('error', 'Classification name cannot contain spaces or special characters.');
        return res.render('inventory/add-classification', { classificationName });
    }

    try {
        // Insert into the database
        await classificationModel.addClassification(classificationName);
        req.flash('success', 'Classification added successfully!');
        res.redirect('/inv'); // Redirect to the management view
    } catch (error) {
        req.flash('error', 'Failed to add classification. Please try again.');
        res.render('inventory/add-classification', { classificationName });
    }
});


// Route to get the add inventory view
router.get('/inv/add-inventory', (req, res) => {
    res.render('inventory/add-inventory'); 
});


//Routed to post the add inventory view
router.post('/inv/add-inventory', async (req, res) => {
    const { invMake, invModel, classification_id } = req.body;

    // Server-side validation
    if (!invMake || !invModel || !classification_id) {
        req.flash('error', 'All fields are required.');
        return res.render('inventory/add-inventory', { invMake, invModel, classification_id });
    }

    try {
        // Insert into the database (assuming you have a model function for this)
        await inventoryModel.addInventory({ invMake, invModel, classification_id });
        req.flash('success', 'Inventory item added successfully!');
        res.redirect('/inv'); // Redirect to the management view
    } catch (error) {
        req.flash('error', 'Failed to add inventory item. Please try again.');
        res.render('inventory/add-inventory', { invMake, invModel, classification_id });
    }
});

module.exports = router;