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
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0],
        },
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
    availabilityStart: {
        type: Date,
        required: true
    },
    availabilityEnd: {
        type: Date,
        required: true
    },
    exchangeWith: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["AVAILABLE", "EXCHANGED"],
        default: "AVAILABLE"
    },
},{timestamps:true})

// 2dsphere index for geo queries ($geoNear, $near, $within)
adSchema.index({ location: "2dsphere" });


export const Ad=mongoose.model("Ad",adSchema)