require("dotenv").config();
const express = require("express");
const flash = require("connect-flash");
const app = express();
const http = require("http");
const path = require("path");
const session = require("express-session");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
const connect = require("./config/database");
const view = require("./config/view");
const auth = require("./routes/auth");
const dashboard = require("./routes/dashboard");

const server = http.createServer(app);
const io = require("socket.io")(server);

view(app, express, path);

app.use((req, res, next) => {
  res.locals.message = req.flash();
  // io.on('connection',(socket)=>{
  //   console.log(socket.id)
  // })
  global.socket = io;
  next();
});
connect.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connect.threadId);
});

app.use(auth);
app.use("/dashboard", dashboard);
server.listen(process.env.PORT, () => console.log(`server started ${process.env.APP_URL}`));
