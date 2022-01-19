const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema;

const authorSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    imageUrl : {
        type: String,
        required : true
    },
    occupation : {
        type: String,
        required : true
    },
    city: {
        type: String,
        required : true
    },
    instagram : {
        type: String,
        required : true
    },
    twitter : {
        type: String,
        required : true
    },
    linkedin : {
        type: String,
        required : true
    },
    articleId : [{
        type : ObjectId,
        ref : 'Article'
    }],


})

module.exports = mongoose.model('Author', authorSchema)