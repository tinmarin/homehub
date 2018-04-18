var dash_button = require('node-dash-button');


const dudeButton = '88:71:e5:d6:32:ea'


var Dash = function() {


};



Dash.prototype.init = function() {

	var dash = dash_button(dudeButton, null, null, 'all'); //address from step above

	return dash;    
}

module.exports = new Dash();