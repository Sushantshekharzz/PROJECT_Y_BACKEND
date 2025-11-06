import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log()

    if (!token) {
      return res.status(401).json({ status: 401, message: "Access token missing" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log("err",err)
        return res.status(403).json({ status: 403, message: "Invalid or expired token" });
      }
      req.user = user; 
      next();
    });
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
