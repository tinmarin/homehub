const dudeButton = '88:71:e5:d6:32:ea'


var Dash = function() {


};



Dash.prototype.init = function() {

	return {
        on : function(event, callback) {
            if(callback) callback();
        }
    };    
}


module.exports = new Dash();