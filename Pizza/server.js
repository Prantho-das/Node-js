require("dotenv").config();
const express = require("express");
const path = require("path");
const { errorhandler } = require("./app/middleware/errorhandle.js");
const { db } = require("./config/database.js");
const { authrouter } = require("./routes/authroutes.js");
const { categoryRouter } = require("./routes/categoryroutes.js");
const productRouter = require("./routes/productroutes.js");
const upload = require("express-fileupload")
const app = express();
//middleware
app.use(upload())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//? database connection
db();
//TODO static file
app.use(express.static(path.resolve("./public/")));
//*routes 
app.use('/api', authrouter)
app.use('/api/product', productRouter)
app.use('/api/category', categoryRouter)
//!error handler
errorhandler(app);
// server made
app.listen(process.env.APP_PORT, () =>
  console.log(`Server Started at ${process.env.APP_URL}${process.env.APP_PORT}`)
);
