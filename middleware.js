module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You need to login first");
        return res.redirect('/login');
    }
    next();
}