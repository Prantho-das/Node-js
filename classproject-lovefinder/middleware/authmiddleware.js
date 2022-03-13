import jwt from "jsonwebtoken";
import con from "../model/index.js";
export const auth = (req, res, next) => {
  if (!req.session.userinfo) {
    return res.redirect("/login");
  }

  const usertoken = req.session.userinfo;
  const userInfo = jwt.verify(usertoken, process.env.JSON_SECRET);

  con.query(
    "select * from users where id=?",
    [userInfo.user.id],
    (err, user) => {
      if (user[0].status === 0) {
        req.flash("message", [
          {
            msg: "You are temporary blocked. please contact us! 🙂",
            class: "error",
          },
        ]);
        req.session.destroy((err) => {
          if (err) {
            console.log("session error" + err);
          }
        });
        return res.redirect("/login");
      }
      req.session.userinfo = jwt.sign(
        { user: user[0] },
        process.env.JSON_SECRET
      );
      res.locals.user = user[0];
      next();
    }
  );
};

export const guest = (req, res, next) => {
  if (req.session.userinfo) {
    return res.redirect("/");
  }
  next();
};
export const role = (role) => {
  return (req, res, next) => {
    if (res.locals.user.role != role) {
      return res.redirect("/admin/dashboard");
    }
    next();
  };
};
export const gender_checker = (req, res, next) => {
  const user = res.locals.user;
  let gender;
  if (user.gender === "Male") {
    gender = "Female";
  } else if (user.gender === "Female") {
    gender = "Male";
  } else {
    gender = "Others";
  }
  console.log("pranhot")
  if (req.params.id != res.locals.user.id) {
    con.query(
      `select * from users where id=${req.params.id} and gender="${gender}"`,
      (err, check) => {
        console.log(check);
        if (check && check.length > 0) {
          next();
        } else {
          return res.redirect("back");
        }
      }
    );
  } else {
    return res.redirect("back");
  }
};
