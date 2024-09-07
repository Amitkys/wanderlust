const express = require("express");
const router = express.Router();
const {isLoggedIn} = require('../middleware.js');

// Importing modules
const Listing = require("../models/listing.js");
const {validListingSchema} = require("../schema.js");

// Importing utils
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");



const checkErrinListingSchemam = (req, res, next) => {
    let {error} = validListingSchema.validate(req.body.listing);
    
    if(error){
      console.log(error);
      throw new ExpressError(400, error);
    }
    else{
      next();
    }
  }

// .................................................................................

// Route to get all listings
router.get("/", wrapAsync( async (req, res) => {
    let allListing = await Listing.find();
    const message = req.query.message;
    res.render('./listing/index.ejs', {allListing, message});
}));
// Route to render form for adding new listing
router.get('/new', isLoggedIn, (req, res) => {
  res.render("./listing/new.ejs");
});

// Route to update data
router.put('/update/:id', isLoggedIn, checkErrinListingSchemam,  wrapAsync( async (req, res) => {
  
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing); 
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/`);


  }
));

// insert new listing
router.post("/", isLoggedIn, checkErrinListingSchemam, wrapAsync( async(req, res) => {

    const data = req.body.listing;
    // console.log(data);
    await Listing.insertMany([data]);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
    // res.redirect("/listings?message=New+listing+added+successfully");
    }
));


// Route to render form for editing a listing
router.get('/edit/:id', isLoggedIn,  wrapAsync(  async (req, res) => {
 
    let { id } = req.params;
    // console.log(id);
    let listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing does not exist.");
      res.redirect('/listings')
    }
    res.render("./listing/edit.ejs", {listing});
}));
// route to delete
router.delete('/:id', isLoggedIn, async(req, res) => {
  let {id} = req.params;
  // console.log(id);
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
});
// Route to get a single listing
router.get("/:id", async (req, res) => {
  
    let { id } = req.params;
    let message = req.query.message;
    let one_listing = await Listing.findById(id).populate("reviews");
    if(!one_listing){
      req.flash("error", "Listing not found :(");
      res.redirect("/listings");
    }else{
    res.render("./listing/one_listing.ejs", { one_listing, message });
    }
   
});

module.exports = router;