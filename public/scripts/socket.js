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
	console.log('socket.on war, data:' + data);
	setMarker(data);
});

socket.on('system', function(data) {
	console.log('socket.on system, data:' + data.msg);
});

function join(name, country, aircraft) {
	console.log('call socket.emit join, name:' + name + ', country:' + country + ', aircraft:' + aircraft);
	socket.emit('join', { n: name, c: country, t: aircraft });

	user = { n:"user", x:25.139636, y:121.495840, r:0 };
    initialize_map();
}

function fly(name, x, y, r) {
	console.log('call socket.emit fly, name: ' + name + ', x:' + x + ', y:' + y + ', deg:' + r);
	socket.emit('fly', { n: name, x: x, y: y, r: r });
}

function rotate(name, x, y, r) {
	deg += r;
	console.log('call socket.emit rotate, name:' + name + ', x:' + x + ', y:' + y + ', deg:' + deg + ', r:' + r);
	$('#map_canvas').find('>div>div>div:eq(0)>div').css({
		'transform':'rotate(' + deg + 'deg)',
    	'-ms-transform':'rotate(' + deg + 'deg)', /* IE 9 */
        '-moz-transform':'rotate(' + deg + 'deg)', /* Firefox */
      	'-webkit-transform':'rotate(' + deg + 'deg)', /* Safari and Chrome */
      	'-o-transform':'rotate(' + deg + 'deg)' /* Opera */
	});
	var newlatlng = new google.maps.LatLng(x, y);
	map.setCenter(newlatlng);
	//socket.emit('rotate', { n:name, x: x, y: y, d: deg });
}

document.onkeydown =  function(evt) {
	//37 left, 39 right
	var evt  = (evt) ? evt : ((event) ? event : null); 
	console.log(evt.keyCode);
	var r = (evt.keyCode == 37) ? 10 : ((evt.keyCode == 39) ? -10 : 0); 

	rotate(user.n, user.x, user.y, r);
}