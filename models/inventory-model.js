const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


/* ***************************
 *  Creating a function to retrieve vehicle data based on its ID
 * ************************** */
async function getByVehicleId(id)  {  
  try {
    const vehicleInfo = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.inv_id = $1",
      [id]
    )
    return vehicleInfo.rows[0]
  } catch (error) {
    console.error(error)
  } // Return the vehicle data  
};  



//Function to insert the classification item
async function addClassification(classification_name) {
    const query = 'INSERT INTO classifications (classification_name) VALUES ($1) RETURNING *';
    const values = [classification_name];
    const result = await pool.query(query, values);
    return result.rows[0]; // Return the newly created classification
}

//Function to insert inventory item into the database
async function addInventory({ inv_make, inv_model, classification_id, inv_image }) {
  const query = 'INSERT INTO inventory (inv_make, inv_model, classification_id, inv_image) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [inv_make, inv_model, classification_id, inv_image];
  const result = await db.query(query, values);
  return result.rows[0]; // Return the newly created inventory item
}


module.exports = {getClassifications, getInventoryByClassificationId, getByVehicleId, addClassification, addInventory};