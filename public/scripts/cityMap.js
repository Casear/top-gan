function createCityMap(map) {
    google.load('visualization', '1');
    var query = "SELECT Lat,Long,City,Country FROM 2621505 WHERE Megacity=1";
	query = encodeURIComponent(query);
	var gvizQuery = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + query);

	var createMarker = function(coordinate,city) {
			var marker = new google.maps.Marker({
				map: map,
				position: coordinate ,
				icon: new google.maps.MarkerImage('images/house.png')
			});
		};
	gvizQuery.send(function(response) {
		var numRows = response.getDataTable().getNumberOfRows();
		for (var i = 0; i < numRows; i++) {
			var lat = response.getDataTable().getValue(i, 0);
			var lng = response.getDataTable().getValue(i, 1);	
			var coordinate = new google.maps.LatLng(lat, lng);
			var city = response.getDataTable().getValue(i, 2);
			createMarker(coordinate, city);
		}
	});

}
