import express from "express";
import upload from "../config/file.js";
import { profilecontroller } from "../controller/profile.js";
import { auth, gender_checker } from "../middleware/authmiddleware.js";
const profileRoute = express.Router();

profileRoute.get("/", auth, profilecontroller.index);
profileRoute.post("/edit", auth, profilecontroller.edit);
profileRoute.get("/settings", auth, profilecontroller.setting);
profileRoute.get("/help", auth, profilecontroller.help);
profileRoute.post("/help", auth, profilecontroller.help_post);
profileRoute.post("/cover_pic",auth,profilecontroller.cover_pic);
profileRoute.post("/avatar", auth, profilecontroller.avatar);
profileRoute.get("/search", auth, profilecontroller.search);
profileRoute.get("/follower", auth, profilecontroller.follower);
profileRoute.get("/:id", auth,gender_checker, profilecontroller.profile);
profileRoute.get("/follow/:id", auth, profilecontroller.follow);
profileRoute.get("/like/:id", auth, profilecontroller.like);

export default profileRoute;
