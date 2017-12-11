
var Class = require('../models/class');
var Session = require('../models/session');
var randomString = require('random-string');
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

    router.get('/logout',
        function(req, res) {
        req.logOut();
        res.status(200).json({ message: "logged out "});
    });


    router.get('/home',
        isLoggedIn,
        function(req, res) {
        res.status(200).json({course_title: req.user.classes, course_id: req.user.course_ids});

    });

    router.post('/end-class',
        isLoggedIn,
        function(req, res){
            var user = req.user;
            var request = req.body;
            if(!req.hasOwnProperty("body")){
                res.status(500).json({message:"body not found"});
            }
            var is_instructor = user.is_instructor;
            if(is_instructor) {
                var courseId = request.course;
                var existing_class = require('mongoose').model('Class');
                // ?
                var session = require('mongoose').model('Session');
                console.log(courseId);
                existing_class.findOne({course_id: courseId, active: true}, function(err, result){
                    if(err || result === null){
                        res.status(404).json({message: "Error in processing, either class does not exist or is already active"})
                    }
                    else {
                        // initialization
                        existing_class.findOneAndUpdate({course_id: courseId}, {$set: {active: false}},function (err, result) {
                            if (err || result === null){
                                console.log("not found");
                                console.log(result);
                            }
                            else{
                                console.log(result);
                            }
                        });
                        var session_num = result.sessions - 1;
                        session.findOneAndUpdate({course_id:courseId, session_num: session_num}, {$set: {active: false}},
                            function(err, result){
                                if(err){
                                    res.status(500).json({message: "error ending session"})

                                }
                                else{
                                    res.status(200).json({message: "successfully ended!"});
                                }

                            });




                    }


                });


            }
            else{
                res.status(400).json({message: "is not instructor"})
            }


        });

    router.post('/start-class',
        isLoggedIn,
        function(req, res){
        var user = req.user;
        var request = req.body;
        if(!req.hasOwnProperty("body")){
            res.status(500).json({message:"body not found"});
        }
        var is_instructor = user.is_instructor;
        if(is_instructor) {
            var courseId = request.course;
            var existing_class = require('mongoose').model('Class');
            // ?
            var session = require('mongoose').model('Session');
            console.log(courseId);
            existing_class.findOne({course_id: courseId, active: false}, function(err, result){
                if(err || result === null){
                    res.status(404).json({message: "Error in processing, either class does not exist or is already active"})
                }
                else {
                    // initialization
                    var new_sessions = result.sessions + 1;
                    console.log(courseId);
                    existing_class.findOneAndUpdate({course_id: courseId}, {$set: {active: true, sessions: new_sessions}},function (err, result) {
                        if (err || result === null){
                            console.log("not found");
                            console.log(result);
                        }
                        else{
                            console.log(result);
                        }
                    });

                    var newSession = Session();

                    newSession.course_id = courseId;
                    newSession.active = true;
                    newSession.upvotes = 0;
                    newSession.questions = [];
                    newSession.session_num = result.sessions;
                    newSession.save(function(err){
                        if(err){
                            res.status(500).json({message: "error creating session"})

                        }
                        else{
                            res.status(200).json({message: "successfully created!"});
                        }
                    });


                }


            });


        }
        else{
            res.status(400).json({message: "is not instructor"})
        }


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
            // course will be the courseId only
            var courseId = request.course;
            // will check if class exists
            var existing_class = require('mongoose').model('Class');
            existing_class.findOne({course_id: courseId}, function(err, result){
                if(err || result === null){
                    res.send('Class not found');
                }
                else{
                    var course_name = result.course;
                    // adds course title
                    updatedUser.classes.push(course_name);
                    // adds course id
                    updatedUser.course_ids.push(courseId);

                    updateUser.findByIdAndUpdate(user, updatedUser, {new: true}, function (err, result) {
                        res.send(course_name + ' added!');
                    });

                }
            });

        }


    });
    //creates class
    // will create class with user as instructor and unique courseId
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
            else {
                //recursively finds unique courseID
                function uniqueId(res){
                    var newCourseId = randomString();
                    var existing_class = require('mongoose').model('Class');
                    existing_class.findOne({course_id: newCourseId}, function(err){
                        if(err){
                            uniqueId();
                        }
                        var newClass = new Class();
                        newClass.course = request.course;
                        newClass.instructor = [user.email];
                        newClass.course_id = newCourseId;
                        newClass.sessions = 0;
                        newClass.active = false;

                        newClass.save(function(err) {
                            res.status(200).json({message: newCourseId});
                        });
                    })
                }
                uniqueId(res);

            }

        }
        else{
            res.status(500).json({message: "Permission denied"});

        }
    });
    router.post('/question', function(req, res) {
        var user = req.user;
        
        if(!req.hasOwnProperty("body")){
            res.status(500).json({message:"body not found"});
        }
        var request = req.body;
        if(!request.hasOwnProperty("course")){
            res.status(500).json({message: "invalid post information", send: request.body})
        }
        else{
            var current_class = require('mongoose').model('Class');
            current_class.findOne({course_id: courseId}, function(err, result){
                if(err || result === null){
                    res.send('Class not found');
                }
                else{
                    var question = request.question;
                    current_class.questions.push(question);
                    current_class.findByIdAndUpdate(user, updatedUser, {new: true}, function (err, result) {
                        res.send(question + ' added!');
                    });
                }
            })
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
