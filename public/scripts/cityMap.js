function createCityMap(map) {

	/*    var layer=new google.maps.FusionTablesLayer({
        query:{
            select :'Lat,Long',
            from :'2621505',
            where :'Megacity=1'
        },
        styles:[{
            markerOptions: {
                    iconName: "capital_big"
          }
        }]
    });
    layer.setMap(map);
*/


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
	google.maps.event.addDomListener(window, 'load', function() {
		/*
		var query = "SELECT Lat,Long,City,Country FROM 2621505 WHERE Megacity=1";
		query = encodeURIComponent(query);
		var gvizQuery = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + query);
		var createMarker = function(coordinate, city) {
				var marker = new google.maps.Marker({
					map: map,
					position: coordinate,
					icon: new google.maps.MarkerImage('/images/house.png')
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
		});*/
	});


}
