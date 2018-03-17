var relay = require('./mock/relayMock'),
    sensor = require('./mock/sensorMock'),
    logger = require('./logger');

var Thermostat = function() {};

var ON = 1, OFF = 0;

var FAN = 15, COOL = 11, HEAT = 13;

var HVAC_OFF = 'off', HVAC_COOL = 'cool', HVAC_HEAT = 'heat';

var FAN_ON = 'on', FAN_AUTO = 'auto';

var fanStatus = FAN_AUTO;
var hvacStatus = HVAC_OFF;
var currentChannelOn = '';


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

    if(hvacStatus == HVAC_COOL) set(COOL, OFF);
    
    hvacStatus = HVAC_HEAT;

    if(callback) callback();
    
}

Thermostat.prototype.cool = function(callback) {

    if(hvacStatus == HVAC_COOL) return;

    if(hvacStatus == HVAC_HEAT) set(HEAT, OFF);

    hvacStatus = HVAC_COOL;

    if(callback) callback();

}

Thermostat.prototype.off = function(callback) {

    if(hvacStatus == HVAC_OFF) return;

    hvacStatus = HVAC_OFF;
    
    // relay.write(COOL, OFF); //use the set function
    // relay.write(HEAT, OFF); //use the set function
    set(COOL, OFF);
    set(HEAT, OFF);
    
    if (fanStatus == FAN_AUTO) turnFan(OFF);

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

    if(hvacStatus == HVAC_HEAT) {

        if(targetTemp > currentTemp && currentChannelOn !== getChannelName(HEAT)) {
            
            set(HEAT, ON);
        }
        if(targetTemp < currentTemp && currentChannelOn === getChannelName(HEAT)) {

            set(HEAT, OFF);
        }
    }

    if(hvacStatus == HVAC_COOL){

        if(targetTemp < currentTemp && currentChannelOn !== getChannelName(COOL)) {
            
            set(COOL, ON);
        }
        if(targetTemp > currentTemp && currentChannelOn === getChannelName(COOL)) {

            set(COOL, OFF);
        }

    }
    
}


function set(channel, value){

    var channelStr = getChannelName(channel);
    
    console.log('Turning channel: ' + channelStr + ' ' + value);
    
    relay.write(channel, value);

    currentChannelOn = value === ON ? channelStr : '';

    if(fanStatus == FAN_AUTO) turnFan(value);

    logger.log(
        {
            channel: channelStr,
            status: value,
            targetTemp: targetTemp,
            currentTemp: currentTemp 
        }
    );
}

function getChannelName(channel) {

    var channelStr = '';

    switch(channel) {
        case 11 : channelStr = 'COOL'; break;
        case 13 : channelStr = 'HEAT'; break;
        case 15 : channelStr = 'FAN'; break;
    }

    return channelStr;
}

// function turnCool(value) {

// 	console.log('Turning COOL ' + value);
// 	relay.write(COOL, value);
// 	if(fanStatus == FAN_AUTO) turnFan(value);

//     logger.log(
//         {
//             channel: 'COOL',
//             status: value,
//             targetTemp: targetTemp,
//             currentTemp: currentTemp 
//         }
//     );
// }

// function turnHeat(value) {

// 	console.log('Turning HEAT ' + value);
// 	relay.write(HEAT, value);
// 	if(fanStatus == FAN_AUTO) turnFan(value);

//     logger.log(
//         {
//             channel: 'HEAT',
//             status: value,
//             targetTemp: targetTemp,
//             currentTemp: currentTemp 
//         }
//     );
// }

function turnFan(value) {
	relay.write(FAN, value);
}

module.exports = new Thermostat();
