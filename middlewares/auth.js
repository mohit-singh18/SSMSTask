const jwt = require("jsonwebtoken");

module.exports = {
  auth: async (req, res, next) => {
    try {
      const token = req.header("auth-token");
      if (token == '' || !token) {
        return res.status(400).json({
          error: "No auth token. Access Denied!",
        });
      }
      const verified = jwt.verify(token, process.env.JWT_AUTH_KEY);
      if (!verified) {
        return res.status(400).json({
          error: "Invalid Token. Access Denied!",
        });
      }
      req.userId = verified.id;
      req.token = token;
      next();
    } catch (e) {
      res.status(500).json(e);
    }
  },
};
