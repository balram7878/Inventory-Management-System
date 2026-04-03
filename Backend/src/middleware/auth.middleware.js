const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
  return process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
};

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: token missing" });
  }

  try {
    const jwtSecret = getJwtSecret();

    if (!jwtSecret) {
      return res.status(500).json({ message: "Server misconfiguration: JWT secret is missing" });
    }

    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: access denied" });
    }
    return next();
  };
};

module.exports = { protect, authorize };
