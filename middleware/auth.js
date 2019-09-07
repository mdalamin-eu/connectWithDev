const jwt = require("jsonwebtoken");
const config = require("config");

module.export = (req, res, next) => {
  // get token from header
  const token = req.header("x-auth-token");

  //   check if not token

  if (!token) {
    return res.status(401).json({ msg: "no token , authorization denied" });
  }
  //   verify token

  try {
    const decode = jwt.verify(token, config.get("SECRETKEYS"));
    req.user = decode.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "token not valid" });
  }
};
