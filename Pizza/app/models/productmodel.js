const mongoose = require("mongoose");

const product=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:'category',
    },
    description:{
        type:String,
    },
    status:{
        type:Boolean,
        required:true,
        default:true
    },
    regular_price:{
        type:Number,
        required:true,
    },
    discount_price:{
        type:Number,
        default:0
    }
},{timestamps:true})

module.exports.Product = new mongoose.model('product',product);