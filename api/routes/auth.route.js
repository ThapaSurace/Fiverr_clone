import express from "express"
import { login, logout, register, verifyEmail } from "../controller/auth.controller.js"
import { userValidation,validation } from "../utils/validator.js"

const router = express.Router()

router.post("/auth/register",userValidation,validation,register)

router.post("/auth/login",login)

router.post("/auth/verifyEmail",verifyEmail)

router.post("/auth/logout",logout)

export default router