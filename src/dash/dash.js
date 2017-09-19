var dash_button = require('node-dash-button');


const dudeButton = '88:71:e5:d6:32:ea'


var Dash = function() {

    console.log('On dash constructor................');

};



Dash.prototype.init = function() {

    console.log('Initializing listeners................');
	
	var dash = dash_button(dudeButton, null, null, 'all'); //address from step above

	return dash;    
}

module.exports = new Dash();