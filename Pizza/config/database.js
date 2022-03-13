const mongoose = require("mongoose");
module.exports.db = () => {
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }).then((connect) => {
    console.log("database connected")
  }).catch(err => console.log(err))
}

