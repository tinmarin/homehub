var gpio = require('rpi-gpio');

var Relay = function () {};

_direction = gpio.DIR_IN;

Relay.prototype.init = function(pins) {

    for(var i = 0; i < pins.length; i++) {

	var pin= pins[i];
	gpio.setup(pins[i], _direction);
    }
/*
    gpio.setup(pins[0], gpio.DIR_OUT, function(){

	console.log(pins[0]);
	gpio.write(pins[0], 1);
	
    });

    
    gpio.setup(pins[1], gpio.DIR_OUT, function(){

	console.log(pins[1]);
	gpio.write(pins[1], 1);
	
    });

    
    gpio.setup(pins[2], gpio.DIR_OUT, function(){

	console.log(pins[2]);
	gpio.write(pins[2], 1);
	
    });
*/
}

Relay.prototype.setupForWrite = function(pin, callback) {

    gpio.setup(pin, gpio.DIR_OUT, function() {

	if(callback) callback();

    });

    

}

Relay.prototype.write = function(pin, value) {

    var direction = value == 0 ? gpio.DIR_IN : gpio.DIR_OUT;

    if(direction == _direction) return;
    
    gpio.setup(pin, direction, function(err){

	if (err) {

	    
	    console.log(err);

	    throw err; 
	}

	_direction = direction;
	
	console.log(`Written to pin ${pin} direction ${direction}`);
    });
}

Relay.prototype.read = function(pin, callback) {


    gpio.read(pin, function(err, value) {

	if(callback) callback(value);

    })

}

module.exports = new Relay();
