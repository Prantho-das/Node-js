import path from "path";
import con from "../model/index.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { follow_check, like_check, excerpt } from "../model/help.js";
import categoryRouter from "../routes/categoryRoutes.js";
export const authcontroller = {
  index: (req, res) => {
    res.render("auth/login", { title: "login", layout: "./layout/app" });
  },
  signin: async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
console.log(error)
    if (error) {
      req.flash("message", [{ msg: error.details[0].message, class: "error" }]);
      return res.redirect("back");
    }
    con.query(
      "select * from users where email=?",
      [email],
      (err, result, table) => {
        console.log(result)
        if (result.length <= 0) {
          req.flash("message", [
            {
              msg: "Credential not match",
              class: "error",
            },
          ]);
          return res.redirect("back");
        }

        const match = bcrypt.compareSync(password, result[0].password);
console.log(match)
        if (!match) {
          req.flash("message", [
            {
              msg: "Credential not match",
              class: "error",
            },
          ]);
          return res.redirect("back");
        }
        if (result[0].status === 0) {
          req.flash("message", [
            {
              msg: "You are temporary blocked. please contact us! 🙂",
              class: "error",
            },
          ]);
          return res.redirect("back");
        }
        req.session.userinfo = jwt.sign(
          { user: result[0] },
          process.env.JSON_SECRET
        );
        con.query(
          "update users set active=? where id=?",
          [1, result[0].id],
          (err, active) => {
            req.session.cookie.expires = false;
            req.session.cookie.maxAge = 2 * 60 * 60 * 1000;
            req.session.save();

            if (result[0].role === "Admin") {
              return res.redirect("/admin");
            } else {
              return res.redirect("/");
            }
          }
        );
      }
    );
  },
  signup: (req, res) => {
    res.render("auth/register", { title: "register", layout: "./layout/app" });
  },
  signup_post: (req, res) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.required(),
      gender: Joi.string().required(),
      division: Joi.string().required(),
      city: Joi.string().required(),
      address: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      req.flash("message", [
        {
          msg: error.details[0].message,
          class: "error",
        },
      ]);
      return res.redirect("back");
    }
    const { name, email, phone, gender, division, city, address, password } =
      req.body;
    con.query(
      "select * from users where email=?",
      [req.body.email],
      (err, result, table) => {
        if (result && result.length > 0) {
          req.flash("message", [
            {
              msg: "You are already registered",
              class: "error",
            },
          ]);
          return res.redirect("back");
        }
        con.query(
          "insert into users (name,email,gender,phone,division,city,address,password) values (?,?,?,?,?,?,?,?)",
          [
            name,
            email,
            gender,
            phone,
            division,
            city,
            address,
            bcrypt.hashSync(password, 10),
          ],
          (err, insert, table) => {
            console.log(insert);
            req.flash("message", [
              {
                msg: "Your Account Has been Created Successfully! Please Login",
                class: "success",
              },
            ]);
            return res.redirect("/login");
          }
        );
      }
    );
  },

  change_password: (req, res) => {
    con.query(
      `select * from users where email=?`,
      [res.locals.user.email],
      (err, user, table) => {
        if (user) {
          let match = bcrypt.compareSync(
            req.body.current_password,
            user[0].password
          );
          console.log(match);
          if (!match) {
            console.log("current password not matched");
            return res.redirect("back");
          }
          if (req.body.new_password != req.body.confirm_password) {
            console.log("password not matched");
            return res.redirect("back");
          }
          con.query(
            "update users set password=? where id=?",
            [bcrypt.hashSync(req.body.new_password, 10), user[0].id],
            (err, res, table) => {
              console.log(res);
              console.log("password changed");
              return res.redirect("back");
            }
          );
        }
      }
    );
  },

  logout: (req, res) => {
    console.log("prantho");
    req.session.destroy(function (err) {
      if (err) {
        return res.redirect("back");
      }
    });
    con.query(
      "update users set active=? where id=?",
      [0, res.locals.user.id],
      (err, active) => {
        console.log(active);
      }
    );
    res.redirect("/login");
  },
  home: (req, res) => {
    const user = res.locals.user;
    let gender;
    if (user.gender === "Male") {
      gender = "Female";
    } else if (user.gender === "Female") {
      gender = "Male";
    } else {
      gender = "Others";
    }

    con.query(
      `SELECT category.*,COUNT(p.id) as categoryCount from category left JOIN posts as p ON p.category_id=category.id group by category.id`,
      (err, category, table) => {
        console.log(category);
        con.query(
          `select posts.*,category.category_name,count(likes.id) as likecount, GROUP_CONCAT(likes.user_id) as likestatus from posts join category on category.id=posts.category_id join users on users.id=posts.user_id LEFT join likes on likes.post_id=posts.id where users.gender="${gender}" and posts.status=1 group by posts.id order by posts.created_at desc limit 3;`,
          (err, recent, table) => {
            con.query(
              `select posts.*,category.category_name,count(likes.id) as likecount, GROUP_CONCAT(likes.user_id) as likestatus from posts join category on category.id=posts.category_id join users on users.id=posts.user_id LEFT join likes on likes.post_id=posts.id where users.gender="${gender}" and posts.status=1 group by posts.id order by likecount desc limit 8;`,
              (err, popular, table) => {
                con.query(
                  `SELECT COUNT(followers.follower_id) as countFollower,users.*,GROUP_CONCAT(followers.following_id,":",followers.follower_id SEPARATOR ",") as followstatus FROM users left JOIN followers ON users.id=followers.follower_id where users.gender="${gender}" GROUP BY users.id ORDER BY countFollower DESC limit 5`,
                  (err, popularPeople, table) => {
                    con.query(
                      `SELECT users.*,COUNT(followers.follower_id) as countFollower,GROUP_CONCAT(followers.following_id,":",followers.follower_id SEPARATOR ",") as followstatus FROM users left join followers on users.id=followers.follower_id WHERE users.gender="${gender}" and users.city like "%${res.locals.user.city}%" group by users.id`,
                      (err, people, table) => {
                        con.query(
                          `SELECT posts.*, category.category_name, COUNT(likes.id) AS likecount, GROUP_CONCAT(likes.user_id) AS likestatus FROM posts JOIN category ON category.id = posts.category_id JOIN users ON users.id = posts.user_id LEFT JOIN likes ON likes.post_id = posts.id LEFT JOIN followers ON followers.follower_id = posts.user_id WHERE followers.following_id=${res.locals.user.id} and posts.status=1 GROUP BY posts.id ORDER BY posts.created_at;`,
                          (err, followerpost, table) => {
                            con.query(
                              `select * from posts join users on users.id=posts.user_id where users.gender="${gender}" and posts.status=1 ORDER BY posts.created_at`,
                              (err, pagination) => {
                                res.render("index", {
                                  title: "home",
                                  category,
                                  recent,
                                  popular,
                                  popularPeople,
                                  people,
                                  follow_check,
                                  like_check,
                                  excerpt,
                                  followerpost,
                                  pagination,
                                });
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  },
};
