const jwt = require("jsonwebtoken");
const JWT_SECRET = "secretkeyforjsonwebtoken";

function authenticate (req, res, next) {
  // verifying headers token
  const authorizationHeader = req.headers["authorization"];
  let token;

  if (authorizationHeader) {
    token = authorizationHeader.split(" ")[1];
  }

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({
          success: false,
          message: "Please login to access the resource"
        });
      } else {
        req._username = decoded.username;
        next();
      }
    });
  } else {
    res.status(403).json({
      success: false,
      message: "Please login to access the resource"
    });
  }
}

module.exports = authenticate 
