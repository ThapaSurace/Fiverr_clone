import Notification from "../model/notification.model.js"


export const createNotification = async (userId, message, orderId) => {
    const newNotification = new Notification({
      userId,
      message,
      orderId,
      status: "unread",
    });
    await newNotification.save();
  };


export const getNotification = async (req,res,next) => {
    try {
        const notify = await Notification.find({userId:req.params.id}).populate("userId").sort({ createdAt: -1 }).exec()
        res.status(200).send(notify)
    } catch (err) {
        next(err)
    }
}


export const updateStatus = async (req,res,next) => {
    const notificationId = req.params.id
    try {
         await Notification.findByIdAndUpdate(
            notificationId,
            {
              $set: {
                status: "read",
              },
            },
            { new: true } // Return the updated document
          );   

          res.status(200).send("Status updated Successfully")
    } catch (err) {
        next(err)
    }
}



export const deleteNotification = async (req,res,next) => {
    try {
        await Notification.findByIdAndDelete(req.params.id)
        res.status(200).send("Notification is deleted")
    } catch (err) {
        next(err)
    }
}