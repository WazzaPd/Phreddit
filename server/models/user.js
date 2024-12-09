const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    name: { type: String, required: true, unique: true }, // Display name (Username)
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    reputation: { type: Number, default: 100 },
    communities: [{
        type: mongoose.SchemaTypes.ObjectID,
        ref: "Community"
    }]
}, { timestamps: true });


UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
