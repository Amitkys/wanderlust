const Joy = require("joi");

module.exports.validListingSchema = Joy.object({
    title: Joy.string().min(5).max(24).required(),
    description: Joy.string().required(),
    image: Joy.string().allow("", null),
    price: Joy.number().required().min(0),
    location: Joy.string().required(),
    country: Joy.string().required()
});

module.exports.validReviewSchema = Joy.object({
    comment: Joy.string().required().min(5),
    rating: Joy.number().min(1).max(5).required()
});