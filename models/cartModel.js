const pool = require("../database/");

async function addItem(account_id, inv_id, quantity) {
  const sql = `
  INSERT INTO cart (account_id, inv_id, quantity) VALUES (?, ?, ?)`;

  try {
    const result = await pool.query(sql, [account_id, inv_id, quantity]);
    return result.rows[0]; // Return the inserted row
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

async function removeItem(inv_id) {
  const query = "DELETE FROM cart WHERE id = ?";
  const [result] = await pool.execute(query, [inv_id]);
  return result;
}

async function getCartItems(account_id) {
  const query = "SELECT * FROM cart WHERE account_id = ?";
  const [rows] = await pool.execute(query, [account_id]);
  return rows;
}

module.exports = { addItem, removeItem, getCartItems };
