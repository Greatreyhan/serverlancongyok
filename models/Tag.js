const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema;

const tagSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    articleId : [{
        type : ObjectId,
        ref : 'Article'
    }],


})

module.exports = mongoose.model('Tag', tagSchema)