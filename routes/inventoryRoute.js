// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require('../utilities');
const invController = require("../controllers/invController")
const validateAddClassifications = require("../utilities/inventory-validate")
const { validateInventory, checkUpdateData } = require('../utilities/inventory-validate');


// Route to build inventory by classification view
router.get("/type/:classificationId",  utilities.handleErrors(invController.buildByClassificationId));


// Route to build vehicle details  
router.get("/detail/:id",  utilities.handleErrors(invController.buildByVehicleId));

// Route for the management view
router.get("/",  utilities.handleErrors(invController.inventoryManagementView));



router.get(
    "/add-classification",
    utilities.handleErrors(invController.newClassificationView)
)
//The classification Insertion Route
router.post(
    '/add-classification', 
    utilities.handleErrors(invController.addClassificationName)
);

  
//Route to get the iventory slection in the inventiry management view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


// The add vehicle view route
router.get(
    "/add-inventory",
    utilities.handleErrors(invController.newVehicleView) //NewVehicleView is the view for adding inventory
)

//The Insert vehicle route
router.post(
    '/add-inventory', 
    utilities.handleErrors(invController.addNewVehicle));

// Routes to edit inventory items
router.get(
    '/edit-inventory/:inv_id', 
    utilities.handleErrors(invController.editInventoryView));

//The route to post the edit inventory view
router.post("/edit-inventory/", validateInventory, checkUpdateData, invController.updateInventory);

//Route to get the inventory delete view
router.get("/delete-inventory/:inv_id", utilities.handleErrors(invController.confirmDeleteInventoryView));

// POST route to handle the delete process
router.post('/delete-inventory/', invController.deleteInventoryItem);

module.exports = router;