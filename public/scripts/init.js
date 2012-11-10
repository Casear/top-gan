window.onload = function() {
	initialize_map();

	// $.each(json, function(i, v){

	// });

	for (var i = 50 - 1; i >= 0; i--) {
		setMarker([{"n":"name_"+i, "x": i+100, "y": i*20}]);
	};
}