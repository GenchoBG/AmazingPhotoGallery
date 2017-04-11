const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

let albumSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        theme: {type: String, required: true},
        tags: {type: String, required: true},
        author: {type: ObjectId, required: true, ref: 'User'},
        photos: [{type: ObjectId, ref: "Photo"}],
        likes: {type: Number, default: 0}
    }
);

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;