import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { createMessage, getMessages } from "../controller/message.controller.js"
const router = express.Router()

router.post("/message",verifyToken,createMessage)

router.get("/messages/:id",verifyToken,getMessages)

export default router