const pool = require("../database/");

async function addItem(account_id, inv_id, quantity) {
  const query =
    "INSERT INTO cart_items (account_id, inv_id, quantity) VALUES (?, ?, ?)";
  const [result] = await pool.execute(query, [account_id, inv_id, quantity]);
  return result;
}

async function removeItem(inv_id) {
  const query = "DELETE FROM cart_items WHERE id = ?";
  const [result] = await db.execute(query, [inv_id]);
  return result;
}

async function getCartItems(account_id) {
  const query = "SELECT * FROM cart_items WHERE account_id = ?";
  const [rows] = await pool.execute(query, [account_id]);
  return rows;
}

module.exports = {addItem, removeItem, getCartItems}
