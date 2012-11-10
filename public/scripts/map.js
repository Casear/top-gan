var map;
var markersArray = [];
function initialize_map() {
	var latlng = new google.maps.LatLng(34.3, 150.6);
	var myOptions = {
	  zoom: 8,
	  center: latlng,
	  mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	map = new google.maps.Map(document.getElementById("map_canvas"),
	    myOptions);

	self.setInterval(function(){
		var newlatlng = new google.maps.LatLng(map.center.lat()+0.1, map.center.lng());
		map.setCenter(newlatlng);
		setMarker([{"n":"n","x":newlatlng.lat(),"y":newlatlng.lng() }]);
		fly(map.center.lat() , map.center.lng())
		},1000);

	// setMarker([{"n":"n","x":34.3,"y":150.6}]);
	// setMarker([{"n":"n","x":35.3,"y":151.6},{"n":"n1","x":36.397,"y":152.644}]);
}
function setMarker (json)
{
	clearOverlays();
	$.each(json, function(i,v)
	{
		var myLatLng = new google.maps.LatLng( v.x, v.y);
		var image = new google.maps.MarkerImage(
						'images/F35-JSF-48px.png',
						null, // size
						null, // origin
						new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
						new google.maps.Size( 17, 17 ) // scaled size (required for Retina display icon)
					);
		markersArray[i] = new google.maps.Marker({
						flat: true,
						icon: image,
						map: map,
						optimized: false,
						position: myLatLng,
						title: v.n,
						visible: true
					});
	})
}
function clearOverlays() {
	$.each(markersArray, function(i, v){
		markersArray[i].setMap(null);
	});
}