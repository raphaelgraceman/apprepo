// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require('../utilities');
const invController = require("../controllers/invController")
const validateClassification = require("../utilities/inventory-validate")
const { validateInventory, checkUpdateData } = require('../utilities/inventory-validate');


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


// Route to build vehicle details  
router.get("/detail/:id", invController.buildByVehicleId);

// Route for the management view
router.get("/", (invController.inventoryManagementView));

// Build addClassification View Route
router.get(
    "/add-classification",
    utilities.handleErrors(invController.newClassificationView)
)

//Route to get the iventory slection in the inventiry management view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Route to post add classification view
router.post('/inv/add-classification', utilities.handleErrors(invController.addClassification));

// Build addClassification View Route
router.get(
    "/add-inventory",
    utilities.handleErrors(invController.newVehicleView)
)

//Routed to post the add inventory view
router.post('/inv/add-inventory', utilities.handleErrors(invController.addInventory));

// Routes to edit inventory items
router.get('/inv/edit/:inv_id', invController.editInventoryView);

//Route to update inventory
router.post("/update/", validateInventory, checkUpdateData, invController.updateInventory);

//Route to get the inventory delete view
router.get("/delete/:inv_id", utilities.handleErrors(invController.confirmDeleteInventory));

// POST route to handle the delete process
router.post('/delete', invController.deleteInventoryItem);

module.exports = router;