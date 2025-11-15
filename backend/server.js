import dotenv from 'dotenv'
import express from 'express'
import connectDB from './database/db.js'
import userRoute from './routes/user.route.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()
const app=express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

const PORT=process.env.PORT || 3000

app.use('/api/v1/user',userRoute)

app.listen(PORT,()=>{
    connectDB()
    console.log(`server is listening at ${PORT}`)
})