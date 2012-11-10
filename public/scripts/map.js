var map;
var markersArray = [];

function initialize_map() {
	console.log("initialize_map");
	var latlng = new google.maps.LatLng(user.x, user.y);
	var myOptions = {
	  zoom: 8,
	  center: latlng,
	  mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	map = new google.maps.Map(document.getElementById("map_canvas"),
	    myOptions);

	self.setInterval(function(){
		var newlat = user.x  ;
		var newlng = user.y + 0.1;
			if(newlat > 45)
				newlat = newlat - 90 ;
		user.x = newlat;
		user.y = newlng;
		fly(user.name , user.x , user.y , user.r);
		},600);
}
var selMarker ;
function setMarker (json)
{
	var newlatlng = new google.maps.LatLng( user.x , user.y );
	map.setCenter(newlatlng);
	clearOverlays();
	$.each(json, function(i,v)
	{
		var IsExist = 0;
		var newLatLng = new google.maps.LatLng( v.x, v.y);
		
		$.each(markersArray, function(j,value)
		{
			alert(value.title);
			if(v.name == value.getTitle())
			{
				
				value.setPosition(newLatLng);
				IsExist = 1;
			}
		})
		if(IsExist == 0)
		{
			console.log(v.name + " & " + markersArray.length);
			var image = new google.maps.MarkerImage(
						'images/F35-JSF-48px.png',
						null, // size
						null, // origin
						new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
						new google.maps.Size( 17, 17 ) // scaled size (required for Retina display icon)
					);
			markersArray[markersArray.length] = new google.maps.Marker({
						flat: true,
						icon: image,
						map: map,
						optimized: false,
						position: newLatLng,
						title: v.name,
						visible: true
					});
		}
			// google.maps.event.addListener(markersArray[i], 'mouseover', function() {
			// 	var image = new google.maps.MarkerImage(
			// 			'images/Fighter.jpg',
			// 			null, // size
			// 			null, // origin
			// 			new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
			// 			new google.maps.Size( 20, 20 ) // scaled size (required for Retina display icon)
			// 		);
   //  			selMarker = new google.maps.Marker({
			// 			flat: true,
			// 			icon: image,
			// 			map: map,
			// 			optimized: false,
			// 			position: markersArray[i].position,
			// 			title: v.name,
			// 			visible: true
			// 		});
  	// 		});
  		
	})
}
function clearOverlays() {
	if(selMarker != null)
		selMarker.setMap(null);
	$.each(markersArray, function(i, v){
		markersArray[i].setMap(null);
	});
}