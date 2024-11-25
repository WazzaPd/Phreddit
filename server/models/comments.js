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
    }]
});

module.exports = mongoose.model("Comment", commentSchema);