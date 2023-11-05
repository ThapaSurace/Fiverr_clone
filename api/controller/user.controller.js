import User from "../model/user.model.js";
import createError from "../utils/createError.js";

//get all users
export const getUsers = async (req, res, next) => {
  try {
    const userType = req.query.userType; // 'seller', 'non-seller', or undefined for all

    let userQuery = {};
    if (userType === 'seller') {
      userQuery.isSeller = true;
    } else if (userType === 'non-seller') {
      userQuery.isSeller = false;
    }
    userQuery.isAdmin = { $ne: true };
    const users = await User.find(userQuery).select("-password");
    if (!users) return next(createError(400, "Users not found!!"));
    // const { password, ...others } = users._doc;
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

//get a user
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(400, "Users not found!!"));
    const { password, ...others } = user._doc;
    res.status(200).send(others);
  } catch (err) {
    next(err);
  }
};


//delete user
export const deleteUser = async (req,res,next) => {
  try {
    if(!req.isAdmin) return next(createError(404,"Only Admin can delete user"))
    const result = await User.findByIdAndDelete(req.params.id)
    if(!result) return next(createError(404,"User not found!"))
    res.status(204).send("user removed successfully")
  } catch (err) {
    next(err)
  }
}


//get number of user compared to last month
export const compareUserCount = async (req, res, next) => {
  const currentDate = new Date();

  // Calculate the previous month's date range
  const lastMonth = new Date(currentDate);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const previousMonth = new Date(lastMonth);
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  try {
    // Calculate the number of all users registered in the previous month
    const clientUserCountPreviousMonth = await User.countDocuments({
      createdAt: { $gte: previousMonth, $lt: lastMonth },
      isSeller: false
    });

    // Calculate the number of all users registered in the current month
    const clientUserCountCurrentMonth = await User.countDocuments({
      createdAt: { $gte: lastMonth, $lt: currentDate },
      isSeller: false
    });

    // Calculate the number of seller users registered in the previous month
    const sellerUserCountPreviousMonth = await User.countDocuments({
      createdAt: { $gte: previousMonth, $lt: lastMonth },
      isSeller: true,
    });

    console.log(sellerUserCountPreviousMonth)

    // Calculate the number of seller users registered in the current month
    const sellerUserCountCurrentMonth = await User.countDocuments({
      createdAt: { $gte: lastMonth, $lt: currentDate },
      isSeller: true,
    });

    const result = {
      previousMonth: {
        clientUsers: clientUserCountPreviousMonth,
        sellerUsers: sellerUserCountPreviousMonth,
      },
      currentMonth: {
        clientUsers: clientUserCountCurrentMonth,
        sellerUsers: sellerUserCountCurrentMonth,
      },
    };

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
