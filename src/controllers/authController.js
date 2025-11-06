import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

let refreshTokens = [];

export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    res.status(200).json({
      status: 200,
      message: "User created successfully",
      user: { id: user.id, username: user.username}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ status: 401, message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ status: 401, message: "Invalid password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/auth/refresh_token",
      secure: false, 
      sameSite: "lax"
    });

    res.status(200).json({
      status: 200,
      message: "Login successful",
      accessToken,
      user: { id: user.id, username: user.username}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
  return res.status(403).json({ status: 403, message: "No refresh token" });
}

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ status: 403, message: "Invalid token" });

      const user = await User.findByPk(decoded.id, { attributes: ["id", "username"] });
      if (!user) return res.status(404).json({ status: 404, message: "User not found" });

      const accessToken = generateAccessToken(user);
      res.status(200).json({
        status: 200,
        message: "Access token refreshed",
        accessToken,
        user: { id: user.id, username: user.username }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    refreshTokens = refreshTokens.filter(t => t !== token);
    res.clearCookie("refreshToken", { path: "/api/auth/refresh_token" });
    res.status(200).json({ status: 200, message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
