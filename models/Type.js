const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema;

const typeSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    marketId : [{
        type : ObjectId,
        ref : 'market'
    }],


})

module.exports = mongoose.model('Tag', tagSchema)