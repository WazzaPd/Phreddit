// LinkFlair Document Schema
const mongoose = require('mongoose');

const linkflairSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("LinkFlair", linkflairSchema);