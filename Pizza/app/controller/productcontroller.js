const { Product } = require("../models/productmodel");
const { fileUploader } = require("../../config/helpers");
const joi = require("joi");
module.exports.productController = {
  index: async (req, res) => {
    try {
      res.status = 200;
      return res.json(await Product.find());
    } catch (error) {
      res.status = 500;
      return res.json({ error: error.message });
    }
  },
  create: async (req, res) => {
    const file = req.files;
    const fields = req.body;
    if (!file) {
      return res.status(401).json({ error: [{ msg: "Please Upload Image" }] });
    }
    const schema = joi.object({
      name: joi.string().required(),
      category: joi.string().required(),
      status: joi.boolean().required(),
      regular_price: joi.number().min(20).required(),
      file: joi.any().optional(),
      discount_price: joi.optional(),
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(422).json(error);
    } else {
      const filetype = file.file["mimetype"];
      if (
        filetype != "image/png" &&
        filetype != "image/jpg" &&
        filetype != "image/jpeg"
      ) {
        return res
          .status(422)
          .json({ error: [{ msg: "FIle Type Must be jpg/png" }] });
      } else {
        const filename = fileUploader(file);
        try {
          const product = await Product.create({
            name: fields.name,
            image: filename,
            category: fields.category_id,
            status: fields.status,
            regular_price: fields.regular_price,
            discount_price: fields.discount_price && fields.discount_price,
          });
          return res.status(200).json(product);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      }
    }
  },
  delete: async (req, res) => {
    try {
      res.status = 200;
      return res.json(await Product.findByIdAndDelete(req.params.id));
    } catch (error) {
      res.status = 500;
      return res.json({ data: error.message });
    }
  },
  show: async (req, res) => {
    try {
      res.status = 200;
      return res.json(await Product.findById(req.params.id));
    } catch (error) {
      res.status = 500;
      return res.json({ data: error.message });
    }
  },
  search: async (req, res) => {
    let q = req.query.q;
    if (!q) {
      return res.status(401).json({ error: "Please Insert Correct Query", status: 500 });
    }
    try {
      let product = await Product.find({ $or: [{ name: q }, { discount_price: {$gte:isNaN(parseInt(q)) ? 1 : q}}] });
      res.status = 200;
      return res.json(product);
    } catch (error) {
      res.status = 500;
      return res.json({ data: error.message });
    }
  },
  update: async (req, res) => {
    const file = req.files;
    try {
      const schema = joi.object({
        name: joi.string().required().optional(),
        category: joi.string().required().optional(),
        regular_price: joi.number().min(20).required(),
        file: joi.any().optional(),
        discount_price: joi.optional(),
      });
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(422).json(error);
      }
      let data;
      if (file) {
        const filetype = file.file["mimetype"];
        if (
          filetype != "image/png" &&
          filetype != "image/jpg" &&
          filetype != "image/jpeg"
        ) {
          return res
            .status(401)
            .json({ error: [{ msg: "FIle Type Must be jpg/png" }] });
        } else {
          const filename = fileUploader(file);
          data = await Product.findByIdAndUpdate(req.params.id, {
            ...req.body,
            image: filename,
          }, { new: true });
        }
      } else {
        data = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      }
      return res.status(200).json({ msg: "Data Updated", data });
    } catch (error) {
      res.status = 500;
      return res.json({ data: error.message });
    }
  },
};
