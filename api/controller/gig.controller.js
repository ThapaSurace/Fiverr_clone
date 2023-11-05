import Gig from "../model/gig.model.js";
import createError from "../utils/createError.js";
import similarity from 'cosine-similarity';

//create new gig
export const createGig = async (req, res, next) => {
  if (!req.isSeller && !req.isAdmin)
    return next(createError(403, "Only sellers can create a gig"));

  try {
    const newGig = new Gig({
      userId: req.userId,
      ...req.body,
    });
    const savedGig = await newGig.save();
    res.status(201).send(savedGig);
  } catch (err) {
    next(err);
  }
};

//delete gig
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id)
    if(gig.userId !== req.userId) return next(createError(403,"Only gid's owner can delete the gig"))

    await Gig.findByIdAndDelete(req.params.id)
    res.status(200).send("Deleted Successfully!")
  } catch (err) {
    next(err)
  }
};


//get single gig
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("userId")
    if(!gig) next(createError(400,"Gig not found!!"))
    res.status(200).send(gig)
  } catch (err) {
    next(err)
  }
};


// update gig
export const updateGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only sellers can update a gig"));

  const gigId = req.params.gigId; // Assuming you're passing the gigId as a URL parameter

  try {
    const updatedGig = await Gig.findByIdAndUpdate(
      gigId,
      {
        // Update the properties you want to change
        ...req.body,
      },
      { new: true } // This option ensures that the updated gig is returned
    );

    if (!updatedGig) {
      return next(createError(404, "Gig not found"));
    }

    res.status(200).send(updatedGig);
  } catch (err) {
    next(err);
  }
};


//get releated gigs
export const relatedGigs = async (req,res,next) => {
  try {
  const singleGig = await Gig.findById(req.params.id)
  const limit = req.query.limit ? parseInt(req.params.limit): 5

  const gig = await Gig.find({_id:{$ne:singleGig},cat:singleGig.cat}) // ne = not equal
  .limit(limit)
  if(!gig) return next(createError(400,"Gig not found!"))
  res.status(200).send(gig)
    
  } catch (err) {
    next(err)
  }
}


//getting gig
export const getGigs = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: parseFloat(q.min) }),
        ...(q.max && { $lt: parseFloat(q.max) }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };

  const sortOptions = {};
  if (q.sort === 'rating') {
    sortOptions.rating = -1; // Sort by rating in descending order
  } else {
    sortOptions.createdAt = -1; // Sort by createdAt field in descending order as default
  }

  try {
    const gigs = await Gig.aggregate([
      {
        $addFields: {
          rating: {
            $cond: {
              if: { $eq: ['$starNumber', 0] },
              then: 0,
              else: { $divide: ['$totalStars', '$starNumber'] },
            },
          },
        },
      },
      {
        $match: filters,
      },
      {
        $sort: sortOptions,
      },
    ]);

    res.status(200).send(gigs);
  } catch (err) {
    next(err);
  }
};




// content based filtering
export const contentBasedRecomm = async (req,res,next) => {
   try {
    const gigId = req.params.gigId;
    const limit = parseInt(req.query.limit) || 5;

    // Retrieve the target gig
    const targetGig = await Gig.findById(gigId);

    // Extract relevant attributes from the target gig
    const { cat, desc, shortTitle, shortDesc, features } = targetGig;

    // Search for similar gigs based on the extracted attributes
    const similarGigs = await Gig.find({
      $or: [
        { cat },
        { desc },
        { shortTitle },
        { shortDesc },
        { features: { $in: features } },
      ],
      _id: { $ne: gigId }, // Exclude the target gig from recommendations
    }).limit(limit);

    // Calculate similarity scores using Jaccard similarity
    const similarityScores = similarGigs.map(gig => {
      const gigAttributes = [gig.cat, gig.desc, gig.shortTitle, gig.shortDesc, ...gig.features];
      const targetAttributes = [cat, desc, shortTitle, shortDesc, ...features];
      return jaccardSimilarity(gigAttributes, targetAttributes);
    });

    // Sort gigs based on similarity scores in descending order
    similarGigs.sort((a, b) => similarityScores[similarGigs.indexOf(b)] - similarityScores[similarGigs.indexOf(a)]);

    // Return the top-N recommended gigs
    const recommendations = similarGigs.slice(0, limit);
    res.status(200).send(recommendations);
   } catch (err) {
    next(err)
   }
}


// Calculate cosine similarity between two vectors
function calculateCosineSimilarity(vectorA, vectorB) {
  return similarity(vectorA, vectorB);
}

export const recomendation = async(req,res,next) => {
  try {
    const { averageRating, cat } = req.query;


    const gigs = await Gig.find().exec();

    const filteredGigs = gigs.filter(gig => gig.cat === cat);


  // Calculate cosine similarity for each gig
  const similarities = filteredGigs.map(gig => ({
    gig,
    similarity: calculateCosineSimilarity(
      [Number(averageRating), gig.cat === cat ? 1 : 0],
      [gig.averageRating, gig.cat === cat ? 1 : 0]
    ),
  }));

  // Sort the gigs based on similarity in descending order
  similarities.sort((a, b) => b.similarity - a.similarity);

  // Recommended gigs based on cosine similarity
  const recommendedGigs = similarities.map(similarity => similarity.gig);

  res.json(recommendedGigs);
    
  } catch (err) {
    next(err)
  }
}



// Jaccard similarity calculation
function jaccardSimilarity(setA, setB) {
  const intersection = setA.filter(attribute => setB.includes(attribute));
  const union = [...new Set([...setA, ...setB])];
  return intersection.length / union.length;
}
