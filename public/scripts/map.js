var map;
var markersArray = [];
function initialize_map() {
	var latlng = new google.maps.LatLng(-34.397, 150.644);
	var myOptions = {
	  zoom: 8,
	  center: latlng,
	  mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	map = new google.maps.Map(document.getElementById("map_canvas"),
	    myOptions);
}
function setMarker (json)
{
	clearOverlays();
	$.each(json, function(i,v)
	{
		var myLatLng = new google.maps.LatLng( v.x, v.y);
		var image = new google.maps.MarkerImage(
						'bluedot_retina.png',
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
						title: 'I might be here',
						visible: true
					});
	})
}
function clearOverlays() {
	$.each(markersArray, function(i, v){
		markersArray[i].setMap(null);
	});
}