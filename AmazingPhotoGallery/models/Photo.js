const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

let photoSchema = mongoose.Schema(
    {
        tags: {type: String, required: true, unique: false},
        path: {type: String, required: true, unique: false},
        album: {type: ObjectId, required: true, unique: false , ref: "Album"}
    }
);

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;