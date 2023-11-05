import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export const userRegisterValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters long!")
    .test(
      "is-alphabetical",
      "username must start with an alphabetical character",
      (value) => /^[A-Za-z]/.test(value)
    ),
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8)
    .matches(passwordRules, { message: "Please create strong password" })
    .required("Required"),
  country: yup.string().required("Country is required"),
});

export const userLoginValidation = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters long!")
    .test(
      "is-alphabetical",
      "username must start with an alphabetical character",
      (value) => /^[A-Za-z]/.test(value)
    ),
  password: yup
    .string()
    .required("Required"),
});


export const gigValidation = yup.object().shape({
  title: yup.string()
    .required("Title is required")
    .test(
      "is-alphabetical",
      "username must start with an alphabetical character",
      (value) => /^[A-Za-z]/.test(value)
    )
    .min(20, "Title must be at least 20 characters long"),
});