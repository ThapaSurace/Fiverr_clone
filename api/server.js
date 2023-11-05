import express from "express";
import dotenv from "dotenv"
dotenv.config()
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"
import { dbConnection } from "./config/dbConfig.js";
import conversationRoute from "./routes/conversation.route.js"
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import orderRoute from "./routes/order.route.js"
import gigRoute from "./routes/gig.route.js"
import messageRoute from "./routes/message.route.js"
import reviewRoute from "./routes/review.route.js"
import freelancerRoute from "./routes/Freelancer.route.js"
import recommRoute from "./routes/recommendation.route.js"
import wishlistRoute from "./routes/wishlist.route.js"
import interactionRoute from "./routes/interaction.route.js"
import reportRoute from "./routes/report.route.js"
import notificationRoute from "./routes/notification.route.js"


const PORT = process.env.PORT || 4500
const app = express()

//databse connection
dbConnection()
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())


app.get("/",(req,res)=>{
    res.send("Welcome to home")
})

//routes
app.use("/api",conversationRoute)
app.use("/api",authRoute)
app.use("/api",userRoute)
app.use("/api",orderRoute)
app.use("/api",gigRoute)
app.use("/api",messageRoute)
app.use("/api",reviewRoute)
app.use("/api",freelancerRoute)
app.use("/api",recommRoute)
app.use("/api",wishlistRoute)
app.use("/api",interactionRoute)
app.use("/api",reportRoute)
app.use("/api",notificationRoute)


app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
  
    return res.status(errorStatus).send(errorMessage);
  });
  

mongoose.connection.once("open",()=>{
    console.log("connected to mongo database")
    app.listen(PORT,()=>{
        console.log(`Server running at port ${PORT}`)
    })
})

