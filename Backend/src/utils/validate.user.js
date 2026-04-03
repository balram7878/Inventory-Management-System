const validators = require("validator");
require("dotenv").config();

const registrationValidation = ({ fullName, email, password, phone }) => {
 
  if (!fullName || typeof fullName !== "string")
    throw new Error("full name is required");

  const nameTrimmed = fullName.trim();

  if (nameTrimmed.length > 50 || nameTrimmed.length < 3)
    throw new Error("full name must be between 3 and 20 characters");
  if (!/^[A-Za-z\s]+$/.test(nameTrimmed)) {
    throw new Error("full name can contain only letters and spaces");
  }

  if (!email) throw new Error("email is required");
  if (!validators.isEmail(email)) throw new Error("invalid email formet");

  if (!password) throw new Error("password is provided");
  if (
    !validators.isStrongPassword(password, {
      minLength: 8,
      minSymbols: 0,
      minNumbers: 1,
      minLowercase: 1,
      minUppercase: 1,
    })
  )
    throw new Error(
      "password must be stronger (min 8 chars, numbers & letters required)"
    );

};

const loginValidation = ({ email, password }) => {
  if (!email || !password) throw new Error("invalid credential");
  if (email.length > 100 || email.length <= 7)
    throw new Error("invalid credential");
  if (!email.includes("@")) throw new Error("invalid credential");
  if (password.length > 100 || password.length < 6)
    throw new Error("invalid credential");
};

module.exports = { registrationValidation, loginValidation };
