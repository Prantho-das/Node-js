import mail from "../config/mail.js";
import { excerpt } from "../model/help.js";
import con from "../model/index.js";

export const adminController = {
  index: (req, res) => {
    con.query(
      "select count(*) as usercount from users where role != 'Admin' ",
      (err, usercount) => {
        con.query(
          "select count(*) as postcount from posts",
          (err, postcount) => {
            con.query(
              "select count(*) as categorycount from category",
              (err, categorycount) => {
                con.query(
                  `select count(*) as activecount from users where active=1 and id != ${res.locals.user.id}`,
                  (err, activecount) => {
                    con.query(
                      "select count(*) as male from users where role != 'Admin' and gender='Male'",
                      (err, male) => {
                        con.query(
                          "select count(*) as female from users where role != 'Admin' and gender='Female'",
                          (err, female) => {
                            console.log(activecount);
                            res.render("admin/dashboard", {
                              title: "admin | dashboard",
                              layout: "./layout/admin",
                              usercount,
                              postcount,
                              categorycount,
                              activecount,
                              male,
                              female,
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
  },
  admin_help: (req, res) => {
    con.query(`select * from contacts`, (err, contact, field) => {
      console.log(contact);
      res.render("post/contact", {
        title: "contact",
        contact,
        excerpt,
      });
    });
  },
  admin_single_help: (req, res) => {
    con.query(
      "update contacts set status=1 where id=?",
      [req.params.id],
      (err, status) => {
        con.query(
          `select * from contacts where id=${req.params.id}`,
          (err, contact, field) => {
            console.log(contact);
            res.render("admin/helpsingle", {
              title: contact[0].name,
              messageInfo: contact[0],
              excerpt,
            });
          }
        );
      }
    );
  },
  admin_help_message: async (req, res) => {
    const { subject, email, message } = req.body;
    try {
      const mailstatus = await mail.sendMail({
        from: "prantho@gmail.com", // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: `<b>${message}</b>`,
      });
      req.flash("message", [
        {
          msg: "Message Sent",
          class: "success",
        },
      ]);
    } catch (error) {
      req.flash("message", [
        {
          msg: "Some problem happend please try again...!",
          class: "error",
        },
      ]);
    }

    res.redirect("back");
  },
};
