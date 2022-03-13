const Joi = require("joi");
const connect = require("../../config/database");

const dashboardcontroller = {
  index: (req, res) => {
    res.render("index", { title: "prantho" });
  },
  user: (req, res) => {
    connect.query(
      `select * from users where active=1 and id!=${res.locals.user.id}`,
      (err, data) => {
        console.log(data);
        res.status(200).json(data);
      }
    );
  },
  room: (req, res) => {
    const { receiver_id, sender_id } = req.body;
    connect.query(
      `SELECT * FROM chatid WHERE (owner_id=${receiver_id} AND participant_id=${sender_id}) OR (owner_id=${sender_id} AND participant_id=${receiver_id})`,
      (err, roomid) => {
        if (roomid.length > 0) {
          connect.query(
            `SELECT messages.*,users.first_name,users.avatar FROM messages JOIN users ON messages.sender_id=users.id where messages.chat_id=${roomid[0].id}`,
            (err, messagefound) => {
              return res
                .status(200)
                .json({ roomidnumber: roomid[0].id, message: messagefound });
            }
          );
        } else {
          connect.query(
            `INSERT INTO chatid ( owner_id,participant_id) VALUES (?,?)`,
            [sender_id, receiver_id],
            (err, newroomid) => {
              console.log(newroomid);
              return res
                .status(200)
                .json({ roomidnumber: newroomid.insertId, message: [] });
            }
          );
        }
      }
    );
  },
  message: (req, res) => {
    const { receiver_id, sender_id, room_id, message } = req.body;
    connect.query(
      `INSERT INTO messages (chat_id,sender_id,receiver_id,message) VALUES (?,?,?,?)`,
      [room_id, sender_id, receiver_id, message],
      (err, messageinsert) => {
        connect.query(
          `SELECT messages.*,users.first_name,users.avatar FROM messages JOIN users ON messages.sender_id=users.id where messages.id=${messageinsert.insertId}`,
          (err, data) => {
            console.log(messageinsert)
            console.log(data)
            global.socket.emit("new_message", data[0]);
            return res.json(data[0]);
          }
        );
      }
    );
  },
};
module.exports = dashboardcontroller;
