var map;
var markersArray = [];
var selMarker;
var myPlane;
var increX = increY = 0;

function initialize_map() {
	console.log("initialize_map");
	var latlng = new google.maps.LatLng(user.x, user.y);
	console.log(user.x + " & " + user.y);
	var myOptions = {
		zoom: 8,
		center: latlng,
		disableDefaultUI: true,
		scrollwheel: false,
		navigationControl: false,
		mapTypeControl: false,
		scaleControl: false,
		draggable: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);







	var myimage = new google.maps.MarkerImage('images/Fighter.jpg', null, // size
	null, // origin
	new google.maps.Point(8, 8), // anchor (move to center of marker)
	new google.maps.Size(20, 20) // scaled size (required for Retina display icon)
	);
	myPlane = new google.maps.Marker({
		flat: true,
		icon: myimage,
		map: map,
		optimized: false,
		position: new google.maps.LatLng(user.x, user.y),
		visible: true
	});

    createCityMap(map);        
            
        


	window.setInterval(function() {

		var newlat = user.x + 0.1 + increX;
		var newlng = user.y + increY;
		if (newlat > 45) newlat = newlat - 90;
		user.x = newlat;
		user.y = newlng;
		fly(user.name, user.x, user.y, user.r);
		myPlane.setPosition(new google.maps.LatLng(user.x, user.y));
		map.setCenter(new google.maps.LatLng(user.x, user.y));
	}, 300);

	var image = new google.maps.MarkerImage('images/Fighter.jpg', null, // size
	null, // origin
	new google.maps.Point(8, 8), // anchor (move to center of marker)
	new google.maps.Size(20, 20) // scaled size (required for Retina display icon)
	);
	selMarker = new google.maps.Marker({
		flat: true,
		icon: image,
		map: map,
		optimized: false,
		position: new google.maps.LatLng(user.x, user.y),
		visible: false
	});
	google.maps.event.addListener(selMarker, 'mousedown', function() {
		//Fire('');
	});
	google.maps.event.addListener(selMarker, 'mouseup', function() {
		//ire('');
	});
}

function Fire(name) {

	//Fire the Missile
	alert('Fire the Missile' + name);
}

function PlaneRotation() {
	//sin 10 = 0.173648178
	//cos 10 = 0.984807753
}

function setMarker(json) {
	console.log("setMarker" + user.x + " & " + user.y);
	var newlatlng = new google.maps.LatLng(user.x, user.y);
	map.setCenter(newlatlng);


	$.each(json, function(i, v) {
		var IsExist = 0;
		var vLatLng = new google.maps.LatLng(v.x, v.y);

		$.each(markersArray, function(j, value) {

			if (v.name == value.getTitle()) {
				value.setPosition(vLatLng);
				IsExist = 1;
			}
		})
		if (IsExist == 0) {
			var image = new google.maps.MarkerImage('images/F35-JSF-48px.png', null, // size
			null, // origin
			new google.maps.Point(8, 8), // anchor (move to center of marker)
			new google.maps.Size(17, 17) // scaled size (required for Retina display icon)
			);
			var index = markersArray.length;
			markersArray[index] = new google.maps.Marker({
				flat: true,
				icon: image,
				map: map,
				optimized: false,
				position: vLatLng,
				title: v.name,
				visible: true
			});
			google.maps.event.addListener(markersArray[index], 'mouseover', function() {
				if (markersArray[index].getTitle() != user.name) {
					selMarker.setPosition(markersArray[index].getPosition());
					selMarker.setVisible(true);
				}
			});
			google.maps.event.addListener(markersArray[index], 'mouseout', function() {
				selMarker.setVisible(false);
			});
			google.maps.event.addListener(markersArray[index], 'click', function() {
				Fire('   =>' + markersArray[index].getTitle());
			});
		}
	})
}
