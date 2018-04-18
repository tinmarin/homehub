var ifttt = require('../ifttt.json');
const http = require('http');
var querystring = require('querystring');
var fs = require('fs');

var Logger = function() {}

module.exports = new Logger();

Logger.prototype.log = function(data) {

    //fs.appendFileSync('hub.log', new Date().toLocaleString() + ' ' + data.channel + ' ' + data.status + ' ' + data.targetTemp + ' ' + data.currentTemp + '\r\n');

}

Logger.prototype.logToCloud = function(data) {
    var post_data = querystring.stringify({
        'value1' : data.channel,
        'value2': data.status,
        'value3': data.targetTemp + ' / ' + data.currentTemp
    });
    
    // An object of options to indicate where to post to
    var post_options = {
        host: 'maker.ifttt.com',
        port: '80',
        path: '/trigger/'+ ifttt.eventName +'/with/key/'+ ifttt.key,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };
    
    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
    });
    
    // post the data
    post_req.write(post_data);
    post_req.end();
}