import connectDB from "./database/db.js";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import adRoute from "./routes/ad.route.js";
import requestRoute from "./routes/request.route.js";

dotenv.config()
const app=express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use('/api/v1/user',userRoute)
app.use("/api/v1/chats", chatRoute);
app.use('/api/v1/ad', adRoute)
app.use("/api/v1/requests", requestRoute);


export default app;