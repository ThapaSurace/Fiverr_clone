import Interaction from "../model/interaction.model.js";

export const createInteraction = async (req, res, next) => {
  const existingInteraction = await Interaction.findOne({
    userId: req.userId,
    gigId: req.body.gigId,
  });

  if (existingInteraction) {
    return res
      .status(400)
      .json({ message: "Interaction already exists for this user and gig." });
  }
  const interaction = new Interaction({
    userId: req.userId,
    gigId: req.body.gigId,
    clicked: true,
    reviewed: req.body.reviewed,
  });

  try {
    const savedInteraction = await interaction.save();
    res.status(200).send(savedInteraction);
  } catch (err) {
    next(err);
  }
};
