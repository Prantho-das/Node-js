const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  let token = req.headers.token;
  if (token) {
    token = token.split(" ");
    if (token[0] === "Bearer") {
      jwt.verify(token[1], process.env.JSON_SECRET, (err, decode) => {
        if (err) {
          res.status(403);
          next("unothorized");
        } else {
          next();
        }
      });
    } else {
      res.status(403);
      next("unothorized");
    }
  } else {
    res.status(403);
    next("unothorized");
  }
};
module.exports = { auth };
