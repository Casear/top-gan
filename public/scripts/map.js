function initialize_map() {
	var latlng = new google.maps.LatLng(-34.397, 150.644);
	var myOptions = {
	  zoom: 8,
	  center: latlng,
	  mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"),
	    myOptions);
}
var markersArray = [];

function setMarker (json)
{
	//if(markersArray.length > 0){
	//	for(int i = 0 ; i < markersArray.length ; i++) 
	//	{
	//		markersArray[i].setMap(null);
	//	}
	//}
	
}