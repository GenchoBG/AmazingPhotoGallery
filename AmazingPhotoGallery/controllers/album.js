const User = require('mongoose').model('User');
const Album = require('mongoose').model('Album');
const Photo = require('mongoose').model('Photo');

module.exports = {
    createGet: (req, res) => {
        if (!req.user) {
            res.redirect('/user/login');
        }
        res.render('album/create');
    },

    createPost: (req, res) => {
        let albumArgs = req.body;

        let errorMsg = '';

        if (!req.isAuthenticated()) {
            errorMsg = "You should be logged in to make albums!";
        } else if (!albumArgs.name) {
            errorMsg = "Invalid name!";
        } else if (!albumArgs.theme) {
            errorMsg = "Invalid theme!";
        } else if (!albumArgs.tags) {
            errorMsg = "Invalid tags!";
        }

        if (errorMsg) {
            res.render('album/create', {error: errorMsg});
            return;
        }


        //for (let key in yourobject) {
        //    if (yourobject.hasOwnProperty(key)) {
        //        console.log(key, yourobject[key]);
        //    }
        //}


        albumArgs["author"] = req.user;
        Album.create(albumArgs).then(album => {
            req.user.albums.push(album.id);
            req.user.save(err => {
                if (err) {
                    res.redirect('/', {error: err.message});
                } else {
                    res.redirect('/');
                }
            })
        });

    },

    detailsGet: (req, res) => {
        let id = req.params.id;

        Album.findById(id).populate("author").populate("photos").then(album => {
            if (req.user && (req.user.albums.indexOf(album.id) > -1 || req.user.isAdmin)) {
                album["hasRights"] = true;
            }
            res.render('album/details', album);
        })
    },

    addphotoGet: (req, res) => {
        Album.findById(req.params.id).then(album => {
            res.render('album/addphoto', album);
        });
    },

    addphotoPost: (req, res) => {
        let id = req.params.id;

        Album.findById(id).populate("author").populate("photos").then(album => {

            let photoArgs = req.body;

            let picture = req.files.picture;

            let path = "/images/album/" + album.name + album.photos.length + picture.name;

            picture.mv("./public" + path, err => {
                if (err) {
                    console.log(err.message);
                }
            });

            photoArgs["path"] = path;
            photoArgs["album"] = album.id;

            Photo.create(photoArgs).then(photo => {
                album.photos.push(photo.id);
                album.save(err => {
                    if (err) {
                        console.log(err.message);
                    }
                })
            });

            res.redirect('/album/details/' + album.id);
        })
    },

    delete: (req, res) => {
        let id = req.params.id;

        Album.findById(id).populate("author").populate("photos").then(album => {
            if (!(req.user && (req.user.albums.indexOf(album.id) > -1 || req.user.isAdmin))) {
                res.redirect('/');
            }
        });


        Album.findById(id).populate("author").populate("photos").then(album => {
            let author = album.author;

            for (let photo of album.photos) {
                console.log(photo.id);
                Photo.findOneAndRemove({_id: photo.id}).then(photo => {
                    photo.save();
                });
            }

            let index = author.albums.indexOf(album.id);


            if (index < 0) {
                console.log("Error - Album " + album.name + " was not found for author" + author.fullName);
            } else {
                author.albums.splice(index, 1);
                author.save();
            }

        });

        Album.findOneAndRemove({_id: id}).populate("author").populate("photos").then(user => {
            res.redirect('/');
        });
    },

    editGet: (req, res) => {
        let id = req.params.id;

        Album.findById(id).populate("author").populate("photos").then(album => {
            if (!(req.user && (req.user.albums.indexOf(album.id) > -1 || req.user.isAdmin))) {
                res.redirect('/');
            } else {
                res.render('album/edit', album);
            }
        });


    },

    editPost: (req, res) => {
        let id = req.params.id;

        let args = req.body;

        Album.findById(id).populate("author").populate("photos").then(album => {
            if (req.user && (req.user.albums.indexOf(album.id) > -1 || req.user.isAdmin)) {
                Album.update({_id: id}, {
                    $set: {
                        name: args.name,
                        theme: args.theme,
                        tags: args.tags
                    }
                }).then(updateStatus => {
                    res.redirect('/album/details/' + id);
                });
            }
            res.redirect('/album/details/' + id);
        });
    }
};