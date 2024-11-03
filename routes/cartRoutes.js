//Needed resources
// routes/cartRoutes.js
const express = require('express');
const cartController = require('../controllers/cartController');
const router = new express.Router()
const utilities = require("../utilities");


//The route to handle add to cart
router.post('/cart-view',
    
    utilities.handleErrors(cartController.addToCart)
  );
  

//The route to get the view
router.get('/cart-view', cartController.addToCart);

//The route to get viewcart view
router.get('/cart-view', cartController.viewCart);

//The route to get the remove view
router.get('/cart-view', cartController.removeFromCart);




module.exports = router