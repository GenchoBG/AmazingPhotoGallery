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
            Album.find({}).populate('author').limit(10).sort({'likes': -1}).then(top => {
                res.render('home/index', {albums: albums, top: top});
            });
        });
    },
    getSearchResults: (req, res) => {
        let searchtags = req.body.searchtags.split(',');
        Album.find({}).then(albums => {
            let returnAlbums = [];
            for (album of albums){
                for(tag of searchtags){
                    if(album.name.includes(tag) || album.tags.includes(tag) || album.theme.includes(tag)){
                        returnAlbums.push(album);
                        console.log(album.name);
                    }
                }
            }
            Album.find({}).populate('author').limit(10).sort({'likes': -1}).then(top => {
                res.render('home/index', {albums: returnAlbums, top: top});
            });
        });
    }
};