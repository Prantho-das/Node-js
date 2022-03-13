module.exports.errorhandler = (app) => {
  app.use((req, res, next) => {
    res.status(404);
    next("404 not found");
  });
  
  app.use((error, req, res, next) => {
    res.json({ message: error, status: req.res.statusCode||500 });
  });
};
