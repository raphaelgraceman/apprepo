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
async function getVehicleById(id)  {  
  const query = 'SELECT * FROM vehicles WHERE inv_id = ?';  
  const results = await pool.query(query, [id]);  
  return results[0]; // Return the vehicle data  
};  




module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById};