var user;
var deg = 0;

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

function fly(x, y, deg) {
	console.log('call socket.emit fly, x:' + x + ', y:' + y + ', deg:' + deg);
	socket.emit('fly', { x: x, y: y, r: deg });
}

function rotate(name, x, y, deg) {
	console.log('call socket.emit rotate, name:' + name + ', x:' + x + ', y:' + y + ', deg:' + deg);
	$('#map_canvas').find('>div>div>div').css({
		'transform':'rotate(' + deg + 'deg)',
    	'-ms-transform':'rotate(' + deg + 'deg)', /* IE 9 */
        '-moz-transform':'rotate(' + deg + 'deg)', /* Firefox */
      	'-webkit-transform':'rotate(' + deg + 'deg)', /* Safari and Chrome */
      	'-o-transform':'rotate(' + deg + 'deg)' /* Opera */
	});
	socket.emit('rotate', { n:name, x: x, y: y, d: deg });
}

function rotate2(name, x, y, deg) {
	console.log('call socket.emit rotate, name:' + name + ', x:' + x + ', y:' + y + ', deg:' + deg);
	$('#map_canvas').find('>div>div>div:eq(0)>div').css({
		'transform':'rotate(' + deg + 'deg)',
    	'-ms-transform':'rotate(' + deg + 'deg)', /* IE 9 */
        '-moz-transform':'rotate(' + deg + 'deg)', /* Firefox */
      	'-webkit-transform':'rotate(' + deg + 'deg)', /* Safari and Chrome */
      	'-o-transform':'rotate(' + deg + 'deg)' /* Opera */
	});
	//map.setZoom(7);
	socket.emit('rotate', { n:name, x: x, y: y, d: deg });
}