var fs = require('fs');
var sensorHandler = require('ds18b20');


var TempSensor = function (){};

const base_address =  '/sys/bus/w1/devices/';
const file_name = '/w1_slave';

TempSensor.prototype.read = function(callback) {

    sensorHandler.sensors(function (err, ids){

	if(err) throw err;
	
	const sensorId = ids[0];

	const tempC = sensorHandler.temperatureSync(sensorId);

	const tempFraw = tempC * 1.8 + 32;
	const tempF = Math.round(tempFraw);
	
	if (callback) callback({
	    tempFraw : tempFraw,
	    tempF : tempF,
	    tempC : Math.round(tempC)
	});
    });
}

module.exports = new TempSensor();
    
