const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const bodyParser = require('body-parser');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// models
const User = require('./models/user.js');


// exporting router
const listingsRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

// Middleware to parse URL-encoded bodies (form data)
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(bodyParser.json());





// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, './public')));
app.use(methodOverride('_method'));




// Importing utils
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const sessionOptions = {
  secret : "mysupersceret",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}
app.use(session(sessionOptions)); 
app.use(flash());
// passport things
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Async function to connect to MongoDB
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log(`Connected To DB`);
  } catch (err) {
    console.log(`Error in Connectivity to DB`, err);
  }
}

// Default route
app.get("/", (req, res) => {
 res.redirect('/listings');
});

// middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: 'kys@amit.com',
    username: 'amitkys'
  });
  let registeredUser = await User.register(fakeUser, "amitkys@123");
  res.send(registeredUser);
})


app.use("/listings", listingsRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);


// error testing
app.use('/error', wrapAsync((req, res, next) => {
  abc = abc;
  
}))


// Middleware to handle non-existing routes
app.use("*", wrapAsync((req, res) => {
  throw new ExpressError(500, "Page not Found");
}))
// Error-handling middleware
app.use((err, req, res, next) => {
  let {statusCode=500, message="Something Went Wrong"} = err;
  // res.status(statusCode).send(message);
  res.render("./listing/error.ejs", {message});
});
// Start server
app.listen(3000, () => {
  console.log(`Server is running at 3000`);
});


main();
