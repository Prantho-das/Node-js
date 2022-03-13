const { Category } = require("../models/categorymodel");
const { fileUploader } = require("../../config/helpers");
const joi = require("joi");
module.exports.categoryController = {
    index: async (req, res) => {
        try {
            res.status = 200;
            return res.json(await Category.find());
        } catch (error) {
            res.status = 500;
            return res.json({ error: error.message });
        }
    },
    create: async (req, res) => {
        const schema = joi.object({
            category_name: joi.string().required(),
            category_status: joi.string().required().optional(),
        });
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(422).json(error);
        }
        try {
            const Category = await Category.create({
                category_name: req.body.category_name,
                category_status: req.body.category_status ? true : false,
            });
            return res.status(200).json(Category);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            res.status = 200;
            return res.json(await Category.findByIdAndDelete(req.params.id));
        } catch (error) {
            res.status = 500;
            return res.json({ data: error.message });
        }
    },
    show: async (req, res) => {
        try {
            res.status = 200;
            return res.json(await Category.findById(req.params.id));
        } catch (error) {
            res.status = 500;
            return res.json({ data: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const schema = joi.object({
                category_name: joi.string().required().optional(),
                category_status: joi.string().required().optional(),
            });
            const { error } = schema.validate(req.body, { abortEarly: false });
            if (error) {
                return res.status(422).json(error);
            }
            let data = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).json({ msg: "Data Updated", data });
        } catch (error) {
            res.status = 500;
            return res.json({ data: error.message });
        }
    },
};
