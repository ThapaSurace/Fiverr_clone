import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { addToWishlist, getWishlist } from "../controller/wishlist.controller.js"

const router = express.Router()

router.post("/wishlist",verifyToken,addToWishlist)

router.get("/wishlists",verifyToken,getWishlist)

export default router