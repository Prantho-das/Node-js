const mongoose=require("mongoose")

const categorySchema=new mongoose.Schema({
    category_name:{
        type:String,
        required:true
    },
    category_status:{
        type:Boolean,
        required:true,
        default:true
    }
},{timestamps:true})
module.exports.Category=mongoose.model('category',categorySchema)