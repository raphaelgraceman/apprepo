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
invCont.getVehicleDetails = async (req, res) => {
  const vehicle_id = req.params.id;

  try {
      const vehicleInfo = await invModel.getVehicleById(vehicle_id);
      if (!vehicleInfo) {
          return res.status(404).send("The vehicle seemed not found!");
      }

      const vehicleHtml = utilities.wrapVehicleInfo(vehicleInfo);
      let nav = await utilities.getNav()
      res.render("./inventory/vehicleDetails", {
      title: " vehicles",
      nav,
      vehicleHtml,
      errors: null
    })
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
};




module.exports = invCont