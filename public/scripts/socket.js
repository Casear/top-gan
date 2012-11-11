

socket = io.connect();
socket.on('connect', function() {
    console.log('Client has connected to the server!');

    socket.on('init', function(rdata) {
        var data=rdata.data;
        $('.users').removeClass('hide');
        $('#totalVal').text(rdata.userlist.length);
        for(var i=0;i<rdata.userlist.length;i++)
        {
            $('.users').append('<div id="list_'+rdata.userlist[i].plane.name+'" style="margin:3px"><img style="width:50px;height:25px" src="/images/'+countries[rdata.userlist[i].plane.country].flag+'">&nbsp;'+rdata.userlist[i].plane.name+'</div>');
        }
        $('#loginScreen').hide(); $('#info').show();
        console.log('socket.on init, data:' + data);
		user = { name:data.name, x:data.x, y:data.y, r:data.r, plane:data.plane };
	    initialize_map();
	    audioPlay('fly');
	    audioStop('background');

	    socket.on('war', function(data) {
			//console.log('socket.on war, data:' + data);
			players = data;
			setMarker(data);
		});

		socket.on('locked', function(data) {
			// console.log('socket.on locked, data:' + data);
			audioPlay('warning');
		});

		socket.on('attacked', function(data) {
			//console.log('socket.on attacked, data:' + data);
			attacked(data);
		});

		socket.on('hit', function(data) {
			//console.log('socket.on hit, data:' + data);
			var items = Math.round(Math.random()*5);
			var count = $('#c1').text();
			$('#c1').text(parseInt(count,10) + parseInt(items,10));
			alert('you win, you get ' +  items + ' missile!');
		});
	});
    socket.on('userjoined',function(data){
            $('.users').append('<div id="list_'+data.plane.name+'" style="margin:3px"><img style="width:50px;height:25px" src="/images/'+countries[data.plane.country].flag+'">&nbsp;'+data.plane.name+'</div>');
    });
    socket.on('userleaved',function(data){
        $('#list_'+data).remove();
        removeMarker(data);
        if($('#point_'+data).length==0)
        {
            $('#point_'+data).remove();
        }
        $('#totalVal').text($('.users').children().length-1); 
    });
    socket.on('error',function(data){
        // console.log('user exsit');
        $('#msg').removeClass('hide').text('Account already exist')
    });
	socket.on('system', function(data) {
		//console.log('socket.on system, data:' + data.msg);
	});
    socket.on('message',function(data){
        $('#lbMessage').prepend('<div style="margin:3px;color:white"><span>'+data.name+'</span>&nbsp;:&nbsp;<span>'+data.msg+'</span></div>');
    });
});

function join(name, country, aircraft) {
	//console.log('call socket.emit join, name:' + name + ', country:' + country + ', aircraft:' + aircraft);
	socket.emit('join', { name: name, country: country, type: aircraft , x:countries[country].x,y:countries[country].y });
}

function sendMessage(name,message){
    $('#lbMessage').prepend('<div style="margin:3px;color:white"><span>'+name+'</span>&nbsp;:&nbsp;<span>'+message+'</span></div>');
    socket.emit('message', { name: name, msg:message});
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

function shoot(name) {
	// console.log('call socket.emit attack, name: ' + name );
	
	var count = $('#c1').text();
	if (count != "0" && !isShot) {
		isShot = true;
		audioPlay('missle');
		count --;

		socket.emit('shoot', { name: user.name, x: user.x, y: user.y, target: name } );
		$('#c1').text(count);
	}
}
	
function shooting(id, x, y, status) {
	console.log('call socket.emit shooting, id: ' + id );
	socket.emit('shooting', { name: id, x: x, y: y, status: status } );
}

function hitted(data) {
	console.log('call socket.emit hitted, data: ' + data );
	socket.emit('hitted', data);
	Lose();
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
	var r = (evt.keyCode == 37) ? 10 : ((evt.keyCode == 39) ? -10 : 0); 

	if (user) {
		rotate(user.name, user.x, user.y, r);
	}
}
