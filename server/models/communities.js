// Community Document Schema
const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: ()=> Date.now(), 
        required: true
    },
    members: [{
        type: String,
        required: true
    }],
    memberCount: {
        type: Number,
        default: 1
    },
    postIDs: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Post"
    }]
});

module.exports = mongoose.model("Community", communitySchema);