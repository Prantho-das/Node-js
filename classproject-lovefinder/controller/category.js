import Joi from "joi";
import con from "../model/index.js";

export const categoryController = {
  index: (req, res) => {
    con.query(`select * from category`, (err, category, field) => {
      console.log(category);
      res.render("category/category", {
        title: "category",
        category,
      });
    });
  },
  create: (req, res) => {
    const schema = Joi.object({
      category: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      req.flash("message", [{ msg: error.details[0].message, class: "error" }]);
      return res.redirect("back");
    }
    con.query(
      "insert into category (category_name) values (?)",
      [req.body.category],
      (err, category, table) => {
        req.flash("message", [
          { msg: "category created successfully", class: "success" },
        ]);

        console.log(category);
      }
    );
    res.redirect("back");
  },
  show: (req, res) => {

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
      `select users.gender,posts.*,category.id as catid,category.category_name,count(likes.id) as likecount from posts join category on category.id=posts.category_id join users on users.id=posts.user_id LEFT join likes on likes.post_id=posts.id where users.gender="${gender}" and posts.status=1 group by posts.id having catid=${req.params.id} order by posts.created_at desc`,
      (err, category, field) => {
        console.log(category);
        if (category.length <= 0) {
          req.flash("message", [{ msg: "There is no post for you", class: "error" }]);
          return res.redirect("back");
        } else {
          res.render("category/categoryresult", {
            title: "category",
            category,
          });
        }
      }
    );
  },
  show_one: (req, res) => {
    con.query(
      "select * from category where id=?",
      [req.params.id],
      (err, category, field) => {
        console.log(category);
        if (!category) {
          req.flash("message", [{ msg: "category not found", class: "error" }]);
          res.redirect("back");
        } else {
          res.render("category/categoryedit", {
            title: "category",
            category,
          });
        }
      }
    );
  },
  update: (req, res) => {
    con.query(
      "update category set category_name=? where id=?",
      [req.body.category, req.body.category_id],
      (err, category, table) => {
         req.flash("message", [{ msg: "category updated", class: "info" }]);
        res.redirect("back");
      }
    );
  },
  delete: (req, res) => {
    con.query(
      "delete from category where id=?",
      [req.params.id],
      (err, del, table) => {
        console.log(del);
              req.flash("message", [
                { msg: 'category deleted', class: "error" },
              ]);

        res.redirect("back");
      }
    );
  },
  status: (req, res) => {
    con.query(
      "select * from category where id=?",
      [req.params.id],
      (err, categorystatus, field) => {
        con.query(
          "update category set status=? where id=?",
          [categorystatus[0].status === 0 ? 1 : 0, req.params.id],
          (err, category, table) => {
             req.flash("message", [
               { msg: `category ${categorystatus[0].status===0?"enabled":"disabled"}`, class: "info" },
             ]);
            res.redirect("back");
          }
        );
      }
    );
  },
};
