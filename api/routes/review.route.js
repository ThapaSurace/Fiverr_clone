import express from "express"
import { countReviewsForGig, createReview, deleteReview, getReview, replyComment } from "../controller/review.controller.js"
import {verifyToken} from "../middleware/verifyToken.js"
const router = express.Router()

router.post("/review",verifyToken,createReview)

router.get("/reviews/:gigId",getReview)

router.put("/review/:id/replies",replyComment)

router.delete("/review/:id",deleteReview)

router.get("/countreview/:gigId",countReviewsForGig)

export default router