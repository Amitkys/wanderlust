const express = require('express');
const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
});
router.post("/signup", (req, res) => {
    const {username, email, password} = req.body;

    console.log(username);
    console.log(email);
    console.log(password);
})

module.exports = router;