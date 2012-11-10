var user;

socket = io.connect();
socket.on('connect', function() {
    console.log('Client has connected to the server!');
});
socket.on('disconnect', function() {
    console.log('The client has disconnected!');
});

socket.on('war', function(data) {
	console.log('socket.on war');
	setMarker(data);
});

function fly() {
	console.log('call socket.emit fly, x:' + user.x + ', y:' + user.y);
	socket.emit('fly', { x: user.x, y: user.y });
}