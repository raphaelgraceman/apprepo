/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/ 
const express = require("express")
const utilities = require('./utilities'); 
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static");
const baseController = require("./controllers/baseController"); 
const inventoryRoute = require("./routes/inventoryRoute");

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
//**Static route**/
app.use(static)
//index route
app.get("/", baseController.buildHome)
//Inventory Routes
app.use("/inv", inventoryRoute)


/*****FILE NOT FOUND ROUTE******** */
/*Should always be placed after all routes... the last item in the route */
app.use(async (req, res, next) => {
  next({status: 404, message: "Looks like this page in unavailable."});
})
/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
