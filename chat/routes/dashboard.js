const express = require("express");
const dashboardcontroller = require("../app/controller/dashboard");
const { authmiddlware } = require("../app/middleware/authmiddleware");
const dashboard = express.Router();
dashboard.get("/",authmiddlware, dashboardcontroller.index);
dashboard.get("/user",authmiddlware, dashboardcontroller.user);
dashboard.post("/room",authmiddlware, dashboardcontroller.room);
dashboard.post("/message",authmiddlware, dashboardcontroller.message);

module.exports = dashboard;
