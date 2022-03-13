import dotenv from "dotenv";
dotenv.config();
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import path from "path";
import authRouter from "./routes/authRoutes.js";
import postRouter from "./routes/postRoute.js";
import profileRoute from "./routes/profileRoute.js";
import con from "./model/index.js";
import { auth, role } from "./middleware/authmiddleware.js";
import categoryRouter from "./routes/categoryRoutes.js";
import { follow_check, like_check,excerpt } from "./model/help.js";
import adminRoute from "./routes/adminRoutes.js";
import { authcontroller } from "./controller/auth.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.resolve("./public/views"));

app.use(express.static(path.resolve("./public")));

app.use(expressEjsLayouts);
app.set("layout", path.resolve("./public/views/layout/layout"));
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(function (req, res, next) {
  res.locals.message = req.flash();
  next();
});
app.get("/", auth, authcontroller.home);
app.use(authRouter);
app.use("/post", postRouter);
app.use("/admin", adminRoute);
app.use("/profile", profileRoute);
app.use("/category", categoryRouter);
app.all('*',(req,res)=>res.render('404',{title:"404 | Not Found",layout:"./layout/app"}))
app.listen(process.env.PORT, (e) =>
  console.log(`${process.env.APP_URL}${process.env.PORT}`)
);
