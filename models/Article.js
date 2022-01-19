const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema;

const articleSchema = new mongoose.Schema({
    title : {
        type: String,
        required : true
    },
    content : {
        type: String,
        required : true
    },
    date : {
        type: Date,
        required : true
    },
    imageUrl : {
        type : String,
        required : true
    },
    reader: {
        type: Number,
        default: 0
    },
    description : {
        type: String,
        required : true
    },
    authorId : [{
        type : ObjectId,
        ref : 'Author'
    }],
    tagId : [{
        type : ObjectId,
        ref: 'Tag'
    }],

})

module.exports = mongoose.model('Article', articleSchema)