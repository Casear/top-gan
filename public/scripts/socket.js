var location = function(name, x, y){
	this.n = name;
	this.x = x;
	this.y = y;
}
var user = new location("", 0, 0);

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