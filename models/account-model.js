const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}


/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}
/*A function to retrieve account information by ID  for update / changepassword */
async function getAccountById(account_id) {
  const query = 'SELECT * FROM accounts WHERE id = $1';
  const result = await pool.query(query, [account_id]);
  return result.rows[0]; // Return the account information
}

/* A funtion to update the account information retrive */
async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email) {
  const query = `
      UPDATE accounts 
      SET account_firstname = $1, account_lastname = $2, account_email = $3 
      WHERE id = $4
  `;
  const result = await pool.query(query, [account_firstname, account_lastname, account_email, account_id]);
  return result.rowCount > 0; // Return true if the update was successful
}

/* A function to update account password */
async function updatePassword(account_id, hashedPassword) {
  const query = 'UPDATE accounts SET password = $1 WHERE id = $2';
  const result = await db.query(query, [hashedPassword, account_id]);
  
  // Check if the password was updated successfully
  if (result.rowCount > 0) {
      const updatedAccount = await getAccountById(account_id);
      return updatedAccount.password === hashedPassword; // Ensure the password is hashed
  }
  return false; // Return false if the update failed
}
module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, updateAccountInfo, updatePassword };















