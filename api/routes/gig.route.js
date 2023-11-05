import express from "express"
import { createGig, deleteGig, getGig, getGigs, recomendation, relatedGigs, updateGig } from "../controller/gig.controller.js"
import {verifyToken} from "../middleware/verifyToken.js"

const router = express.Router()

router.post("/gig",verifyToken,createGig)

router.get("/gig/single/:id",getGig)

router.get("/gigs",getGigs)

router.delete("/gig/:id",verifyToken,deleteGig)

router.put("/gig/:gigId",verifyToken,updateGig)


router.get("/relatedgigs/:id",relatedGigs)

router.get("/recommend",recomendation)


export default router