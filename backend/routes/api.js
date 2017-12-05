
var Class = require('../models/class');

module.exports = function(router, passport) {

    router.post('/register',
        passport.authenticate('local-signup'),
        function(req, res) {
            res.status(200).json({ user: req.user.email
        });
    });

    router.post('/login',
        passport.authenticate('local-login'),
        function(req, res) {
            console.log(req.isAuthenticated());
            res.status(200).json({ user: req.user.email
        });
    });

    router.get('/profile',
        isLoggedIn,
        function(req, res) {
            console.log(req.isAuthenticated());
            res.status(200).json({ user: req.user, message: "Welcome!"
        });
    });

    router.get('/logout', function(req, res) {
        req.logOut();
        res.status(200).json({ message: "logged out "});
    });


    router.get('/home', function(req, res) {
        res.status(200).json(req.user.classes);

    });

    router.put('/add-class', function(req, res){
        var user = req.user;

        if(!req.hasOwnProperty("body")){
            res.status(500).json({message:"body not found"});
        }
        var request = req.body;
        if(!request.hasOwnProperty("course")){
            res.status(500).json({message: "invalid post information", send: request.body})
        }
        else{
            var updateUser = require('mongoose').model('User');
            var updatedUser = user;
            updatedUser.classes.push(request.course);

            updateUser.findByIdAndUpdate(user, updatedUser, {new: true}, function (err, result) {
                res.send('yes');
            });
        }


    });

    router.post('/create-class', function(req, res){
        var user = req.user;
        if(!req.hasOwnProperty("body")){
            res.status(500).json({message:"body not found"});
        }
        var request = req.body;
        var is_instructor = user.is_instructor;
        if(is_instructor){
            if(!request.hasOwnProperty("course")){
                res.status(500).json({message: "invalid post information", send: request.body})
            }
            else{
                var newClass = new Class();
                newClass.course = request.course;
                newClass.instructor = [user.email];

                newClass.save(function(err) {
                    res.status(200).json({message: "success"});
                });

            }

        }
        else{
            res.status(500).json({message: "Permission denied"});

        }

    });

    return router;
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: "unable to auth" });
}
