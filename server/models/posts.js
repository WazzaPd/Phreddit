// Post Document Schema

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    postedBy: {
        type: String,
        required: true
    },
    postedDate: {
        type: Date,
        default: () => Date.now(),
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    votes: {
        type: Number,
        default: 0,
        required: true
    },
    linkFlairID: mongoose.SchemaTypes.ObjectID,
    commentIDs: [{
        type: mongoose.SchemaTypes.ObjectID,
        ref: "Comment"
    }]
})

module.exports = mongoose.model("Post", postSchema);