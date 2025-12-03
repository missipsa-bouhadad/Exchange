import connectDB from './database/db.js'
import app from "./app.js";

const PORT=process.env.PORT || 3000

app.listen(PORT,()=>{
    connectDB()
    console.log(`server is listening at ${PORT}`)
})