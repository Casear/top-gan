function createCityMap(map) {




		var createMarker = function(coordinate, city) {
				var marker = new google.maps.Marker({
					map: map,
					position: coordinate,
					icon: new google.maps.MarkerImage('/images/house.png')
				});
			};


	ft2json.query('SELECT Lat,Long,City,Country FROM 2621505 WHERE Megacity=1', /* Fusion Tables query. */

	function(result) {

			var numRows = result.count;
			for (var i = 0; i < numRows; i++) {
				var lat = result.data[i].Lat; 
				var lng = result.data[i].Long; 
				var coordinate = new google.maps.LatLng(lat, lng);
				var city = result.data[i].City
				createMarker(coordinate, city);
			}

	}, {
		/* Optional parameters. */
		limit: 600
	});


}
