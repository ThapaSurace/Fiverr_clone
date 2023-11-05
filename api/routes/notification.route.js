import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { deleteNotification, getNotification, updateStatus } from "../controller/notification.controller.js"
const router = express.Router()

router.get("/notification/:id",verifyToken,getNotification)

router.delete("/notification/:id",verifyToken,deleteNotification)

router.put("/notification/:id",verifyToken,updateStatus)

export default router