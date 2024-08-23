const { ref } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        require: true
    },  
    description: String,
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1600077106724-946750eeaf3c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        set: (v) =>
             v === "" ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId, ref: "Review",
        }
    ]
});


listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})


const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;