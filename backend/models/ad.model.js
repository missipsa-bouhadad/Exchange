import mongoose, {Types as SchemaTypes} from "mongoose";

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
        enum: ["GOOD", "SKILL"],
        required:true,
    },
    city:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        default:""
    },
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ["AVAILABLE", "EXCHANGED"],
        default: "AVAILABLE"
    },




},{timestamps:true})


export const Ad=mongoose.model("Ad",adSchema)