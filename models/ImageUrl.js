const mongoose = require('mongoose')

const imageUrlSchema = new mongoose.Schema({
    imageLink : {
        type: String,
        required : true
    },
    title : {
        type: String,
        required : true
    },
    date : {
        type : Date,
        required : true
    }

})

module.exports = mongoose.model('ImageUrl', imageUrlSchema)