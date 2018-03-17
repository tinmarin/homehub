const dudeButton = '88:71:e5:d6:32:ea'


var Dash = function() {

    console.log('On dash constructor................');

};



Dash.prototype.init = function() {

    console.log('Initializing listeners................');

	return {
        on : function(event, callback) {
            if(callback) callback();
        }
    };    
}


module.exports = new Dash();