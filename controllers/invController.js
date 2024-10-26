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
invCont.inventoryManagementView = async function(req, res){
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList() //calling the function to create a select lsit to be displayed in the inventory management view
  res.render("./inventory/inventoryManagementView", {title: "Inventory Management", nav}, classificationSelect)   
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

// Building the inventory edit view
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  
  res.render("./inventory/editInventoryView", {
      title: "Edit Inventory" + itemName,
      nav,
      classificationSelect,
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
  });
};


/* ***************************
 *  Update Inventory Data view
 * ************************** */
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
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
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
invCont.confirmDeleteInventory = async function (req, res, next) {
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
  const deleteResult = await invModel.confirmDeleteInventory(
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

  if (deleteResult) {
    const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
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


// Function to handle the delete process
invCont.deleteInventoryItem = async (req, res) => {
  const inv_id = parseInt(req.body.inv_id);
  const result = await inventoryModel.deleteInventoryItem(inv_id);
  
  if (result) {
      req.flash('success', 'Item deleted successfully.');
      res.redirect('/inventory');
  } else {
      req.flash('error', 'Failed to delete item.');
      res.redirect(`/inventory/delete/${inv_id}`);
  }
};

module.exports = {addClassification, addInventory };

module.exports = invCont