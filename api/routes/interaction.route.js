import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { createInteraction } from "../controller/interaction.controller.js"

const router = express.Router()

router.post("/itemrecomm",verifyToken,createInteraction)

export default router