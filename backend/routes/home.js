"use strict";

var secrets = require('../../config/secrets');

module.exports = function (router) {


    var homeRoute = router.route('/');

    homeRoute.get(function (req, res) {
        var connectionString = secrets.token;
        res.json({ message: 'My connection string is test' + connectionString });
    });

    var create = require('../controllers/userController');
    router.route('/users/:id')
        .get(User.get_a_user)
        .put(User.update_a_user)
        .delete(User.remove_a_user);

    router.route('/users')
        .get(User.list_all_users)
        .post(User.create_a_user);

    var Task = require('../controllers/taskController');
    router.route('/tasks/:id')
        .get(Task.get_a_task)
        .put(Task.update_a_task)
        .delete(Task.remove_a_task);

    router.route('/tasks')
        .get(Task.list_all_tasks)
        .post(Task.create_a_task);

    return router;
};
