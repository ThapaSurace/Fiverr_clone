import express from "express"
import { getCollabrativeRecomm } from "../controller/collabrativerecomm.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"
import { getItemBasedRecomendation } from "../controller/itembasedrecomm.js"
import { getUserRecomm } from "../controller/usersRecomm.js"
const router = express.Router()

router.get("/recommendations",verifyToken,getCollabrativeRecomm)

router.get("/itemrecomendations/:id",verifyToken,getItemBasedRecomendation)

router.get("/userrecomm/:userId",getUserRecomm)

export default router