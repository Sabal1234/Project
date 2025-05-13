
import JWT from "jsonwebtoken";
import User from "../model/user.schema.js";

export const isLoggedin = async (req, res, next) => {
  const token = req.cookies?.refresh_token || req.cookies?.accessToken; 

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    const decodedToken = JWT.verify(token, process.env.JWT_SECRET); 

    const user = await User.findById(decodedToken.id); 

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired",
      error: error.message,
    });
  }
};
