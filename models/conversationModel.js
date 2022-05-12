const mongoose  = require("mongoose");



const conversationSchema= new mongoose.Schema({
    recipients:[{type: mongoose.Types.ObjectId, ref:"Users"}],
    text: {
        type: String
    },
    media:{
        type: Array
    } ,
    call: {type: Object

    }
},{
    timestamps: true
})


module.exports = mongoose.model('conversation', conversationSchema);