import Order from "../model/order.model.js";
import Review from "../model/review.model.js";
import Gig from "../model/gig.model.js";
import createError from "../utils/createError.js";

export const getCollabrativeRecomm = async (req, res, next) => {
  const userId = req.userId;
  try {
    const recommendations = await getRecommendationsForUser(userId);
    if (!recommendations) return next(createError(404, "Nothing to recommend!!"));
    res.status(200).send(recommendations);
  } catch (err) {
    next(err);
  }
};

async function getRecommendationsForUser(userId) {
  // Step 1: Retrieve user's order history
  const userOrderHistory = await Order.find({ buyerId: userId }).lean();

  // console.log(userOrderHistory);

  // Step 2: Retrieve user's reviewed gigs
  const userReviewedGigs = await Review.find({ userId: userId }).lean();

  // console.log(userReviewedGigs)

  // Combine order history and reviewed gigs data
  const allUserGigs = [
    ...userOrderHistory.map((order) => order.gigId),
    ...userReviewedGigs.map((review) => review.gigId),
  ];

  // console.log(allUserGigs)

  // Step 3: Remove duplicates from the combined list
  const uniqueUserGigs = [...new Set(allUserGigs)];

  // console.log(uniqueUserGigs);

  // Step 4: Calculate average ratings for gigs
  const gigs = await Gig.find({ _id: { $in: uniqueUserGigs } });
  const gigsWithRatings = [];

  // Loop through gigs and calculate and store average ratings
  gigs.forEach((gig) => {
    const averageRating = gig.averageRating; // Access the virtual property
    gigsWithRatings.push({
      gigId: gig._id,
      averageRating: averageRating,
    });
  });
  // console.log(gigsWithRatings);

  // Step 5: Find similar users based on order history and reviews
  const similarUsers = await findSimilarUsers(userId);

  // Step 6: Retrieve order histories of similar users
  const similarUsersOrderHistories = await Order.find({
    buyerId: { $in: similarUsers },
  }).lean();

  // console.log(similarUsersOrderHistories)

  // Combine order histories of similar users with the user's own order history
  const allUserAndSimilarOrderHistories = [
    ...userOrderHistory,
    ...similarUsersOrderHistories,
  ];

  // console.log(allUserAndSimilarOrderHistories)

  // Step 7: Calculate similarity scores between the user and similar users
  const similarityScores = calculateSimilarityScores(
    userId,
    similarUsers,
    allUserAndSimilarOrderHistories
  );

  // console.log(similarityScores);

  // Step 8: Generate weighted recommendations using collaborative filtering
  const recommendedGigs = generateWeightedRecommendations(
    gigsWithRatings,
    similarityScores,
    userOrderHistory,
    similarUsersOrderHistories
  );

  // console.log(recommendedGigs);

  // Step 9: Display recommendations
  return recommendedGigs;
}

async function findSimilarUsers(userId) {
  // For this basic example, we'll find similar users by looking for users who have purchased similar gigs.
  const userOrderHistory = await Order.find({ buyerId: userId }).lean();
  const userGigs = userOrderHistory.map((order) => order.gigId);

  // Find other users who have purchased the same gigs as the current user
  const similarUsersOrderHistory = await Order.find({
    buyerId: { $ne: userId },
    gigId: { $in: userGigs },
  })
    .distinct("buyerId")
    .lean();


  return similarUsersOrderHistory;
}

function calculateSimilarityScores(userId, similarUsers, allOrderHistories) {
  // For this basic example, we'll calculate the Jaccard similarity between the current user and similar users.
  const userOrderSet = new Set(
    allOrderHistories
      .filter((order) => order.buyerId === userId)
      .map((order) => order.gigId)
  );

  const similarityScores = {};
  similarUsers.forEach((user) => {
    const similarUserOrderSet = new Set(
      allOrderHistories
        .filter((order) => order.buyerId === user)
        .map((order) => order.gigId)
    );
    const intersection = new Set(
      [...userOrderSet].filter((gigId) => similarUserOrderSet.has(gigId))
    );
    const union = new Set([...userOrderSet, ...similarUserOrderSet]);
    const similarity = intersection.size / union.size;
    similarityScores[user] = similarity;
  });

  return similarityScores;
}

function generateWeightedRecommendations(
  gigsWithRatings,
  similarityScores,
  userOrderHistory,
  similarUsersOrderHistories
) {
  const userOrderedGigs = new Set(
    userOrderHistory.map((order) => order.gigId)
  );

  const similarUsersGigs = new Set(
    similarUsersOrderHistories.map((order) => order.gigId)
  );


  const recommendedGigs = gigsWithRatings
    .filter(
      (gig) =>
        !userOrderedGigs.has(gig.gigId) &&
        similarUsersGigs.has(gig.gigId) // Filter gigs from similar users
    )
    .map((gig) => {
      const weightedRating = gig.averageRating * 0.8;
      const similarity = similarityScores[gig.userId] || 0;
      const weightedSimilarity = similarity * 0.2;
      const finalScore = weightedRating + weightedSimilarity;
      return { ...gig, recommendationScore: finalScore };
    });

  recommendedGigs.sort((a, b) => b.recommendationScore - a.recommendationScore);

  return recommendedGigs;
}