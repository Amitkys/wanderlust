const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({secret: "secretCode", resave: false, saveUninitialized: true}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get('/register', (req, res) => {
    const {name = 'anonymous'} = req.query;
    req.session.name = name;
    if(req.session.name === "anonymous"){
        req.flash("error", "user not registered");
    }else{
        req.flash("success", "User Registered successfully!");
    }
    res.redirect('/hello')
})

app.get('/hello', (req, res) => {
   
    res.render("flash-notification.ejs", {user: req.session.name})
    // res.render('flash-notification.ejs');
})

/*
app.get("/register", (req, res) => {

    const {name = "anonymous"} = req.query;
    console.log(name);
    res.send(name);
}) */

/*
app.get("/reqcount", (req, res) => {
    if(!req.session.count){
        req.session.count = 1;
    }
    else{
        req.session.count++;
    }
    res.send(`you make ${req.session.count} times request`);
})

app.get("/test", (req, res) => {
    res.send('test is working');
})
*/

/*
const cookieParser = require('cookie-parser');
app.use(cookieParser("secretCode"));

app.get("/signedCookies", (req, res) => {
    res.cookie('name', 'amit', {signed: true})
    res.send('signed cookies sent')
});

app.get("/verifySignedCookie", (req, res) => {
    const {name} = req.signedCookies;
    console.log(name);
})

app.get("/cookies", (req, res) => {
    res.cookie("greet", "this is amit kys");
    res.send('Server is working');
})

app.get("/greet", (req, res) => {
    let {name = 'anonymous'} = req.cookies;
    res.send(`welcome ${name}`);
})

app.get("/", (req, res) => {
    res.send('<h1>this is the  main page</h1>')
})
*/
app.listen(3000, () => {
    console.log('app is listening at 3000');
}) 