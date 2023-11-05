import express from "express"
const router = express.Router()
import { addFreelancer, getFreelancer, getFreelancers, recomendation } from "../controller/Freelancer.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

router.post("/freelancer",verifyToken,addFreelancer)
router.get("/freelancer",getFreelancers)
router.get("/freelancer/:id",getFreelancer)


router.get("/freelancers/:freelancerId/recommendations",recomendation)

export default router