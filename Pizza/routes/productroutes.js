const express = require("express");
const { productController } = require("../app/controller/productController.js");
const { auth } = require("../app/middleware/authmiddlware.js");
const productRouter = express.Router();

productRouter.get("/", auth, productController.index);
productRouter.post("/create", auth, productController.create);
productRouter.put("/update/:id", auth, productController.update);
productRouter.delete("/delete/:id", auth, productController.delete);
productRouter.get("/read/:id", auth, productController.show);
productRouter.get("/search",auth, productController.search);

module.exports = productRouter
