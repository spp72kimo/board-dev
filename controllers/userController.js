const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("../models");
const User = db.User;

const userController = {
  login: (req, res) => {
    res.render("user/login");
  },

  handleLogin: (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      req.flash("errorMessage", "請填寫完整帳密");
      return next();
    }

    User.findOne({
      where: {
        username,
      },
    }).then((user) => {
      if (user === null) {
        req.flash("errorMessage", "帳號密碼輸入錯誤");
        return next();
      }

      const hash = user.password;
      bcrypt.compare(password, hash, function (err, result) {
        if (result) {
          req.session.username = user.username;
          req.session.UserId = user.id;
          return res.redirect("/");
        } else {
          req.flash("errorMessage", "帳號密碼輸入錯誤");
          return next();
        }
      });
    });
  },

  register: (req, res) => {
    res.render("user/register");
  },

  handleRegister: (req, res, next) => {
    const userInfo = req.body;
    const { username, nickname, password } = req.body;
    if (!username || !password || !nickname) {
      req.flash("errorMessage", "請填寫完整資料");
      return next();
    }

    bcrypt.hash(password, saltRounds, function (err, hash) {
      userInfo.password = hash;

      User.create({ username, nickname, password: hash })
        .then((results) => {
          req.session.username = userInfo.username;
          req.session.UserId = results.id;
          console.log(req.session.UserId);
          res.redirect("/");
        })
        .catch((err) => {
          req.flash("errorMessage", err.toString());
          return next();
        });
    });
  },
};

module.exports = userController;
