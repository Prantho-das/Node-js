const { User } = require("../../models/usermodel.js");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
module.exports.authcontroller = {
  register: async (req, res) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      address: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({ message: error.message });
    }
    try {
      const user = await User({
        ...req.body,
        password: bcrypt.hashSync(req.body.password, 10),
      });
      await user.save();
      res.status(200).json({ data: user });
    } catch (error) {
      return res.status(422).json({
        message: error.code === 11000 ? "Email is already taken" : error,
      });
    }
  },
  login: async (req, res) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({ message: error.message });
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      console.log(user);
      if (!user) {
        return res.status(403).json({ message: "credential not match" });
      }
      const match = bcrypt.compareSync(req.body.password, user.password);

      console.log(match);
      if (!match) {
        return res.status(403).json({ message: "credential not match" });
      }
      const token = jwt.sign({ user }, process.env.JSON_SECRET, {
        expiresIn: 60 * 60 * 24,
      });

      res.status(200).json({ data: user, token });
    } catch (error) {
      res.status(404).json({ message: error });
    }
  },
  user: async (req, res) => {
    try {
      res.status(200).json({ data: await User.find() });
    } catch (error) {
      res.status(404).json({ message: error });
    }
  },
};
