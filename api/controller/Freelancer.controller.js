import Freelancer from "../model/Freelancer.model.js";
import User from "../model/user.model.js";
import createError from "../utils/createError.js";

export const addFreelancer = async (req, res, next) => {
  try {
    const freelancer = new Freelancer({
      userId: req.userId,
      ...req.body,
    });
    const savedFreelancer = await freelancer.save();

    await User.findByIdAndUpdate(
      req.userId,
      { $set: { isSeller: true } },
      { new: true }
    );
    res.status(200).send(savedFreelancer);
  } catch (err) {
    next(err);
  }
};

export const getFreelancers = async (req, res, next) => {
  try {
    const freelancer = await Freelancer.find()
    res.status(200).send(freelancer);
  } catch (err) {
    next(err);
  }
};

export const getFreelancer = async (req,res,next) => {
  try {
    const userId = req.params.id;

    const freelancer = await Freelancer.findOne({ userId }).populate('userId');
    if (!freelancer) return next(createError(400, "Not found!!"));
    res.status(200).send(freelancer);
  } catch (err) {
    next(err)
  }
}

export const recomendation = async (req, res, next) => {
  try {
    const { freelancerId } = req.params;

    // Fetch all freelancers and their skills
    const freelancers = await Freelancer.find().select("name skills ratings");

    if (freelancers.length <= 1) {
      return res
        .status(400)
        .json({
          error: "Insufficient freelancers to calculate recommendations.",
        });
    }

    // Create a matrix of freelancer ratings
    const matrix = freelancers.reduce((matrix, { _id, skills, ratings }) => {
      matrix[_id] = { skills, ratings };
      return matrix;
    }, {});

    // Calculate the similarities between freelancers
    const freelancerSimilarities = {};
    Object.keys(matrix).forEach((freelancer1) => {
      Object.keys(matrix).forEach((freelancer2) => {
        if (freelancer1 === freelancer2) return;
        if (
          freelancerSimilarities[freelancer1] &&
          freelancerSimilarities[freelancer1][freelancer2]
        )
          return;
        if (!freelancerSimilarities[freelancer1])
          freelancerSimilarities[freelancer1] = {};

        const numerator = calculateSimilarity(
          matrix[freelancer1].skills,
          matrix[freelancer2].skills
        );
        const denominator = Math.sqrt(
          matrix[freelancer1].ratings * matrix[freelancer2].ratings
        );
        freelancerSimilarities[freelancer1][freelancer2] =
          numerator / denominator;
      });
    });

    // Generate recommendations for the given freelancer
    const freelancerRatings = matrix[freelancerId];
    if (!freelancerRatings) {
      return res.status(404).json({ error: "Freelancer not found." });
    }

    const freelancerScores = {};
    Object.keys(freelancerRatings).forEach((freelancer1) => {
      if (!freelancerSimilarities[freelancer1]) {
        return; // Skip if there are no similarities calculated for freelancer1
      }

      Object.keys(freelancerSimilarities[freelancer1]).forEach(
        (freelancer2) => {
          if (freelancerRatings[freelancer2]) return;
          if (!freelancerScores[freelancer2]) freelancerScores[freelancer2] = 0;
          freelancerScores[freelancer2] +=
            freelancerSimilarities[freelancer1][freelancer2];
        }
      );
    });

    const recommendations = Object.keys(freelancerScores).sort(
      (a, b) => freelancerScores[b] - freelancerScores[a]
    );

    res.status(200).send(recommendations);
  } catch (err) {
    next(err);
  }
};

function calculateSimilarity(skills1, skills2) {
  const intersection = skills1.filter((skill) => skills2.includes(skill));
  const similarity =
    intersection.length / Math.sqrt(skills1.length * skills2.length);
  return similarity;
}
