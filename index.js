const path = require('path');
const express = require('express');
const app = express();
const passport = require('passport')
const config = require('./config');
const User = require('./')
const router = express.Router();
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.static('./backend/static/'));
app.use(express.static('./frontend/dist/'));

/*
// Static routes
app.route('/').get(function(req, res) {
  return res.sendFile(path.join(__dirname, './backend/static/index.html'));
});
app.route('/login').get(function(req, res) {
  return res.sendFile(path.join(__dirname, './backend/static/index.html'));
});
app.route('/register').get(function(req, res) {
  return res.sendFile(path.join(__dirname, './backend/static/index.html'));
});
app.route('/dashboard').get(function(req,res) {
  return res.sendFile(path.join(__dirname, './backend/static/index.html'));
});
*/

/* New things ================================================================ */

require('./backend/models').connect(config.dbUri);
require('./backend/auth/passport')(passport);

// Initialize cookie sessions
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
  keys: ['test','clearity']

}));
// Allow Cross-Origin Resource Sharing (CORS) so that backend and frontend could be put on different servers
const allowCrossDomain = function (request, resource, next) {
    resource.header("Access-Control-Allow-Origin", "*");
    resource.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    resource.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
};

app.use(allowCrossDomain);
app.use(cors());
app.options('*', cors());
// Initialize Passport
var session = require("express-session");
const bodyParser = require("body-parser");
app.use(express.static("public"));
app.use(session({ secret: "cats" }));
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(passport.initialize()); // Create an instance of Passport
app.use(passport.session());

// Get our routes
app.use('/api', require('./backend/routes/api')(router, passport));

/* =========================================================================== */
const _PORT = process.env.PORT || 3000;
// start the server
app.listen(_PORT, () => {
  console.log('Server is running');
});
