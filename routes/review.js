const express = require("express");
const router = express.Router({mergeParams: true});
// Importing modules
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validReviewSchema} = require("../schema.js");
// Importing utils
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const checkErrinReviewSchema = (req, res, next) => {
    let {error} = validReviewSchema.validate(req.body.review);
    
    if(error){
      throw new ExpressError(400, error);
    }
    else{
      next();
    }
}


// .................................................................................

// Route to Add Review in Listing

router.post('/', checkErrinReviewSchema, wrapAsync( async (req, res) => {
    // console.log(req.params.id); (must check out for id)
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review added!");
    res.redirect(`/listings/${req.params.id}`);
}));
// delete review route
router.delete("/:reviewId", wrapAsync( async(req, res) => {
  const {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
