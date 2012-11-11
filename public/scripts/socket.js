
socket = io.connect();
socket.on('connect', function() {
    console.log('Client has connected to the server!');

    socket.on('init', function(data) {
        $('#loginScreen').hide(); $('#info').show();
        console.log('socket.on init, data:' + data);
		user = { name:data.name, x:data.x, y:data.y, r:data.r, plane:data.plane };
	    initialize_map();
	    audioPlay('fly');
	    audioStop('background');

	    socket.on('war', function(data) {
			//console.log('socket.on war, data:' + data);
			setMarker(data);
		});

		socket.on('locked', function(data) {
			// console.log('socket.on locked, data:' + data);
			audioPlay('warning');
		});

		socket.on('attacked', function(data) {
			//console.log('socket.on attacked, data:' + data);
			bomb();
			audioPlay('exl');
		});
	});
    socket.on('error',function(data){
        // console.log('user exsit');
        $('#msg').removeClass('hide').text('Account already exist')
    });
	socket.on('system', function(data) {
		//console.log('socket.on system, data:' + data.msg);
	});
});

function join(name, country, aircraft) {
	//console.log('call socket.emit join, name:' + name + ', country:' + country + ', aircraft:' + aircraft);
	socket.emit('join', { name: name, country: country, type: aircraft , x:countries[country].x,y:countries[country].y });
}

function fly(name, x, y, r) {
	//console.log('call socket.emit fly, name: ' + name + ', x:' + x + ', y:' + y + ', deg:' + r);
	socket.emit('fly', { name: name, x: x, y: y, r: r });
}

function rotate(name, x, y, r) {
	deg += r;
	if (deg == 360 || deg == -360) {
		deg = 0;
	}
	user.r = deg;
	//console.log('call socket.emit rotate, name:' + name + ', x:' + x + ', y:' + y + ', deg:' + deg + ', r:' + r);
	// $('#map_canvas').find('>div>div>div:eq(0)>div').css({
	// 	'transform':'rotate(' + deg + 'deg)',
 //    	'-ms-transform':'rotate(' + deg + 'deg)', /* IE 9 */
 //        '-moz-transform':'rotate(' + deg + 'deg)', /* Firefox */
 //      	'-webkit-transform':'rotate(' + deg + 'deg)', /* Safari and Chrome */
 //      	'-o-transform':'rotate(' + deg + 'deg)' /* Opera */
	// });
	// $('#map_canvas').find('>div>div>div:eq(0)>div').rotate(deg + 'deg');
	$('#map_canvas').animate({rotate: r +'deg'}, 0);

	var newlatlng = new google.maps.LatLng(x, y);
	map.setCenter(newlatlng);
	//socket.emit('rotate', { n:name, x: x, y: y, d: deg });
}

function lock(name) {
	// console.log('call socket.emit lock, name: ' + name );
	audioPlay('lock');
	socket.emit('lock', name);
}
function unlock() {
	// console.log('call socket.emit lock, name: ' + name );
	audioStop('lock');
}

function attack(name) {
	// console.log('call socket.emit attack, name: ' + name );
	audioPlay('missle');
	socket.emit('attack', name );
}

function audioPlay(name) {
	var obj = document.getElementById(name);
	obj.play();
}
function audioStop(name) {
	var obj = document.getElementById(name);
	obj.pause();
}

document.onkeydown =  function(evt) {
	//37 left, 39 right
	var evt  = (evt) ? evt : ((event) ? event : null); 
	// console.log(evt.keyCode);
	var r = (evt.keyCode == 37) ? -10 : ((evt.keyCode == 39) ? 10 : 0); 

	if (user) {
		rotate(user.name, user.x, user.y, r);
	}
}
