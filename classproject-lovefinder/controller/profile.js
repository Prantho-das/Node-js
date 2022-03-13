import upload from "../config/file.js";
import con from "../model/index.js";
import { like_check, excerpt } from "../model/help.js";
export const profilecontroller = {
  index: (req, res) => {
    con.query(
      `select posts.*,category.category_name,count(likes.id) as likecount,GROUP_CONCAT(likes.user_id) as likestatus from posts join category on category.id=posts.category_id join users on users.id=posts.user_id LEFT join likes on likes.post_id=posts.id where posts.status=1 group by posts.id having posts.user_id=${res.locals.user.id} order by posts.created_at desc`,
      (err, post, field) => {
        con.query(
          `select * from users where id=${res.locals.user.id}`,
          (err, usernews, table) => {
            con.query(
              `select * from category where status=1`,
              (err, category, table) => {
                con.query(
                  "select count(followers.following_id) as following from followers where following_id=? group by followers.following_id;",
                  [res.locals.user.id],
                  (err, following) => {
                    console.log(following);
                    con.query(
                      "select count(followers.follower_id) as follower from followers where follower_id=? group by followers.follower_id",
                      [res.locals.user.id],
                      (err, follower) => {
                        console.log(follower);
                        res.render("profile/profile", {
                          title: "profile",
                          post,
                          userInfo: usernews[0],
                          category,
                          following,
                          follower,
                          like_check,
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
  },
  edit: (req, res) => {
    const { name, phone, division, city, address } = req.body;
    con.query(
      "update users set name=?,phone=?,division=?,city=?,address=? where id=?",
      [name, phone, division, city, address, res.locals.user.id],
      (err, result, table) => {
        res.redirect("back");
      }
    );
  },
  help: (req, res) => {
    res.render("profile/help", { title: "profie/help", con });
  },
  cover_pic: (req, res) => {
    const file = upload.single("file_cover");
    file(req, res, (err) => {
      if (err) {
        res.redirect("back");
        console.log("file not uploaded");
      }
      con.query(
        "update users set cover=? where id=?",
        [req.file.filename, res.locals.user.id],
        (err, result, field) => {
          res.redirect("back");
        }
      );
    });
  },
  avatar: (req, res) => {
    const file = upload.single("avatar");
    file(req, res, (err) => {
      if (err) {
        res.redirect("back");
        console.log("file not uploaded");
      }
      con.query(
        "update users set avatar=? where id=?",
        [req.file.filename, res.locals.user.id],
        (err, result, field) => {
          res.redirect("back");
        }
      );
    });
  },
  profile: (req, res) => {
    con.query(
      `select posts.*,category.category_name,count(likes.id) as likecount, GROUP_CONCAT(likes.user_id) as likestatus from posts join category on category.id=posts.category_id join users on users.id=posts.user_id LEFT join likes on likes.post_id=posts.id where posts.status=1 group by posts.id having posts.user_id=${req.params.id} order by posts.created_at desc`,
      (err, post, field) => {
        con.query(
          `select * from users where id=${req.params.id}`,
          (err, userInfo, table) => {
            con.query(
              "select count(followers.following_id) as following from followers where following_id=? group by followers.following_id;",
              [req.params.id],
              (err, following) => {
                console.log(following);
                con.query(
                  "select count(followers.follower_id) as follower from followers where follower_id=? group by followers.follower_id",
                  [req.params.id],
                  (err, follower) => {
                    console.log(follower);
                    con.query(
                      "select count(following_id) as followstatus from followers where following_id=? and follower_id=?",
                      [res.locals.user.id, req.params.id],
                      (err, followstatus) => {
                        console.log(followstatus);
                        res.render("profile/profileindividual", {
                          title: "profile " + userInfo[0].name,
                          post,
                          userInfo: userInfo[0],
                          follower,
                          following,
                          followstatus,
                          like_check,
                          excerpt
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
  },
  setting: (req, res) => {
    res.render("auth/changepassword", {
      title: "profie",
      layout: "./layout/layout",
    });
  },
  help_post: (req, res) => {
    const { name, email, message } = req.body;
    con.query(
      "insert into contacts (name,email,message) values (?,?,?)",
      [name, email, message],
      (err, result, table) => {
        req.flash("message", [
          { msg: "we received you message", class: "success" },
        ]);
        res.redirect("back");
      }
    );
  },
  search: (req, res) => {
    const user = res.locals.user;
    let gender;
    if (user.gender === "Male") {
      gender = "Female";
    } else if (user.gender === "Female") {
      gender = "Male";
    } else {
      gender = "Others";
    }
    console.log(gender)
    if (req.query.query) {
      console.log(req.query);
      con.query(
        `select * from users where users.role = "User" AND name like "%${req.query.query}%" AND gender="${gender}" and users.id != ${user.id}`,
        (err, search, table) => {
          console.log(search);
          return res.json(search);
        }
      );
    }
  },
  follow: (req, res) => {
    con.query(
      "SELECT * FROM followers WHERE following_id=? AND follower_id=?",
      [res.locals.user.id, req.params.id],
      (err, result) => {
        console.log(result);
        console.log("found");
        if (result.length > 0) {
          con.query(
            "delete from followers where id=?",
            [result[0].id],
            (err, del) => {
              console.log(del);
              console.log("deleted");

              req.flash("message", [
                { msg: "you unfollow him 😒", class: "error" },
              ]);

              return res.redirect("back");
            }
          );
        } else {
          con.query(
            "insert into followers (following_id,follower_id) values (?,?)",
            [res.locals.user.id, req.params.id],
            (err, insert) => {
              console.log(insert);
              console.log("insert");
              req.flash("message", [
                { msg: "you follow him 😉", class: "success" },
              ]);
              return res.redirect("back");
            }
          );
        }
      }
    );
  },
  like: (req, res) => {
    console.log(req.params);
    con.query(
      "SELECT * FROM likes WHERE user_id=? AND post_id=?",
      [res.locals.user.id, req.params.id],
      (err, result) => {
        if (result.length > 0) {
          con.query(
            "delete from likes where id=?",
            [result[0].id],
            (err, del) => {
              req.flash("message", [
                { msg: "you unlike him 👎 ", class: "error" },
              ]);

              return res.redirect("back");
            }
          );
        } else {
          con.query(
            "INSERT INTO likes (user_id,post_id) VALUES (?,?)",
            [res.locals.user.id, req.params.id],
            (err, insert) => {
              req.flash("message", [
                { msg: "you like him  👍", class: "success" },
              ]);
              return res.redirect("back");
            }
          );
        }
      }
    );
  },

  admin_user: (req, res) => {
    con.query("select * from users where role!='Admin'", (err, userinfo) => {
      return res.render("admin/user", { title: "All Users", userinfo });
    });
  },
  admin_user_disable: (req, res) => {
    con.query(
      "select * from users where id=?",
      [req.params.id],
      (err, userstatus, field) => {
        con.query(
          "update users set status=? where id=?",
          [userstatus[0].status === 0 ? 1 : 0, req.params.id],
          (err, category, table) => {
             req.flash("message", [
               { msg: `user ${userstatus[0].status===0?"enabled":"disabled"}`, class: "info" },
             ]);
            res.redirect("back");
          }
        );
      }
    )
  },
  follower:(req,res)=>{
    const id=res.locals.user.id
    con.query("select followers.following_id,users.* from followers join users on follower_id=users.id where following_id=?",[id],(err,following)=>{
      console.log(following)
    con.query(
      "select followers.follower_id,users.* from followers join users on following_id=users.id where follower_id=?",
      [id],
      (err, follower) => {
        console.log(follower);
        res.render("profile/follower", { title: "Follower Information",follower,following });
      }
    );
    })
  }
}