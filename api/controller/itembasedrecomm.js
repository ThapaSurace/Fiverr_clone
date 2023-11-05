import Interaction from "../model/interaction.model.js";
import Gig from "../model/gig.model.js";

export const getItemBasedRecomendation = async (req, res, next) => {

  try {
    const targetGigId = req.params.id;
    const currentUserId = req.userId;

    // Find the target gig
    const targetGig = await Gig.findById(targetGigId);
    if (!targetGig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Find gigs similar to the target gig based on interactions
    const interactions = await Interaction.find({ userId: currentUserId });

    // Extract an array of gig IDs the current user has interacted with
    const interactedGigIds = interactions.map(interaction => interaction.gigId);

    // Find similar gigs excluding the ones the user has already interacted with
    const similarGigs = await Gig.find({
      _id: { $nin: [targetGigId, ...interactedGigIds] }, // Exclude target and interacted gigs
      cat: targetGig.cat,
    });

    // Calculate cosine similarity scores and store in an array of scored gigs
    const scoredGigs = similarGigs.map(gig => ({
      gig,
      score: calculateCosineSimilarity(targetGig, gig),
    }));

    // Sort gigs by similarity score in descending order
    scoredGigs.sort((a, b) => b.score - a.score);

    // console.log(scoredGigs)

    // Get the top 5 recommended gigs
    const recommendedGigs = scoredGigs.slice(0, 5).map(item => item.gig);

    res.send(recommendedGigs)
  } catch (err) {
    next(err);
  }
};


function calculateCosineSimilarity(gigA, gigB) {
  const avgRatingA = gigA.averageRating;
  const avgRatingB = gigB.averageRating;
  const categoryMatch = gigA.cat === gigB.cat ? 1 : 0;
  const titleSimilarity = calculateTitleSimilarity(gigA.title, gigB.title);

  console.log(titleSimilarity)

  // Calculate the dot product
  const dotProduct = avgRatingA * avgRatingB + categoryMatch + titleSimilarity;

  // Calculate the magnitudes
  const magnitudeA = Math.sqrt(
    avgRatingA * avgRatingA + categoryMatch * categoryMatch + titleSimilarity * titleSimilarity
  );
  const magnitudeB = Math.sqrt(avgRatingB * avgRatingB + categoryMatch * categoryMatch + titleSimilarity * titleSimilarity);

  // Calculate the cosine similarity
  return dotProduct / (magnitudeA * magnitudeB);
}

// Function to calculate title similarity (e.g., Jaccard similarity)
// function calculateTitleSimilarity(titleA, titleB) {
//   const setA = new Set(titleA.split(' '));
//   const setB = new Set(titleB.split(' '));
//   const intersection = new Set([...setA].filter(x => setB.has(x)));
//   const union = new Set([...setA, ...setB]);
//   return intersection.size / union.size;
// }


function calculateTitleSimilarity(titleA, titleB) {
  // Tokenize the titles into sets of words
  const tokensA = new Set(titleA.split(' '));
  const tokensB = new Set(titleB.split(' '));

  // Calculate the intersection of tokens
  const intersection = new Set([...tokensA].filter(token => tokensB.has(token)));

  // Calculate the union of tokens
  const union = new Set([...tokensA, ...tokensB]);

  // Calculate the Jaccard similarity
  const jaccardSimilarity = intersection.size / union.size;

  return jaccardSimilarity;
}
