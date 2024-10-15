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
 *  Build inventory Detail view
 * ************************** */
invCont.getVehicleDetails = async function (req, res, next) {
  try {
  const inventory_id = req.params.inventoryId
  const vehicleData = await inventoryModel.getVehicleById(req.params.inventory_id)  
  const htmlContent = wrapVehicleDataInHTML(vehicleData);  
  res.send(htmlContent);  
  } catch (error) {  
  res.status(500).send('Error retrieving vehicle details');  
  }  
  };  



module.exports = invCont