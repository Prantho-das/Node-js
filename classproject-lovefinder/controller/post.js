import Joi from "joi";
import moment from "moment";
import upload from "../config/file.js";
import con from "../model/index.js";
import { like_check, excerpt } from "../model/help.js";
export const postcontroller = {
  index: (req, res) => {
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
      `select posts.*,category.category_name,count(likes.id) as likecount, GROUP_CONCAT(likes.user_id) as likestatus from posts join category on category.id=posts.category_id join users on users.id=posts.user_id LEFT join likes on likes.post_id=posts.id where users.gender="${gender}" and posts.status=1 group by posts.id order by posts.created_at desc limit 12;`,
      (err, recent, field) => {
        con.query(
          `select posts.*,category.category_name,count(likes.id) as likecount, GROUP_CONCAT(likes.user_id) as likestatus from posts join category on category.id=posts.category_id join users on users.id=posts.user_id LEFT join likes on likes.post_id=posts.id where users.gender="${gender}" and posts.status=1 group by posts.id order by posts.view desc limit 12;`,
          (err, mostviewed, field) => {
            con.query(
              `select posts.*,category.category_name,count(likes.id) as likecount, GROUP_CONCAT(likes.user_id) as likestatus from posts join category on category.id=posts.category_id join users on users.id=posts.user_id LEFT join likes on likes.post_id=posts.id where users.gender="${gender}" and posts.status=1 group by posts.id order by likecount desc limit 12;`,
              (err, popular, field) => {
                con.query(
                  `SELECT posts.*, category.category_name, COUNT(likes.id) AS likecount, GROUP_CONCAT(likes.user_id) AS likestatus FROM posts JOIN category ON category.id = posts.category_id JOIN users ON users.id = posts.user_id LEFT JOIN likes ON likes.post_id = posts.id LEFT JOIN followers ON followers.follower_id = posts.user_id WHERE followers.following_id=${res.locals.user.id} GROUP BY posts.id ORDER BY posts.created_at;`,
                  (err, followerpost, table) => {
                    res.render("post", {
                      title: "posts",
                      recent,
                      popular,
                      mostviewed,
                      followerpost,
                      like_check,
                      excerpt,
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  },
  create: (req, res) => {
    const { title, category, tags, description, file } = req.body;
    let filename;
    if (req.file) {
      filename = req.file.filename;
    } else {
      filename = "";
    }
    const schema = Joi.object({
      title: Joi.string().min(4).required(),
      category: Joi.number()
        .required()
        .messages({ "number.base": "please select category" }),
      description: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    console.log(error);

    if (error) {
      req.flash("message", [{ msg: error.details[0].message, class: "error" }]);
      return res.redirect("back");
    }
    con.query(
      `insert into posts 
        (title,description,category_id,img,user_id)
         values (?,?,?,?,?)`,
      [title, description, category, filename, res.locals.user.id],
      (err, postn, table) => {
        console.log(filename);
        console.log(postn);
        req.flash("message", [
          { msg: "post created successfully", class: "success" },
        ]);

        res.redirect("back");
      }
    );
  },
  singlepost: (req, res) => {
    con.query(
      "select posts.*,users.name from posts join users on users.id=posts.user_id join category on category.id=posts.category_id where posts.id=?",
      [req.params.id],
      (err, result, table) => {
        console.log(result[0]);
        if (result.length > 0) {
          console.log(result[0].id);
          con.query(
            "update posts set view=? where id=?",
            [result[0].view + 1, result[0].id],
            (err, view, table) => {
              console.log(view);
              return res.render("singlepost", {
                title: `post | ${result[0].title}`,
                data: result[0],
                m: moment,
              });
            }
          );
        } else {
          res.redirect("back");
        }
      }
    );
  },
  single: (req, res) => {
    con.query(
      "select posts.*,users.name from posts join users on users.id=posts.user_id join category on category.id=posts.category_id where posts.id=?",
      [req.params.id],
      (err, result, table) => {
        console.log(result[0]);
        if (result.length > 0) {
          res.json(result);
        } else {
          res.redirect("back");
        }
      }
    );
  },
  delete: (req, res) => {
    con.query(
      "delete from posts where id=? and user_id=?",
      [req.body.id, res.locals.user.id],
      (err, del, table) => {
        if (del) {
          req.flash("message", [{ msg: "post deleted", class: "error" }]);
          res.redirect("back");
        } else {
          res.redirect("back");
        }
      }
    );
  },
  update: (req, res) => {
    const { title, description, category, fileupload, id } = req.body;
    let filename;
    console.log(fileupload);
    console.log("prantoh");
    const schema = Joi.object({
      title: Joi.string().min(4).required(),
      category: Joi.number()
        .required()
        .messages({ "number:base": "please select category" }),
      description: Joi.string().required(),
      fileupload: Joi.optional(),
      id: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);

    console.log(error);

    if (error) {
      return res
        .status(404)
        .json({ err: true, msg: error.details[0].message, class: "error" });
    }

    if (req.file) {
      filename = req.file.filename;
      con.query(
        `update posts set
        title=?,description=?,category_id=?,img=?
        where id=?`,
        [title, description, category, filename, id],
        (err, postn, table) => {
          console.log(postn);
          return res.status(200).json({ msg: "Update Done", class: "info" });
        }
      );
    } else {
      con.query(
        `update posts set
          title=?,description=?,category_id=?
          where id=?`,
        [title, description, category, id],
        (err, postn, table) => {
          console.log(postn);
          return res.status(200).json({ msg: "Update Done", class: "info" });
        }
      );
    }
  },
  post: (req, res) => {
    const user = res.locals.user;
    let gender;
    if (user.gender === "Male") {
      gender = "Female";
    } else if (user.gender === "Female") {
      gender = "Male";
    } else {
      gender = "Others";
    }
    var per_page = 5;
    var start_post = (req.query.page_no - 1) * per_page;
    console.log(start_post);
    if (req.query.page_no) {
      con.query(
        `select posts.*,category.category_name,count(likes.id) as likecount, GROUP_CONCAT(likes.user_id) as likestatus from posts join category on category.id=posts.category_id join users on users.id=posts.user_id LEFT join likes on likes.post_id=posts.id where users.gender="${gender}" group by posts.id limit ${start_post},${per_page};`,
        (err, postresult) => {
          con.query(
            `select * from posts join users on users.id=posts.user_id where users.gender="${gender}"`,
            (err, pagination) => {
              console.log(pagination);
              console.log("pagination");
              res.render("postresult", {
                title: "post",
                postresult,
                excerpt,
                like_check,
                pagination,
              });
            }
          );
        }
      );
    }
  },
  admin_post: (req, res) => {
    con.query("select * from posts", (err, post) => {
      res.render("adminpost", { title: "post", post });
    });
  },
  post_status: (req, res) => {
    con.query(
      "select * from posts where id=?",
      [req.params.id],
      (err, poststatus, field) => {
        con.query(
          "update posts set status=? where id=?",
          [poststatus[0].status === 0 ? 1 : 0, req.params.id],
          (err, post, table) => {
            req.flash("message", [
              {
                msg: `post ${
                  poststatus[0].status === 0 ? "enabled" : "disabled"
                }`,
                class: "info",
              },
            ]);
            res.redirect("back");
          }
        );
      }
    );
  },
};
