"use strict";

var http = require("http"),
    express = require("express"),
    socketIo = require('socket.io'),
    path = require('path'),
    dash = require('./src/dash/dash.js'),
    thermo = require('./src/thermostat.js');

thermo.init(72);
dash.init();

const app = express();

//app.set("view engine", "jade");

app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.render("index");
});

const server = new http.Server(app);

const io = socketIo(server);

io.on('connection', socket => {

    var status = thermo.status();
    
    io.emit('hvac:status', { status : status.hvacStatus});
    io.emit('fan:status', { status : status.fanStatus});
    io.emit('temp:target-changed', { targetTemp : status.targetTemp });

    
    thermo.readTemperature(function (data) {
        io.emit('temp:read', data);	
    });

    socket.on('hvac:cool', () => {

        thermo.cool( () => {
            io.emit('hvac:status', { status : 'cool'});
        });
    });

    socket.on('hvac:heat', () => {

        thermo.heat(() => {
            io.emit('hvac:status', { status : 'heat'});
        });
    });
    
    socket.on('hvac:off', () => {

        thermo.off(() => {
            io.emit('hvac:status', { status : 'off'});
        });
    });

    socket.on('hvac:status', () => {

        var status = thermo.hvacStatus();

        io.emit('hvac:status', {status: status});
    });
	      
    socket.on('fan:status', () => {

        var status = thermo.fanStatus();
        io.emit('fan:status', {status : status});
    });


    socket.on('temp:set', data  => {

        thermo.setTargetTemp(data.targetTemp);
        io.emit('temp:target-changed', {targetTemp : data.targetTemp});
    });

    socket.on('fan:on', () => {

        thermo.fanOn(() => {
            io.emit('fan:status', { status : 'on'});
        });
    });

    socket.on('fan:auto', () => {

        thermo.fanAuto(() => {
            io.emit('fan:status', { status : 'auto'});
        });
    });
});

setInterval( () => {

    thermo.readTemperature(function(temp){
	io.emit('temp:read', temp);
    });
    
}, 30000);


const port = 3000;

server.listen(port, () =>  {
    console.log('server started on port ' + port);
});



