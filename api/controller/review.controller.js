import Review from "../model/review.model.js";
import createError from "../utils/createError.js";
import Gig from "../model/gig.model.js"

//create review
export const createReview = async (req, res, next) => {
  if (req.isSeller)
    return next(createError(403, "Seller cannot create a review"));

  const newReview = new Review({
    userId: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    communicationRating: req.body.communicationRating,
    serviceDescriptionRating: req.body.serviceDescriptionRating,
    recommendationRating: req.body.recommendationRating,
  });

  try {
    const savedReview = await newReview.save()

    const totalStars = (
      req.body.communicationRating +
      req.body.serviceDescriptionRating +
      req.body.recommendationRating
    )/3;
    
    await Gig.findByIdAndUpdate(req.body.gigId,{
        $inc: { totalStars:totalStars, starNumber: 1 }
    });


    res.status(201).send(savedReview);
  } catch (err) {
    next(err);
  }
};


//get review according to gig id
export const getReview = async (req, res, next) => {
  try {
    const reviews = await Review.find({gigId: req.params.gigId}).populate("replies.userId")
    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};


//reply comment
export const replyComment = async (req,res,next) => {
  const { id } = req.params;
  const reply = {
    userId: req.body.userId,
    replyText: req.body.replyText,
    createdAt: new Date(),
  };
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $push: { replies: reply } },
      { new: true }
    );
    res.status(201).send(updatedReview);
    
  } catch (err) {
    next(err)
  }
}

//delete review
export const deleteReview = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};


//count gig
export const countReviewsForGig = async (req, res, next) => {
  const gigId = req.params.gigId; // Extract gigId from route parameters
  try {
    const reviewCount = await Review.countDocuments({ gigId });
    res.status(200).json({ count: reviewCount });
  } catch (err) {
    next(err);
  }
};