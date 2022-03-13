const view = (app,express,path) => {
  const expressEjsLayouts = require("express-ejs-layouts");
  app.set("view engine", "ejs");
  app.set("views", path.resolve("./public/views"));
  app.use(expressEjsLayouts);
  app.set("layout", path.resolve("./public/views/layout/layout"));
  app.use(express.static(path.resolve("./public/")));
};
module.exports=view