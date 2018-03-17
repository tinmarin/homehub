
var TempSensor = function (){};

const base_address =  '/sys/bus/w1/devices/';
const file_name = '/w1_slave';

TempSensor.prototype.read = function(callback) {

	const tempC = 17;

	const tempFraw = tempC * 1.8 + 32;
	const tempF = Math.round(tempFraw);
	
	if (callback) callback({
	    tempFraw : tempFraw,
	    tempF : tempF,
	    tempC : Math.round(tempC)
	});
}

module.exports = new TempSensor();