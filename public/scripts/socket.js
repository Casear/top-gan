var user;

socket = io.connect();
socket.on('connect', function() {
    console.log('Client has connected to the server!');
});

socket.on('system', function(data) {
    console.log(data);
});

socket.on('disconnect', function() {
    console.log('The client has disconnected!');
});