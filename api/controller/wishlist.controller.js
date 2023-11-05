import Wishlist from "../model/wishlist.model.js";
import createError from "../utils/createError.js";

export const addToWishlist = async (req, res, next) => {
  const userId = req.userId;
  const gigId = req.body.gigId;

  try {
    const existingWishlist = await Wishlist.findOneAndDelete({
      userId: userId,
      gigId: gigId,
    });

    if (existingWishlist) {
      res.status(200).send({ message: "Item removed from wishlist." });
    } else {
      const wishlist = new Wishlist({
        userId,
        gigId,
      });
      const savedWishlist = await wishlist.save();
      res.status(200).send({ message: "Item Added to wishlist." });
    }
  } catch (err) {
    next(err);
  }
};

//get user wishlist
export const getWishlist = async (req, res, next) => {
  const userId = req.userId;
  try {
    const wishlists = await Wishlist.find({ userId: req.userId }).populate(
      "gigId"
    );
    res.status(200).send(wishlists);
  } catch (err) {
    next(err);
  }
};
