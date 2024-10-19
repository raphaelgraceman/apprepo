const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null
  })
}


/* ***************************
 *  Creating a function to handle the request
    and retrieve the vehicle data
 * ************************** */
invCont.buildByVehicleId = async (req, res) => {
  const vehicle_id = req.params.id;
  const vehicleInfo = await invModel.getByVehicleId(vehicle_id);
  const vehicleHtml = utilities.buildVehicleDetailsGrid(vehicleInfo);
  let nav = await utilities.getNav()
  res.render("./inventory/vehicleDetails", {
      title: " vehicles",
      nav,
      vehicleHtml,
      errors: null
    })

}


//Function  to handle the classification Insertion
async function addClassification(req, res) {
    const { classification_name } = req.body;

    try {
        await inventoryModel.insertClassification(classification_name);
        req.flash('success', 'Classification added successfully!');
        res.redirect('/inv/'); // Redirect to the management view
    } catch (error) {
        req.flash('error', 'Failed to add classification. Please try again.');
        res.redirect('/inv/add-classification'); // Redirect back to the form
    }
}

//implementing function to hnadle the inventory insertion
async function addInventory(req, res) {
  const { inv_make, inv_model, classification_id, inv_image } = req.body;

  try {
      await inventoryModel.insertInventory({ inv_make, inv_model, classification_id, inv_image });
      req.flash('success', 'Inventory item added successfully!');
      res.redirect('/inv/'); // Redirect to the management view
  } catch (error) {
      req.flash('error', 'Failed to add inventory item. Please try again.');
      res.redirect('/inv/add-inventory'); // Redirect back to the form
  }
}

module.exports = { addClassification, addInventory };

module.exports = invCont