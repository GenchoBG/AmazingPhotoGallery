const userController = require('./../controllers/user');
const homeController = require('./../controllers/home');
const albumController = require('./../controllers/album');

module.exports = (app) => {
    app.get('/', homeController.index);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logout);

    app.get('/user/details', userController.details);

    app.get('/album/create', albumController.createGet);
    app.post('/album/create', albumController.createPost);

    app.get('/album/details/:id', albumController.detailsGet);

    app.get('/album/addphoto/:id', albumController.addphotoGet);
    app.post('/album/addphoto/:id', albumController.addphotoPost);

    app.get('/album/delete/:id', albumController.delete);

    app.get('/album/edit/:id', albumController.editGet);
};

