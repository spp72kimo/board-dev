// import MySQL
const db = require("./db.js");

// import controller
const userController = require("./controllers/userController");
const commentController = require("./controllers/commentController");

// import essential module
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");

// import express
const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);

// set module
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set global variable of template
app.use((req, res, next) => {
  res.locals.info = req.flash("info");
  res.locals.errorMessage = req.flash("errorMessage");
  res.locals.username = req.session.username;
  next();
});

// set middleware function
function redirectBack(req, res) {
  res.redirect("back");
}

// set routers
app.post("/addComment", commentController.add);
app.get("/comment_delete/:cid", commentController.del);
app.get("/edit/:cid", commentController.edit);
app.post("/edit", commentController.handleEdit);

app.get("/", commentController.getAll);
app.get("/register", userController.register);
app.post("/register", userController.handleRegister, redirectBack);
app.get("/login", userController.login);
app.post("/login", userController.handleLogin, redirectBack);
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// create server and connect DB
app.listen(port, () => {
  db.connect((err) => {
    if (err) {
      console.log("error connecting: " + err.stack);
      return;
    }
    console.log("connect successfully.");
  });
  console.log("Server is running on port" + port);
});
