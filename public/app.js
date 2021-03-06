const socket = io();

function heatBtnActivated() {

  emitHVACEvent('heat');
}

function offBtnActivated() {
  emitHVACEvent('off');
}

function coolBtnActivated() {
  emitHVACEvent('cool');
}

function fanAutoActivated() {

    emitFanEvent('auto');

}

function fanOnActivated() {

    emitFanEvent('on');

}

function emitHVACEvent(event, data){

  socket.emit('hvac:' + event, data);

}

function emitFanEvent(event, data){

 socket.emit('fan:' + event, data);

}

function emitTemperatureEvent(event, data) {

  socket.emit('temp:' + event, data);

}

function presetBtnActivated(button) {

    const temp = parseInt($('#preset' + button + '-value').text());
    
    emitTemperatureEvent('set', {targetTemp  : temp});

}


function setupUIEventListeners() {

  $("#heat-btn").click(heatBtnActivated);
  $("#off-btn").click(offBtnActivated);
  $("#cool-btn").click(coolBtnActivated);

  $('#preset1-btn').click(function(){

      presetBtnActivated(1);
  });

  $('#preset2-btn').click(function(){

      presetBtnActivated(2);
  });

  $('#up-temp-btn').click(function() {

    var temp = parseInt($('#target-temp').text()) + 1;

    emitTemperatureEvent('set', { targetTemp: temp});
     

  });

    $('#down-temp-btn').click(function() {

    var temp = parseInt($('#target-temp').text()) - 1;

    emitTemperatureEvent('set', { targetTemp: temp});

    });

    $('#fan-auto-btn').click(fanAutoActivated);
    $('#fan-on-btn').click(fanOnActivated);

}

function setupSocketEventListeners() {

    socket.on('hvac:status', function(data) {

        $('#heat-btn').removeClass('btn-circle--active').addClass('btn-circle--passive');
        $('#off-btn').removeClass('btn-circle--active').addClass('btn-circle--passive');
        $('#cool-btn').removeClass('btn-circle--active').addClass('btn-circle--passive');

        $('#' + data.status + '-btn').addClass('btn-circle--active');

    });

    socket.on('hvac:channel-status', function(data){

        if(data !== '') {
            $('#curr-temp').addClass('channel-status--' + data);
            $('.current-temp-container').addClass('current-temp-container--' + data);
        } else {

            $('#curr-temp').removeClass('channel-status--HEAT');
            $('#curr-temp').removeClass('channel-status--COOL');
            $('.current-temp-container').removeClass('current-temp-container--HEAT');
            $('.current-temp-container').removeClass('current-temp-container--COOL');
        }

    });

    socket.on('temp:target-changed', function(data){

	    $('#target-temp').text(data.targetTemp);

    });

    socket.on('fan:status', function(data){

        $('#fan-auto-btn').removeClass('btn-circle--active').addClass('btn-circle--passive');
        $('#fan-on-btn').removeClass('btn-circle--active').addClass('btn-circle--passive');
        
        $('#fan-' + data.status + '-btn').addClass('btn-circle--active');

    });

}

$(document).ready(function() {

    socket.on('temp:read', function(data) {

        $('#curr-temp').text(data.tempF);
        emitHVACEvent('channel-status');
    });
  
    setupUIEventListeners();
    setupSocketEventListeners();
})


