const mongoose = require('mongoose');
const encryption = require('./../utilities/encryption');
const ObjectId = mongoose.Schema.Types.ObjectId;

let userSchema = mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        passwordHash: {type: String, required: true},
        fullName: {type: String, required: true},
        salt: {type: String, required: true},
        profilePicture: {type: String, default: "/images/profilePictures/defaultProfilePicture.png"},
        albums: [{type: ObjectId, ref: "Album"}],
        isAdmin: {type: Boolean, default: false}
    }
);

userSchema.method ({
   authenticate: function (password) {
       let inputPasswordHash = encryption.hashPassword(password, this.salt);
       let isSamePasswordHash = inputPasswordHash === this.passwordHash;

       return isSamePasswordHash;
   }
});

const User = mongoose.model('User', userSchema);

module.exports = User;



