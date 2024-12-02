const jwt = require("jsonwebtoken");
const User = require("../model/profile")
const { JWTSECRET } = require("../secret")

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json( {error:"Authorization token required"});
  } else {
    const token = authorization.split(" ")[1];
    try {
      const {_id} = jwt.verify(token, JWTSECRET);
      const user_id = await User.findOne({userId:_id}).select("userId")
      req.id = user_id?.userId
      next()
    } catch (error) {
      console.log(error)
      res.status(404).json({error:"Request not authorized"});
    }
  }
};

module.exports = requireAuth;