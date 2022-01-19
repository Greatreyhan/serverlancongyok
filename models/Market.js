const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema;

const marketSchema = new mongoose.Schema({
    imageUrl : {
        type: String,
        required : true
    },
    name : {
        type: String,
        required : true
    },
    description : {
        type: String,
        required : true
    },
    price : {
        type: Number,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    weight : {
        type: Number,
        required : true
    },
    typeId :[{
        type: ObjectId,
        ref: 'type'
    }],
    link :{
        type: String,
        required: true
    }

})

module.exports = mongoose.model('imageUrl', marketSchema)