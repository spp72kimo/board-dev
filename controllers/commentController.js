const bodyParser = require("body-parser");
const db = require("../models");
const user = require("../models/user");
const Comment = db.Comment;
const User = db.User;

const commentController = {
  add: (req, res, next) => {
    const username = req.session.username;
    const content = req.body.content;
    if (!username || !content) {
      req.flash("errorMessage", "請輸入留言");
      return res.redirect("/");
    }

    Comment.create({
      username,
      content,
      UserId: req.session.UserId,
    })
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        req.flash("errorMessage", err.toString());
        res.redirect("/");
      });
  },

  getAll: (req, res) => {
    Comment.findAll({
      include: User,
      order: [["id", "DESC"]],
    }).then((users) => {
      const userList = JSON.parse(JSON.stringify(users));
      res.render("index", { results: userList });
    });
  },

  del: (req, res) => {
    const comment_id = req.params.cid;
    const username = req.session.username;
    if (!comment_id || !username) return res.redirect("/");

    Comment.destroy({
      where: {
        id: comment_id,
        UserId: req.session.UserId,
      },
    })
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        req.flsh("errorMessage", err.toString());
        res.redirect("/");
      });
  },

  edit: (req, res) => {
    const comment_id = req.params.cid;
    if (!comment_id || !req.session.username) return res.redirect("/");

    Comment.findOne({
      where: {
        id: comment_id,
      },
      include: User,
    }).then((results) => {
      const { id, content, UserId } = results;
      if (UserId != req.session.UserId) {
        return res.redirect("/");
      }
      res.render("edit", { id, content });
    });
  },

  handleEdit: (req, res) => {
    if (!req.session.username) return res.redirect("/");
    const username = req.session.username;
    const { cid, content } = req.body;
    if (content === "") {
      req.flash("errorMessage", "您沒有輸入留言");
      return res.redirect("back");
    }

    Comment.update(
      { content },
      {
        where: {
          id: cid,
        },
      }
    )
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        req.flash("errorMessage", err.toString());
        res.redirect("/");
      });
  },
};

module.exports = commentController;
