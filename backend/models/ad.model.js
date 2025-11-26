import mongoose from "mongoose";

const adSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true,
        unique:true
    },
    category:{
        type:String,
        required:true
    },
    user_id: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: ""
    },




},{timestamps:true}) //timestamps pour ajouter createdAt et updatedAt


export const Ad=mongoose.model("Ad",adSchema)