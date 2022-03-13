const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connect = require("../../../config/database");

const authcontroller = {
  index: (req, res) => {
    res.render("login", { title: "login", layout: "./layout/loginregister" });
  },
  login: (req, res) => {
    console.log(req.body);
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.required(),
      remember: Joi.boolean().optional(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.redirect("back");
    }
    connect.query(
      "select * from users where email=?",
      req.body.email,
      (err, user) => {
        console.log(user);
        if (!user || user.length <= 0) {
          return res.redirect("back");
        }

        const match = bcrypt.compare(req.body.password, user[0].password);

        if (!match) {
          return res.redirect("back");
        }
        let userinfo = { ...user[0] };
        userinfo = jwt.sign({ user: userinfo }, process.env.JSON_SECRET);
        req.session.user = userinfo;
        req.session.cookie.expires = false;
        req.session.cookie.maxAge = 2 * 60 * 60 * 1000;
        req.session.save();
        global.socket.emit("new_user", {...user[0]});
        return res.redirect("/dashboard");
      }
    );
  },
};
module.exports = authcontroller;
