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
    const { email, password } = req.body;

    const userResult = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1;
    `;

    if (userResult.length === 0) throw new Error("user not exist");

    const u = userResult[0];

    const isPasswordValid = await bcrypt.compare(password, u.password);
    if (!isPasswordValid) throw new Error("invalid credential");

    const token = jwt.sign(
      { sub: u.user_id, name: u.name, email: u.email, role: u.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h", jwtid: uuidv4() }
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

    res.status(200).json({
      name: u.name,
      email: u.email,
      status: "login successfully",
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    await client.set(`bl:${req.user.jti}`, "blocked");
    await client.expireAt(`bl:${req.user.jti}`, req.user.exp);

    res.cookie("token", null, { expiresIn: new Date(Date.now()) });
    res.status(200).send("logout successfully");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const profile = async (req, res) => {
  try {
    const { email } = req.user;

    const result = await sql`
      SELECT user_id, name, email, phone, role, created_at
      FROM users
      WHERE email = ${email}
      LIMIT 1;
    `;

    if (result.length === 0) {
      return res.status(401).json({ error: "user not found" });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.sub;

    const result = await sql`
      DELETE FROM users WHERE user_id = ${userId} RETURNING *;
    `;

    if (result.length === 0)
      return res.status(404).json({ message: "User not found" });

    await sql`DELETE FROM users WHERE user_id = ${userId};`;

    res.status(200).json({ message: "user deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error: " + err.message });
  }
};

const authentication = (req, res) => {
  try {
    res.status(200).json({
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      message: "authenticated user",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const customer = async (req, res) => {
  try {
    registrationValidation(req.body);

    const { fullName, email, phone, password } = req.body;

    const exists = await sql`
      SELECT EXISTS(SELECT 1 FROM users WHERE email = ${email}) AS exists;
    `;

    if (exists[0].exists)
      return res.status(409).json({ error: "User already exists" });
 
    const hashedPassword = await bcrypt.hash(password, 10);
 
    const result = await sql`
      INSERT INTO users (name, email, phone, role, password)
      VALUES (${fullName}, ${email}, ${phone}, 'customer', ${hashedPassword})
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
    res.status(400).json({ error: err.message });
  }
};

const admin = async (req, res) => {
  try {

    if (req.role !== "admin")
      return res.status(401).json({ error: "unauthorized user" });

    registrationValidation(req.body);

    const { email, fullName, phone, password } = req.body;

    const exists = await sql`
      SELECT EXISTS(SELECT 1 FROM users WHERE email=${email}) AS exists;
    `;

    if (exists[0].exists)
      return res.status(409).json({ error: "admin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO users(name,email,phone,role,password)
      VALUES (${fullName},${email},${phone},'admin',${hashed})
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
    res.status(400).json({ error: err.message });
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
