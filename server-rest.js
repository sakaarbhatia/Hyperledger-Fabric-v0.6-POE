require('rootpath')();

var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var config = require('configurations/rest/config-rest.json');
var cors = require('cors')
var app = express();

var logUtil = require('loggingUtility')

var logger = logUtil.instantiateLogging();

app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

//body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static(__dirname +  '/app'))

//controllers
app.use('/app',require('./controllers/rest/transaction-rest.controller.js'))
app.use('/app',require('./controllers/rest/details-rest.controller.js'))

//Default route will redirect to /app 
app.get('/', function (req, res) {
  res.redirect('/app');
})

//make server listen on port 3001
app.listen(3001, function () {
  console.log('Server is listening on port 3001')
})
