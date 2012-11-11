var map;
var markersArray = [];
var selMarker;
var myPlane;
var increX = increY = 0;
var PlaneUnitPath = 0.1 ; 
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
		//disableDoubleClickZoom : true,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	
	map = new google.maps.Map(document.getElementById("map_canvas"),
	    myOptions);
	//My plane
	var imgPath = 'images/fighter' + user.plane.type[1] + '.png' ;


	var myimage = new google.maps.MarkerImage(
			imgPath,
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
		PlaneRotation();
		var newlat = user.x + increX;
		var newlng = user.y + increY;
		if (newlat > 80) newlat = newlat - 160;
		user.x = newlat;
		user.y = newlng;
		fly(user.name, user.x, user.y, user.r);
		myPlane.setPosition(new google.maps.LatLng(user.x, user.y));
		map.setCenter(new google.maps.LatLng(user.x, user.y));
		},300);
	 	////Other plane
		// var image = new google.maps.MarkerImage(
		// 	'images/fighter2.png',
		// 	null, // size
		// 	null, // origin
		// 	new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
		// 	new google.maps.Size( 50, 50 ) // scaled size (required for Retina display icon)
		// );
		// selMarker = new google.maps.Marker({
		// 	flat: true,
		// 	icon: image,
		// 	map: map,
		// 	optimized: false,
		// 	position: new google.maps.LatLng(user.x, user.y),
		// 	visible: false
		// });
		// google.maps.event.addListener(selMarker, 'mousedown', function() {
		// 	Fire();
		// });
		// google.maps.event.addListener(selMarker, 'mouseup', function() {
		// 	Fire();
		// });
}
function Fire (name)
{
	attack(name);
}
function LockPlane(name)
{
	lock(name);
}
function unLockPlane()
{

}
function PlaneRotation() {
	//sin 10 = 0.173648178
	//cos 10 = 0.984807753
		increX = PlaneUnitPath *  Math.sin( ( 90 - deg ) / 180 * Math.PI);
		increY = - PlaneUnitPath *  Math.cos( ( 90 - deg ) / 180 * Math.PI);
}



function setMarker (json)
{
	if(user != null)
	{
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
				var imgPath = 'images/fighter' + json.plane.type[1] + '.png' ;
				var image = new google.maps.MarkerImage(
						imgPath,
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
						// selMarker.setPosition(markersArray[index].getPosition());
						// selMarker.setVisible(true);
						LockPlane(markersArray[index].getTitle());
					}				
				});
				google.maps.event.addListener(markersArray[index], 'mouseout', function() {
					// selMarker.setVisible(false);
					// unLockPlane();
				});
				google.maps.event.addListener(markersArray[index], 'click', function() {
					Fire( markersArray[index].getTitle());
				});
			}
			
		
		
	}

}
