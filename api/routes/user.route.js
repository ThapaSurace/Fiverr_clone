import express from "express"
import { compareUserCount, deleteUser, getUser, getUsers } from "../controller/user.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"
const router = express.Router()

router.get("/users",getUsers)

router.get("/user/:id",getUser)

router.delete("/user/:id",verifyToken,deleteUser)

router.get("/compareusercount",verifyToken,compareUserCount)

export default router