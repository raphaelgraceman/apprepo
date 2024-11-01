const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  req.flash("info", "Raphael's Adventure Flash!")
  res.render("index", {title: "Welcome to CSE Motors!", nav})   
} 

module.exports = baseController
