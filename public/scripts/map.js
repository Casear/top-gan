var map;
var markersArray = [];

function initialize_map() {
	var latlng = new google.maps.LatLng(user.x, user.y);
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
		fly(user.x , user.y ,user.r)
		user.x = newlatlng.lat();
		user.y = newlatlng.lng();
		},500);
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
						new google.maps.Size( 20, 20 ) // scaled size (required for Retina display icon)
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