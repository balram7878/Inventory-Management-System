const client = require("../../Database/config/redis");
const sql = require("../../Database/config/postgres");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const {
  registrationValidation,
  loginValidation,
} = require("../../src/utils/validate.user");

const login = async (req, res) => {
  try {
    loginValidation(req.body);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const userResult = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1;
    `;

    if (userResult.length === 0) throw new Error("invalid credential");

    const u = userResult[0];

    const isPasswordValid = await bcrypt.compare(password, u.password);
    if (!isPasswordValid) throw new Error("invalid credential");

    const token = jwt.sign(
      { sub: u.user_id, name: u.name, email: u.email, role: u.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h", jwtid: uuidv4() }
    );

    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      name: u.name,
      email: u.email,
      status: "login successfully",
    });
  } catch (err) {
    console.log("Login failed: ", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    await client.set(`bl:${req.user.jti}`, "blocked");
    await client.expireAt(`bl:${req.user.jti}`, req.user.exp);

    res.cookie("token", "", { expires: new Date(0) });
    res.status(200).send("logout successfully");
  } catch (err) {
    console.log("Logout failed: ", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const profile = async (req, res) => {
  try {
    const { email } = req.user;

    const result = await sql`
      SELECT user_id, name, email, phone, role, created_at
      FROM users
      WHERE email = ${email} LIMIT 1;
    `;

    if (result.length === 0) {
      return res.status(401).json({ error: "user not found" });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const { sub: userId } = req.user;

    const result = await sql`
      DELETE FROM users WHERE user_id = ${userId} RETURNING *;
    `;

    if (result.length === 0)
      return res.status(404).json({ message: "User not found" });

    await client.set(`bl:${req.user.jti}`, "blocked");
    await client.expireAt(`bl:${req.user.jti}`, req.user.exp);

    res.cookie("token", null, { expiresIn: new Date(Date.now()) });

    res.status(200).json({
      message: "Account deleted successfully. You have been logged out.",
    });
  } catch (err) {
    console.log("User deletion failed: ", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const authentication = (req, res) => {
  try {
    res.status(200).json({
      name: req.user.name,
      email: req.user.email,
      message: "authenticated user",
    });
  } catch (err) {
    console.log("Authentication failed: ", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const customer = async (req, res) => {
  try {
    registrationValidation(req.body);
  } catch (err) {
    console.log("Registration validation error:", err.message);
    return res.status(400).json({ error: err.message });
  }
  try {
    let { fullName, email, phone, password } = req.body;

    const name = fullName.trim();
    email = email.toLowerCase();

    phone = phone ? phone.trim() : "";

    if (phone && !/^[0-9]{10}$/.test(phone)) {
      throw new Error("invalid phone number");
    }

    const exists = await sql`
      SELECT EXISTS(SELECT 1 FROM users WHERE email = ${email}) AS exists;
    `;

    if (exists[0].exists)
      return res.status(409).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO users (name, email, phone, role, password)
      VALUES (${name}, ${email}, ${phone}, 'customer', ${hashedPassword})
      RETURNING *;
    `;

    const u = result[0];

    const token = jwt.sign(
      { sub: u.user_id, name: u.name, email: u.email, role: u.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h", jwtid: uuidv4() }
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

    res.status(201).json({
      name: u.name,
      email: u.email,
      message: "user registered successfully",
    });
  } catch (err) {
    console.log("Registration error:", err.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const admin = async (req, res) => {
  try {
    registrationValidation(req.body);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
  try {
    if (req.user?.role !== "admin")
      return res.status(401).json({ error: "unauthorized user" });

    let { email, fullName, phone, password } = req.body;

    const name = fullName.trim();
    email = email.toLowerCase();

    phone = phone ? phone.trim() : "";

    const exists = await sql`
      SELECT EXISTS(SELECT 1 FROM users WHERE email=${email}) AS exists;
    `;

    if (exists[0].exists)
      return res.status(409).json({ error: "admin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO users(name,email,phone,role,password)
      VALUES (${name},${email},${phone},'admin',${hashed})
      RETURNING *;
    `;

    const u = result[0];

    const token = jwt.sign(
      { sub: u.user_id, name: u.name, email: u.email, role: u.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h", jwtid: uuidv4() }
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

    res.status(201).send("admin registered successfully");
  } catch (err) {
    console.log("Admin resgistration failed: ", err.message);
    return res.status(400).json({ error: "Internal server error" });
  }
};

module.exports = {
  login,
  logout,
  profile,
  customer,
  admin,
  authentication,
  deleteProfile,
};
