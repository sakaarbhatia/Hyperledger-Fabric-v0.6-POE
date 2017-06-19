
var _logger;

module.exports = {
	//Instantiate logging facility
    instantiateLogging: function() {

		var winston = require('winston');
		var logger = new (winston.Logger)({
		    transports: [
		      new (winston.transports.File)({ filename: 'POE_App.log' })
		    ]
		  });

		_logger = logger
		return _logger;
    },
    //return instantiated logger 
    getLogger: function() {
    	return _logger;
    }
}

