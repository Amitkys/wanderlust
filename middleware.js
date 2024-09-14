module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req);
    if (!req.isAuthenticated()) {
        // console.log('req original url', req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You need to login first");
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    // console.log('hello')
    // console.log(req.session.redirectUrl);
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        

    }
    next();
}