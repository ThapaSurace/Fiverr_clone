import Order from "../model/order.model.js";
import Gig from "../model/gig.model.js";
import createError from "../utils/createError.js";
import Stripe from "stripe";
import { createNotification } from "./notification.controller.js";
import mongoose from "mongoose";

// create new order
export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);
  const gig = await Gig.findById(req.params.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = new Order({
    gigId: gig._id,
    title: gig.title,
    cat: gig.cat,
    price: gig.price,
    cover: gig.cover,
    shortDesc: gig.shortDesc,
    buyerId: req.userId,
    sellerId: gig.userId,
    totalPrice: req.body.totalPrice,
    deliveryTime: gig.deliveryTime,
    quantity: req.body.quantity,
    revisionNumber: gig.revisionNumber,
    payment_intent: paymentIntent.id,
  });
  try {
    await newOrder.save();
    await createNotification(
      gig.userId,
      "Your have received a new order",
      newOrder._id
    );

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    next(err);
  }
};

// geting orders
export const getOrder = async (req, res, next) => {
  try {
    let orders;

    if (req.isAdmin) {
      // If the user is an admin, fetch all orders
      orders = await Order.find({ isCompleted: true }).sort({ createdAt: -1 });
    } else {
      // If the user is not an admin, fetch orders based on role
      orders = await Order.find({
        ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
        isCompleted: true,
      }).sort({ createdAt: -1 });
    }

    const ordersWithDeliveryInfo = orders.map((order) => {
      const deliveryDate = order.deliveryDate;
      const remainingDays = order.remainingDays;
      const deliveryStatus = remainingDays <= 0 ? "late" : order.deliveryStatus;
      return {
        ...order.toObject(),
        deliveryDate,
        remainingDays,
        deliveryStatus,
      };
    });

    res.status(200).send(ordersWithDeliveryInfo);
  } catch (err) {
    next(err);
  }
};

//get single order
export const getSingleOrder = async (req, res, next) => {
  try {
    let order;

    if (mongoose.isValidObjectId(req.params.id)) {
      // If the id is a valid ObjectId, fetch by ID
      order = await Order.findById(req.params.id).populate("gigId");
    } else {
      // If not a valid ObjectId, treat it as payment_intent and fetch accordingly
      order = await Order.findOne({ payment_intent: req.params.id }).populate(
        "gigId"
      );
    }

    if (!order) return next(createError(400, "Order not found!"));
    res.status(200).send(order);
  } catch (err) {
    next(err);
  }
};

// confirm order payment
export const confirm = async (req, res, next) => {
  try {
    await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};

//cancel order
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);

    // Check if the order is already completed or canceled
    if (order.status === "canceled") {
      return next(
        createError(400, "Order has already been completed or canceled.")
      );
    }

    // Update order status to "canceled"
    order.status = "canceled";
    await order.save();

    res.status(200).send(order);
  } catch (err) {
    next(err);
  }
};

//order requirement by buyer
export const createBuyerRequirement = async (req, res, next) => {
  const orderId = req.params.orderId;
  const { document, description } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          clientRequirements: {
            document,
            description,
          },
        },
      },
      { new: true } // Return the updated document
    );

    if (!order) return next(createError(400, "Order not found!"));
    res.status(200).send(order);
  } catch (err) {
    next(err);
  }
};

//Seller delivers the order
export const deliveredBySeller = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const { document, description } = req.body; // Assuming you're sending finishedProduct data in the request body

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          deliveredBySeller: true,
          deliveryStatus: "delivered", // Mark order as delivered
          finishedProduct: {
            document,
            description,
          },
        },
      },
      { new: true } // Return the updated document
    );

    if (!order) return next(createError(400, "Order not found!"));

    await createNotification(
      order.buyerId,
      "Your order has been delivered!",
      order._id
    );

    res.status(200).send(order);
  } catch (err) {
    next(err);
  }
};

//order approve or not
export const approvedByBuyer = async (req, res, next) => {
  const { revisionTitle, revisionDesc } = req.body;
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).send("Order not found");
    }

    if (revisionTitle && revisionDesc) {
      await Order.findByIdAndUpdate(
        order._id,
        {
          $set: {
            revisionReason: {
              revisionTitle,
              revisionDesc,
            },
            revisionNumber: Math.max(0, order.revisionNumber - 1),
          },
        },
        { new: true } // Return the updated document
      );
      await createNotification(
        order.sellerId,
        `Your work has been rejected by client. ${revisionTitle}`,
        order._id
      );
      res.status(200).send("Order has been disapproved by buyer");
    } else {
      await Order.findByIdAndUpdate(
        order._id,
        {
          $set: {
            acceptedByBuyer: true,
            status: "completed",
          },
        },
        { new: true } // Return the updated document
      );
      await createNotification(
        order.sellerId,
        "Your work has been approved by client!",
        order._id
      );
      res.status(200).send("Order has been approved by buyer");
    }
  } catch (err) {
    next(err);
  }
};

// getting order number
export const noOfOrder = async (req, res, next) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  // Calculate the previous month's date range
  const lastMonth = new Date(currentDate);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const previousMonth = new Date(lastMonth);
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  try {
    if (req.isAdmin) {
      // Calculate the number of orders for all sellers for the previous month
      const numOrdersPreviousMonth = await Order.countDocuments({
        createdAt: { $gte: previousMonth, $lt: lastMonth },
        isCompleted: true,
      });

      // Calculate the number of orders for all sellers for the current month
      const numOrdersCurrentMonth = await Order.countDocuments({
        createdAt: { $gte: lastMonth, $lt: currentDate },
        isCompleted: true,
      });

      // Prepare the comparison result for all sellers
      const comparisonResult = {
        previousMonth: numOrdersPreviousMonth,
        currentMonth: numOrdersCurrentMonth,
      };

      res.status(200).send(comparisonResult);
    } else if (req.isSeller) {
      // Calculate the number of orders for the specific seller for the previous month
      const numOrdersPreviousMonth = await Order.countDocuments({
        createdAt: { $gte: previousMonth, $lt: lastMonth },
        isCompleted: true,
        sellerId: req.userId,
      });

      // Calculate the number of orders for the specific seller for the current month
      const numOrdersCurrentMonth = await Order.countDocuments({
        createdAt: { $gte: lastMonth, $lt: currentDate },
        isCompleted: true,
        sellerId: req.userId,
      });

      // Prepare the comparison result for the specific seller
      const comparisonResult = {
        previousMonth: numOrdersPreviousMonth,
        currentMonth: numOrdersCurrentMonth,
      };

      res.status(200).send(comparisonResult);
    } else {
      return next(
        createError(403, "You do not have permission to access this")
      );
    }
  } catch (err) {
    next(err);
  }
};

// get income
export const compareIncome = async (req, res, next) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  // Calculate the previous month's date range
  const lastMonth = new Date(currentDate);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const previousMonth = new Date(lastMonth);
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  try {
    if (req.isAdmin) {
      // Calculate the income for all sellers for the previous month
      const incomePreviousMonth = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: previousMonth, $lt: lastMonth },
            status: "completed",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]);

      // Calculate the income for all sellers for the current month
      const incomeCurrentMonth = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: lastMonth, $lt: currentDate },
            status: "completed"
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]);

      const result = {
        previousMonthTotalIncome:
          incomePreviousMonth.length > 0 ? incomePreviousMonth[0].total : 0,
        currentMonthTotalIncome:
          incomeCurrentMonth.length > 0 ? incomeCurrentMonth[0].total : 0,
      };

      res.status(200).send(result);
    } else if (req.isSeller) {
      // Calculate the income for the specific seller for the previous month
      const incomePreviousMonth = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: previousMonth, $lt: lastMonth },
            status: "completed",
            sellerId: req.userId,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]);

      // Calculate the income for the specific seller for the current month
      const incomeCurrentMonth = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: lastMonth, $lt: currentDate },
            status: "completed",
            sellerId: req.userId,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]);

      const result = {
        previousMonthTotalIncome:
          incomePreviousMonth.length > 0 ? incomePreviousMonth[0].total : 0,
        currentMonthTotalIncome:
          incomeCurrentMonth.length > 0 ? incomeCurrentMonth[0].total : 0,
      };

      res.status(200).send(result);
    } else {
      return next(
        createError(403, "You do not have permission to access this")
      );
    }
  } catch (err) {
    next(err);
  }
};

//get total income
export const getTotalIncome = async (req, res, next) => {
  const sellerId = req.userId
  try {
    if (req.isSeller) {
      const totalIncome = await Order.aggregate([
        {
          $match: {
            sellerId: sellerId,
            status: "completed", // You may want to filter by order status here
          },
        },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: "$totalPrice" },
          },
        },
      ]);

      if (totalIncome.length === 0) {
        return res.send({ totalIncome: 0 });
      }

      return res.send({ totalIncome: totalIncome[0].totalIncome });
    } else if (req.isAdmin) {
      // Use MongoDB's aggregation framework to calculate the total income for all orders
      const totalIncome = await Order.aggregate([
        {
          $match: {
            status: "completed", // You may want to filter by order status here
          },
        },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: "$totalPrice" },
          },
        },
      ]);

      if (totalIncome.length === 0) {
        return res.json({ totalIncome: 0 });
      }

      return res.json({ totalIncome: totalIncome[0].totalIncome });
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }
  } catch (err) {
    next(err);
  }
};



//get remaning number of orders and icome of that orders
export const getRemaningOrder = async (req,res,next) => {
  const sellerId = req.userId
  try {
    if(req.isSeller){
      const incompleteOrders = await Order.find({
        sellerId: sellerId,
        status: { $ne: "completed" }, // Filter for orders with status not equal to "completed"
      });
  
      // Calculate the income from incomplete orders
      const totalIncome = incompleteOrders.reduce(
        (acc, order) => acc + order.totalPrice,
        0
      );
  
      // Return the number of incomplete orders and their income
      res.json({
        numberOfIncompleteOrders: incompleteOrders.length,
        totalIncomeFromIncompleteOrders: totalIncome,
      });
    }else if (req.isAdmin){
      const incompleteOrders = await Order.find({
        status: { $ne: "completed" }, // Filter for orders with status not equal to "completed"
      });
  
      // Calculate the income from incomplete orders
      const totalIncome = incompleteOrders.reduce(
        (acc, order) => acc + order.totalPrice,
        0
      );
  
      // Return the number of incomplete orders and their income
      res.json({
        numberOfIncompleteOrders: incompleteOrders.length,
        totalIncomeFromIncompleteOrders: totalIncome,
      });
    }
  } catch (err) {
    next(err)
  }
}