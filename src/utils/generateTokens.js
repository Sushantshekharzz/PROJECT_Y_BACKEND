import jwt from "jsonwebtoken";

export const generateAccessToken = (user) =>
  jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });

export const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
