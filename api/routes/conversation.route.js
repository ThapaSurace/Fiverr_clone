import express from "express"
const router = express.Router()
import {verifyToken} from "../middleware/verifyToken.js"
import { createConversation, getConversation, getConversations, updateConversation } from "../controller/conservation.controller.js"

router.post("/conversation",verifyToken,createConversation)

router.get("/conversations",verifyToken,getConversations)

router.get("/conversation/:id",verifyToken,getConversation)

router.put("/conversation/:id",verifyToken,updateConversation)

export default router