import express from "express"
import upload from "../config/file.js";
import { postcontroller } from "../controller/post.js";
import {auth} from "../middleware/authmiddleware.js"
const postRouter=express.Router()

postRouter.get("/",auth,postcontroller.index)
postRouter.post("/create",auth, upload.single("file"),postcontroller.create)
postRouter.post("/update",auth,upload.single("fileupload"),postcontroller.update)
postRouter.post("/delete",auth,postcontroller.delete)
postRouter.get("/post",auth,postcontroller.post)
postRouter.get("/:id",auth,postcontroller.singlepost)
postRouter.get("/single/:id",auth,postcontroller.single)

export default postRouter;