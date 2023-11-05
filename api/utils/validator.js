import { check, validationResult } from "express-validator";
import User from "../model/user.model.js"

export const userValidation = [
  check("username", "username is required")
    .notEmpty()
    .matches(/^\D/).withMessage('Username must start with a letter')
    .isLength({ min: 2 })
    .withMessage("username must be atleast 2 character")
    .custom((value)=> {
      return User.findOne({ username: value }).then(user => {
        if (user) {
          return Promise.reject("username already exists");
        }
      });
    }),
    check("email","email is required")
    .custom((value)=> {
      return User.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject("Email already exists");
        }
      });
    }),
];

export const validation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    return res.status(400).json({ error: errors.array()[0].msg }); // 0 means display single error...one error at a time
  }
};
