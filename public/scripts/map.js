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
		var newlat = user.x + 0.1 ;
		var newlng = user.y ;
			if(newlat > 45)
				newlat = newlat - 90 ;
		var newlatlng = new google.maps.LatLng( newlat , newlng );
		

		map.setCenter(newlatlng);
		//setMarker([{n:"n",x:newlatlng.lat(),y:newlatlng.lng() }]);
		
		user.x = newlatlng.lat();
		user.y = newlatlng.lng();
		fly(user.n , user.x , user.y , user.r);
		},600);
}
var selMarker ;
function setMarker (json)
{
	clearOverlays();
	$.each(json, function(i,v)
	{
		$.each(markersArray,function(j,w){

		} )
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
		google.maps.event.addListener(markersArray[i], 'mouseover', function() {
			var image = new google.maps.MarkerImage(
						'images/Fighter.jpg',
						null, // size
						null, // origin
						new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
						new google.maps.Size( 20, 20 ) // scaled size (required for Retina display icon)
					);
    		selMarker = new google.maps.Marker({
						flat: true,
						icon: image,
						map: map,
						optimized: false,
						position: markersArray[i].position,
						title: v.n,
						visible: true
					});
  		});
	})
}
function clearOverlays() {
	if(selMarker != null)
		selMarker.setMap(null);
	$.each(markersArray, function(i, v){
		markersArray[i].setMap(null);
	});
}