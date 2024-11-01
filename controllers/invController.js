const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id) //Calling this function from inventory model
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

//Function to build the Inventory Management view
invCont.inventoryManagementView = async function (req, res) {
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList() //calling the function to create a select lsit to be displayed in the inventory management view
  res.render("./inventory/inventoryManagementView", { title: "Inventory Management", nav, classificationSelect })
}
//add classification view
invCont.newClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}


//Function  to handle the classification Insertion
invCont.addClassificationName = async (req, res) => {
  const { classification_name } = req.body;

  try {
      // Calling the model function to add classification
      const insertResult = await invModel.addClassification(classification_name);

      // Checking if the insertion was successful
      if (insertResult) {
          req.flash("info", "Classification added successfully.");
          res.redirect("/inv/"); // And Redirect to the inventory management page
      } else {
          req.flash("info", "Failed to add classification.");
          res.status(501).render("inventory/add-classification", { title: "Add Classification", errors: null });
      }
  } catch (error) {
      console.error("Error adding classification:", error);
      req.flash("info", "An error occurred while adding the classification.");
      res.status(500).render("inventory/add-classification", { title: "Add Classification", errors: null});
  }
};





//add new vehicle view Route
invCont.newVehicleView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationSelect: classificationSelect,
    errors: null,
  })
}

// Function to handle add new vehicle or insertion
invCont.addNewVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
  } = req.body;

  try {
      // Call the model function to add inventory
      const insertResult = await invModel.addInventory(
          inv_make,
          inv_model,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_year,
          inv_miles,
          inv_color,
          classification_id
      );
      const success = true;
      // Check if the insertion was successful
      if (success) {
          req.flash("info", "Inventory item added successfully.");
          res.redirect("/inv/"); // Redirect to the inventory management page
      } else {
          req.flash("info", "Failed to add inventory item.");
          res.status(501).render("add-inventory", { title: "Add Inventory", nav, errors: null });
      }
  } catch (error) {
      console.error("Error adding inventory:", error);
      req.flash("info", "An error occurred while adding the inventory item.");
      res.status(500).render("inventory/add-inventory", { title: "Add Inventory", nav, errors: null });
  }
};



/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getByVehicleId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
};


/* ************* Update inventory Data ************* */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("info", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("info", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}




/* ***************************
 *  Delete Confirmation view
 * ************************** */
invCont.confirmDeleteInventoryView = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getByVehicleId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
};
/**Delete process handler function */
invCont.deleteInventoryItem = async (req, res) => {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id);

  const result = await invModel.confirmDeleteInventory(inv_id);

  if (result) {
    req.flash('info', 'Item deleted successfully.');
    res.redirect('/inv/');
  } else {
    req.flash('info', 'Failed to delete item.');
    res.redirect('/inv/delete-inventory/inv_id');
  }
};

module.exports = invCont