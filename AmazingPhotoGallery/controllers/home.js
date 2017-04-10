const Album = require('mongoose').model('Album');
const User = require('mongoose').model('User');
const encryption = require('./../utilities/encryption');

module.exports = {
    index: (req, res) => {
        User.findOne({isAdmin: true}).then(user => {
            if (!user) {
                let salt = encryption.generateSalt();
                adminProperties = {
                    email: "admin@admin.com",
                    passwordHash: encryption.hashPassword('admin', salt),
                    fullName: "Admin",
                    albums: [],
                    salt: salt,
                    isAdmin: true
                };
                User.create(adminProperties).then(()=> {
                    console.log("Admin created!");
                });
            }
        });

        Album.find({}).populate('author').then(albums => {
            for (let album of albums){

            }
            res.render('home/index', {albums: albums});
        });
    }
};