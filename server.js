/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/ 
const cookieParser = require("cookie-parser")
const session = require("express-session")
const pool = require('./database/')
const express = require("express")
const utilities = require("./utilities/") 
const bodyParser = require("body-parser")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static");
const baseController = require("./controllers/baseController"); 
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const path = require('path');
const cartRoutes = require("./routes/cartRoutes");


/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))
/* Cookie Parser*/
app.use(cookieParser())
/*tokenware*/
app.use(utilities.checkJWTToken)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 


// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
app.use((req, res, next) => {
  res.locals.messages = req.flash('info'); // or any other key you want to use
  next();
});




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
app.get("/", utilities.handleErrors(baseController.buildHome))
//Inventory Routes
app.use("/inv", inventoryRoute)
//account Routes
app.use("/account", accountRoute);
// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/cart', cartRoutes);




/*****FILE NOT FOUND ROUTE******** */
/*Should always be placed after all routes... the last item in the route */
app.use(async (req, res, next) => {
  next({status: 404, message: "Looks like this page is under maintenance."});
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
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

