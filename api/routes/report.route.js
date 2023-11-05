import express from "express"
import { getReports, postReport } from "../controller/report.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"
const router = express.Router()

router.post("/report",verifyToken,postReport)

router.get("/reports",verifyToken,getReports)

export default router