import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
import { sendEmail } from "../utils/sendEmail.js";
import otpGenerator from "otp-generator";

//register
export const register = async (req, res, next) => {
  try {
    const hashPassword = bcrypt.hashSync(req.body.password, 10);

    //generate otp
    const otpLength = 6; // You can adjust the length as needed
    const otpOptions = {
      upperCase: false, // Whether to include uppercase letters
      specialChars: false, // Whether to include special characters
      alphabets: false, // Whether to include alphabets (lowercase)
    };

    const otpCode = otpGenerator.generate(otpLength, otpOptions);

    const newUser = new User({
      ...req.body,
      password: hashPassword,
      otp: otpCode,
    });

    const savedUser = await newUser.save();

    const url = `${process.env.CLIENT_URL}/emailconfirmation`;
    sendEmail({
      from: "no-reply@expressecommerce.com",
      to: savedUser.email,
      subject: "Email verification link",
      text: `Hello \n\n please verify your account by clicking using below opt code`, // gives http://localhost:4000/api/conformation/token
      html: `<html>
      <head>
        <style>
          h2 {
            color: #007bff; /* Heading text color */
          }
          p {
            font-size: 16px; /* Font size for text */
            margin-top: 4px;
            font-weight: bold;
          }
          a {
            text-decoration: none;
            background-color: #007bff;
            color: #fff;
            padding: 5px 10px;
            border-radius: 4px;
            display: inline-block;
          }
          span {
            font-weight: bold;
            font-size: 18px;
            display: block; /* Display on a new line */
            margin: 10px 0px; /* Add some space between "OR" and the link */
          }
        </style>
      </head>
      <body>
        <h2>Email Verification</h2>
        <p>Otp Code: ${otpCode}</p>
        <span>OR</span>
        <p>Click below link to verify your email.</p>
        <a href="${url}">Verify email</a>
      </body>
    </html>`,
    });

    res.status(200).send(savedUser);
  } catch (err) {
    next(err);
  }
};

//verify user's email
export const verifyEmail = async (req,res,next) => {
  try {
    const otpCode = req.body.otp;
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(createError(400,"User not found!!"))
    }

    const storedOTP = user.otp;

    if (otpCode !== storedOTP) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    user.verified = true;
    await user.save();

    return res.status(200).json({ message: 'User verified successfully' });

  } catch (err) {
    next(err)
  }
}

//login
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "Username doesnt exists!"));

    const matchPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!matchPassword) return next(createError(400, "Password doesnt match!"));

    if(!user.verified) return next(createError(400,"Email is not verified!!"))

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY
    );

    const { password, ...others } = user._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(others);
  } catch (err) {
    next(err);
  }
};

//logout
export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
    })
    .status(200)
    .send("User has been logged out!");
};
