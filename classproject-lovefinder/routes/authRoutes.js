import express from "express";
import { authcontroller } from "../controller/auth.js";
import { auth, guest } from "../middleware/authmiddleware.js";
const authRouter = express.Router();

authRouter.get("/login",guest, authcontroller.index);
authRouter.post("/login",guest, authcontroller.signin);
authRouter.get("/signup",guest, authcontroller.signup);
authRouter.post("/signup",guest, authcontroller.signup_post);
authRouter.post("/change_password",auth, authcontroller.change_password);
authRouter.post("/logout",auth, authcontroller.logout);

export default authRouter;
