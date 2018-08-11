var mongoose=require('mongoose')
var Schema =mongoose.Schema
var bookSchema = new Schema({
    userId:{
        type:String
    },
    bookId:{
        type:String
    },
    bookName:{
        type:String
    }
})
module.exports=mongoose.model('book',bookSchema)