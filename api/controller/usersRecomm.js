import User from "../model/user.model.js";
import Order from "../model/order.model.js";
import Gig from "../model/gig.model.js"

async function calculateUserSimilarity(targetUserId) {
  try {
    const targetUserPurchases = await Order.find({ buyerId: targetUserId });
    const targetUserCategories = targetUserPurchases.map(order => order.cat);

    const allUsersWithPurchases = await User.find({ _id: { $ne: targetUserId } });

    const similarityScores = await Promise.all(allUsersWithPurchases.map(async user => {
      const userPurchases = await Order.find({ buyerId: user._id });
      const userCategories = userPurchases.map(order => order.cat);

      const commonCategories = targetUserCategories.filter(cat => userCategories.includes(cat)).length;
      const similarity = commonCategories / Math.sqrt(targetUserCategories.length * userCategories.length);

      return { userId: user._id, similarity };
    }));

    similarityScores.sort((a, b) => b.similarity - a.similarity);
    return similarityScores;
  } catch (error) {
    throw error;
  }
}


export const getUserRecomm = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const similarUsersWithScores = await calculateUserSimilarity(userId);
    const userOrders = await Order.find({ buyerId: userId });
    const purchasedCategories = userOrders.map(order => order.cat);
    const userOrderedGigIds = userOrders.map(order => order.gigId);

    const recommendedGigs = [];
    const uniqueGigIds = new Set(); // Use a Set to store unique gig IDs

    for (const userScore of similarUsersWithScores) {
      const { userId: similarUserId, similarity } = userScore;
      const userGigs = await Order.find({
        buyerId: similarUserId,
        cat: { $in: purchasedCategories },
        gigId: { $nin: userOrderedGigIds },
      });

      for (const gig of userGigs) {
        // Check if the gig ID is unique before adding it to recommendedGigs
        if (!uniqueGigIds.has(gig.gigId)) {
          // Fetch the Gig model and calculate the average rating
          const gigDetails = await Gig.findOne({ _id: gig.gigId });
          const averageRating = gigDetails.averageRating;

          // Include the similarity score and average rating in the recommended gig object
          recommendedGigs.push({ gigId: gig.gigId, similarity, averageRating });
          uniqueGigIds.add(gig.gigId); // Add the gig ID to the Set
        }
      }
    }

    // Sort recommended gigs first by averageRating (highest to lowest), then by similarity (highest to lowest)
    recommendedGigs.sort((a, b) => {
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }
      return b.similarity - a.similarity;
    });

    res.send(recommendedGigs);
  } catch (err) {
    next(err);
  }
};





// export const getUserRecomm = async (req, res, next) => {
//   const userId = req.params.userId;
//   try {
//     const similarUsersWithScores = await calculateUserSimilarity(userId);
//     const userOrders = await Order.find({ buyerId: userId });
//     const purchasedCategories = userOrders.map(order => order.cat);
//     const userOrderedGigIds = userOrders.map(order => order.gigId);

//     const recommendedGigs = [];
//     const uniqueGigIds = new Set(); // Use a Set to store unique gig IDs

//     for (const userScore of similarUsersWithScores) {
//       const { userId: similarUserId, similarity } = userScore;
//       const userGigs = await Order.find({
//         buyerId: similarUserId,
//         cat: { $in: purchasedCategories },
//         gigId: { $nin: userOrderedGigIds },
//       });

//       userGigs.forEach(gig => {
//         // Check if the gig ID is unique before adding it to recommendedGigs
//         if (!uniqueGigIds.has(gig.gigId)) {
//           // Include the similarity score in the recommended gig object
//           recommendedGigs.push({ gigId: gig.gigId, similarity });
//           uniqueGigIds.add(gig.gigId); // Add the gig ID to the Set
//         }
//       });
//     }

//     recommendedGigs.sort((a, b) => b.similarity - a.similarity);

//     res.send(recommendedGigs);
//   } catch (err) {
//     next(err);
//   }
// };