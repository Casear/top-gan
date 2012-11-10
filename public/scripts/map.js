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
	
	map = new google.maps.Map(document.getElementById("map_canvas"),
	    myOptions);
	//My plane
	//var imgPath = 'images/fighter' + user.plane.type[1] + '.png' ;


	var myimage = new google.maps.MarkerImage(
			'images/fighter1.png',
			null, // size
			null, // origin
			new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
			new google.maps.Size( 50, 50 ) // scaled size (required for Retina display icon)
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
		},300);
	    //Other plane
		var image = new google.maps.MarkerImage(
			'images/fighter2.png',
			null, // size
			null, // origin
			new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
			new google.maps.Size( 50, 50 ) // scaled size (required for Retina display icon)
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
			Fire();
		});
		google.maps.event.addListener(selMarker, 'mouseup', function() {
			Fire();
		});
}
function Fire ()
{
<<<<<<< HEAD
=======
	

	//Fire the Missile
>>>>>>> a58811c740776376fe509f8b74440146e6d73776
	alert('Fire the Missile');
}

function PlaneRotation() {
	//sin 10 = 0.173648178
	//cos 10 = 0.984807753
}



function setMarker (json)
{
	if(user != null)
	{
		//json.plane.type
		
		
		var newlatlng = new google.maps.LatLng( user.x , user.y );
		map.setCenter(newlatlng);
		 var IsExist = 0;
			var vLatLng = new google.maps.LatLng( json.x, json.y);
			$.each(markersArray, function(i,v)
			{
				if(json.name == v.getTitle())
				{
					v.setPosition(vLatLng);
					IsExist = 1;
				}
			})
			if(IsExist == 0)
			{
				var image = new google.maps.MarkerImage(
						'images/F35-JSF-48px.png',
						null, // size
						null, // origin
						new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
						new google.maps.Size( 50, 50 ) // scaled size (required for Retina display icon)
					);
				var index = markersArray.length;
				markersArray[index] = new google.maps.Marker({
					flat: true,
					icon: image,
					map: map,
					optimized: false,
					position: vLatLng,
					title: json.name,
					visible: true
				});
				google.maps.event.addListener(markersArray[index], 'mouseover', function() {
					if(markersArray[index].getTitle() != user.name)
					{
						selMarker.setPosition(markersArray[index].getPosition());
						selMarker.setVisible(true);
					}				
				});
				google.maps.event.addListener(markersArray[index], 'mouseout', function() {
					selMarker.setVisible(false);
				});
				google.maps.event.addListener(markersArray[index], 'click', function() {
					Fire( );
				});
			}
			
		
		
	}

}
