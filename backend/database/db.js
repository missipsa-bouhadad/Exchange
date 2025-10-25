import mongoose from 'mongoose';
const connectDB=async()=>{
    {
        try {
            await mongoose.connect(process.env.MONGO_URI)
            console.log("mongodb conected succefully");
            
        } catch (error) {
            console.log("mongodb connexion failed",error);
            
        }
    }
}

export default connectDB