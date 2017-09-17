var oled = require('oled-ssd1306-i2c');


var Display = function () {

    var options = {
	width: 128,
	height: 64
    }

    oled = new oled(options);
   
};

Display.prototype.test = function() {

    console.log('Printing to display');

}

Display.prototype.currentTemp = function(temp) {

    oled.fillRect(1,1,128,32,1);    

}

module.exports = new Display();


