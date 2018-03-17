var relay = require('./relay.js'),
    sensor = require('./sensor.js'),
    logger = require('./logger');

var Thermostat = function() {};

var ON = 1, OFF = 0;

var FAN = 15, COOL = 11, HEAT = 13;

var HVAC_OFF = 'off', HVAC_COOL = 'cool', HVAC_HEAT = 'heat';

var FAN_ON = 'on', FAN_AUTO = 'auto';

var fanStatus = FAN_AUTO;
var hvacStatus = HVAC_OFF;

var targetTemp, currentTemp;

Thermostat.prototype.init = function(temp){

    targetTemp = temp || 75;
    
    relay.init([FAN, COOL, HEAT]);

    hvacStatus = HVAC_OFF;
    
    console.log('Initializing')
}

Thermostat.prototype.status = function(callback) {

    return {

	hvacStatus: hvacStatus,
	fanStatus: fanStatus,
	targetTemp: targetTemp,
	tempF: currentTemp
    }

}

Thermostat.prototype.readTemperature = function(callback) {

    sensor.read(function(temp){

	currentTemp = temp.tempF;
	temp.hvacStatus = hvacStatus;
	temp.fanStatus = fanStatus;
	temp.targetTemp = targetTemp;
	processTemperature(temp.tempF);
	if(callback) callback(temp);

    });

}

Thermostat.prototype.fanOn = function(callback) {


    turnFan(ON);

    fanStatus = FAN_ON;

    if(callback) callback();
}

Thermostat.prototype.fanAuto = function(callback) {

    if(fanStatus == FAN_AUTO) return;
    
    turnFan(hvacStatus != HVAC_OFF);

    fanStatus = FAN_AUTO;
    
    if(callback) callback();
}

Thermostat.prototype.heat = function(callback) {

    if(hvacStatus == HVAC_HEAT) return;

    if(hvacStatus == HVAC_COOL) turnCool(OFF);
    
    hvacStatus = HVAC_HEAT;

    if(callback) callback();
    
}

Thermostat.prototype.off = function(callback) {

    if(hvacStatus == HVAC_OFF) return;

    hvacStatus = HVAC_OFF;
    
    relay.write(COOL, 0);
    relay.write(HEAT, 0);
    
    if (fanStatus == FAN_AUTO) relay.write(FAN, 0);

    if(callback) callback();

}

Thermostat.prototype.cool = function(callback) {

    if(hvacStatus == HVAC_COOL) return;

    if(hvacStatus == HVAC_HEAT) turnHeat(OFF);

    hvacStatus = HVAC_COOL;

    if(callback) callback();

}

Thermostat.prototype.setTargetTemp = function(temp) {

    targetTemp = temp;

}


Thermostat.prototype.hvacStatus = function(){

    return hvacStatus;

}

Thermostat.prototype.fanStatus = function() {

    return fanStatus;

}

Thermostat.prototype.targetTemp = function() {

    return targetTemp;

}
function processTemperature(currentTemp) {

    
    console.log('HVAC Status: ' + hvacStatus);
    console.log('Fan Status: ' + fanStatus);
    
    console.log('Target:  ' + targetTemp);
    console.log('Current: ' + currentTemp);

    if(hvacStatus == HVAC_OFF) return;
    
    if(Math.abs(currentTemp - targetTemp) <= 1 && currentTemp >= targetTemp) return;
    
    
    if(targetTemp > currentTemp) {

	hvacStatus == HVAC_COOL ? turnCool(OFF) : turnHeat(ON);

    }

    if(targetTemp < currentTemp) {

	hvacStatus == HVAC_COOL ?  turnCool(ON) : turnHeat(OFF);
	
    }    
}

function turnCool(value) {

	console.log('Turning COOL ' + value);
	relay.write(COOL, value);
	if(fanStatus == FAN_AUTO) turnFan(value);

    logger.log(
        {
            function: 'COOL',
            status: value,
            targetTemp: targetTemp,
            currentTemp: currentTemp 
        }
    );
}

function turnHeat(value) {

	console.log('Turning HEAT ' + value);
	relay.write(HEAT, value);
	if(fanStatus == FAN_AUTO) turnFan(value);

    logger.log(
        {
            function: 'HEAT',
            status: value,
            targetTemp: targetTemp,
            currentTemp: currentTemp 
        }
    );
}

function turnFan(value) {


	relay.write(FAN, value);
    
}

module.exports = new Thermostat();
