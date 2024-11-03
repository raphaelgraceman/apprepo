const cartModel = require("../models/cartModel")
const utilities = require("../utilities")

const cartCont = {}

cartCont.addToCart = async (req, res) => {
    const { inv_id, quantity } = req.body;
    const account_id = req.session.account_id;

    // Validate input
    if (!inv_id || !quantity || quantity <= 0) {
        return res.status(400).json({ error: "Invalid input: Item ID and quantity must be provided and quantity must be greater than zero." });
    }

    try {
        // Attempt to add the item to the cart
        const result = await cartModel.addItem(account_id, inv_id, quantity);
        
        // Check if the item was successfully added
        if (result) {
            return res.status(200).json("info", "Item added to cart" );
        } else {
            return res.status(404).json("info", "Item not found or could not be added to cart" );
        }
    } catch (error) {
        console.error("Error adding item to cart:", error); // Log the error for debugging
        return res.status(500).json({ error: "Failed to add item to cart" });
    }
};


cartCont.removeFromCart = async (req, res) => {
    let nav = await utilities.getNav()
  const { inv_id } = req.params;

  try {
    await cartModel.removeItem(inv_id);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json( "info", "Failed to remove item from cart");
  }
}

cartCont.viewCart = async (req, res) =>{
    let nav = await utilities.getNav()
  const userId = req.session.account_id;

  try {
    const items = await cartModel.getCartItems(userId);
    res.render("cart", { items }); // Assuming you have a view engine set up
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve cart items" });
  }
}
module.exports = cartCont