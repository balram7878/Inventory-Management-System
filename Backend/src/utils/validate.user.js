const validators = require("validator");
require("dotenv").config();

const registrationValidation = ({ fullName, email, password }) => {
  if (!fullName) throw new Error("full name not provided");
  if (fullName.length > 20 || fullName.length < 3)
    throw new Error("full name must be between 3 and 20 characters");

  if (!email) throw new Error("email not provided");
  if (!validators.isEmail(email)) throw new Error("invalid email");
  if (!password) throw new Error("password not provided");
  if (!validators.isStrongPassword(password, { minLength: 8, minSymbols: 0 }))
    throw new Error(
      "password must be stronger (min 8 chars, numbers & letters required)"
    );
  
};

const loginValidation = ({ email, password }) => {
  if (!email) throw new Error("email not provided");
  if (!password) throw new Error("password not provided");
};

module.exports = { registrationValidation, loginValidation };
