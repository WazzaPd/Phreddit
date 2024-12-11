// Comment Document Schema
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    commentedBy: {
        type: String,
        required: true
    },
    commentedDate: {
        type: Date,
        default: () => Date.now(),
        required: true
    },
    commentIDs: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Comment"
    }],
    votes: {
        type: Number,
        default: 0,
        required: true
    }
});

module.exports = mongoose.model("Comment", commentSchema);