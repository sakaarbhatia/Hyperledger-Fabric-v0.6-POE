require('rootpath')();

var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var config = require('configurations/hfc/config-hfc.json');
var cors = require('cors')
var app = express();
var logUtil = require('loggingUtility')
var logger = logUtil.instantiateLogging();
var hyperledger = require('./services/hfc/hyperledger.service')

app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

//body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())

//Connect to hyperledger using hfc
hyperledger.connectHyperledgerSetup()
.then(function(status){
	console.log(status)
})
.catch(function(err){
	logger.error(err)
	console.log(err)
})


app.use(express.static(__dirname +  '/app'))

//controllers
app.use('/app',require('./controllers/hfc/transaction-hfc.controller.js'))
app.use('/app',require('./controllers/hfc/details-hfc.controller.js'))

//Default route will redirect to /app 
app.get('/', function (req, res) {
  res.redirect('/app');
})

//make server listen on port 3000
app.listen(3000, function () {
  console.log('Server is listening on port 3000!')
})
