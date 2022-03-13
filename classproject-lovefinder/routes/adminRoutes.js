import express from "express";
import upload from "../config/file.js";
import { adminController } from "../controller/admin.js";
import { postcontroller } from "../controller/post.js";
import { profilecontroller } from "../controller/profile.js";
import { auth, role } from "../middleware/authmiddleware.js";

const adminRoute = express.Router();

adminRoute.get("/",auth,adminController.index);
adminRoute.get("/post",auth,postcontroller.admin_post);
adminRoute.get("/post/status/:id",auth,postcontroller.post_status);

adminRoute.get("/help",auth,adminController.admin_help);
adminRoute.get("/help/message/:id",auth,adminController.admin_single_help);
adminRoute.post("/help",auth,adminController.admin_help_message);

adminRoute.get("/user",auth,profilecontroller.admin_user);
adminRoute.get("/user/status/:id",auth,profilecontroller.admin_user_disable);

export default adminRoute;
