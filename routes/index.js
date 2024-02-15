//  making a project of  mongodb database and login and singup
// route  par login and singup hoga
// profile par aapko profile dikhegi ad aapko
// saver posts dikhenge
// /feed yaha par saari images dikhegi
// click karke image open ho jayegi save kar skteho
// /board bordname poora board dikhega
// making project 
const express = require("express");
const router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require("passport");
const localStrategy = require("passport-local");
const upload = require("./multer")
passport.use(new localStrategy(userModel.authenticate()));



router.get("/", function (req, res) {
  res.render("index");
});


router.get("/login", function (req, res) {
  res.render("login", { error: req.flash("error") });
});



router.get('/profile', isLoggedIn, async function (req, res, next) {

  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate("posts")

  res.render("profile", { user });

});


router.post("/register", function (req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname: fullname });
  userModel.register(userData, req.body.password).
    then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
    });
});




router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}), function (req, res) {

});



router.post("/upload", isLoggedIn, upload.single("file"), async (req, res, next) => {
  if (!req.file) {
    res.status(404).send("no files were given")
  }


  const user = await userModel.findOne({
    username: req.session.passport.user
  })



  try {
    const postdata = await postModel.create({
      image: req.file.filename,
      ImageText: req.body.filecaption,
      user: user._id
    });


    user.posts.push(postdata._id);
    await user.save();
    res.redirect("/profile")



  } catch (error) {
    if (error.name === 'ValidationError') {

      return res.status(400).json({ error: error.message });
    } else {

      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }



})




router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});




function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}


module.exports = router;

