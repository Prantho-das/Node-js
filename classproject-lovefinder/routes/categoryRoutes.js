import express from "express";
import upload from "../config/file.js";
import { categoryController } from "../controller/category.js";
import { auth } from "../middleware/authmiddleware.js";
const categoryRouter = express.Router();
categoryRouter.get("/", auth, categoryController.index);
categoryRouter.post("/create", auth, categoryController.create);
categoryRouter.post("/update", auth, categoryController.update);
categoryRouter.get("/show/:id", auth, categoryController.show_one);
categoryRouter.get("/delete/:id", auth, categoryController.delete);
categoryRouter.get("/status/:id", auth, categoryController.status);
categoryRouter.get("/:id", auth, categoryController.show);

export default categoryRouter;
