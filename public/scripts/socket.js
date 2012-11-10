var user;
var deg = 0;
var countries={
    "USA":{
        x: 39.866745,
        y: -98.051373
    },
    "Korea":{
        x:36.204317,
        y:127.868271
    },
    "China":{
        x:33.819698,
        y:102.890634
    },
    "India":{
        x:20.349177,
        y:78.676767
    
    },
    "European Union":{
        x:49.435569,
        y:16.94459
    },
    "Taiwan":{
        x:23.759624,
        y:121.007089
    }
}
socket = io.connect();
socket.on('connect', function() {
    console.log('Client has connected to the server!');

    socket.on('init', function(data) {
        $('#loginScreen').hide();
        console.log('socket.on init, data:' + data);
		user = { name:data.name, x:data.x, y:data.y, r:data.r };
	    initialize_map();
	});
    socket.on('fail',function(data){
        console.log('user exsit');
        $('#msg').text('Account already exist');
    });
	socket.on('system', function(data) {
		console.log('socket.on system, data:' + data.msg);
	});

	socket.on('war', function(data) {
		console.log('socket.on war, data:' + data);
		setMarker(data);
	});
});

function join(name, country, aircraft) {




	console.log('call socket.emit join, name:' + name + ', country:' + country + ', aircraft:' + aircraft);
	socket.emit('join', { name: name, country: country, type: aircraft , x:countries[country].x,y:countries[country].y });

}

function fly(name, x, y, r) {
	//console.log('call socket.emit fly, name: ' + name + ', x:' + x + ', y:' + y + ', deg:' + r);
	socket.emit('fly', { name: name, x: x, y: y, r: r });
}

function rotate(name, x, y, r) {
	deg += r;
	console.log('call socket.emit rotate, name:' + name + ', x:' + x + ', y:' + y + ', deg:' + deg + ', r:' + r);
	// $('#map_canvas').find('>div>div>div:eq(0)>div').css({
	// 	'transform':'rotate(' + deg + 'deg)',
 //    	'-ms-transform':'rotate(' + deg + 'deg)', /* IE 9 */
 //        '-moz-transform':'rotate(' + deg + 'deg)', /* Firefox */
 //      	'-webkit-transform':'rotate(' + deg + 'deg)', /* Safari and Chrome */
 //      	'-o-transform':'rotate(' + deg + 'deg)' /* Opera */
	// });
	// $('#map_canvas').find('>div>div>div:eq(0)>div').rotate(deg + 'deg');
	//map.panDirection(-1,0);
	$('#map_canvas').animate({rotate: r +'deg'}, 0);

	var newlatlng = new google.maps.LatLng(x, y);
	map.setCenter(newlatlng);
	//socket.emit('rotate', { n:name, x: x, y: y, d: deg });
}

document.onkeydown =  function(evt) {
	//37 left, 39 right
	var evt  = (evt) ? evt : ((event) ? event : null); 
	console.log(evt.keyCode);
	var r = (evt.keyCode == 37) ? -10 : ((evt.keyCode == 39) ? 10 : 0); 

	if (user) {
		rotate(user.name, user.x, user.y, r);
	}

}
