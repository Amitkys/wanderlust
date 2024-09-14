const express = require('express');
const router = express.Router();
//
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware.js');

router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
});
router.post("/signup", wrapAsync( async(req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username }); // instance of User models
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Register Successfully!");
            res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}));

router.get("/login", (req, res) => {
    res.render("user/login.ejs");
});
router.post("/login", saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req, res) => {
        req.flash("success", "login successful");
        res.redirect(res.locals.redirectUrl);
    })
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged out");
        res.redirect("/listings");
    })
})

module.exports = router;