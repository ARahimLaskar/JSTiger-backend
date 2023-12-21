const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(200).json({ msg: "please login" });
  }

  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    } else {
      req.body.userId = decoded.userId;
      next();
    }
  });
};
module.exports = { authentication };
