const Album = require('mongoose').model('Album');

module.exports = {
  index: (req, res) => {
      Album.find({}).populate('author').then(albums => {
          res.render('home/index', {albums: albums});
      });
  }
};