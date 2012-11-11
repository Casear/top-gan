var map;
var markersArray = [];
var rotationR =[]; 
var selMarker;
var myPlane;
var increX = increY = 0;
var PlaneUnitPath = 0.1 ; 
var myimage ; 
var planeInterval ; 
function initialize_map() {
	console.log("initialize_map");
	var latlng = new google.maps.LatLng(user.x, user.y);
	console.log(user.x + " & " + user.y);
	var myOptions = {
		zoom: 7,
		center: latlng,
		disableDefaultUI: true,
		scrollwheel: false,
		navigationControl: false,
		mapTypeControl: false,
		scaleControl: false,
		draggable: false,
		//disableDoubleClickZoom : true,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	
	map = new google.maps.Map(document.getElementById("map_canvas"),
	    myOptions);
	//My plane
	var imgPath = 'images/fighter' + user.plane.type[1] + '.png' ;


	myimage = new google.maps.MarkerImage(
			imgPath,
			null, // size
			null, // origin
			new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
			new google.maps.Size( 50, 50 ) // scaled size (required for Retina display icon)
		);

	myPlane = new google.maps.Marker({
		flat: true,
		icon: myimage,
		map: map,
		optimized: false,
		position: new google.maps.LatLng(user.x, user.y),
		title : user.name,
		visible: true,
		zIndex : 10000
	});

    //createCityMap(map);        
	planeInterval =window.setInterval(function() {
		PlaneRotation();
		var newlat = user.x + increX;
		var newlng = user.y + increY;
		if (newlat > 80) newlat = newlat - 160;
		user.x = newlat;
		user.y = newlng;
		fly(user.name, user.x, user.y, user.r);
        
        var tmpy=(user.y+180)/360*237;
        var tmpx=(90-user.x)/180*100;
        $('#point').css('left',tmpy).css('top',tmpx);

		myPlane.setPosition(new google.maps.LatLng(user.x, user.y));
		MarkerImageRotation();
		map.setCenter(new google.maps.LatLng(user.x, user.y));
		},300);




	 	//Lock flighter
		var image = new google.maps.MarkerImage(
			'images/LockFighter.png',
			null, // size
			null, // origin
			new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
			new google.maps.Size( 50, 50 ) // scaled size (required for Retina display icon)
		);
		selMarker = new google.maps.Marker({
			flat: true,
			icon: image,
			map: map,
			optimized: false,
			position: new google.maps.LatLng(user.x, user.y),
			visible: false
		});
		// google.maps.event.addListener(selMarker, 'mousedown', function() {
		// 	Fire();
		// });
		google.maps.event.addListener(selMarker, 'mouseup', function() {
			Fire();
		});
}
function MarkerImageRotation()
{
	setTimeout(function(){
        $('#map_canvas>div:eq(0)>div:eq(0)>div:eq(0)>div:eq(3)>div:eq(1)').animate({rotate: - user.r  +'deg'}, 0);	
  //       $.each(rotationR, function(i,v)
		// {
		// 	console.log('rotation: ' + v);
		// 	$('#map_canvas>div:eq(0)>div:eq(0)>div:eq(0)>div:eq(3)>div:eq('+ 2+i +')').animate({rotate: - v  +'deg'}, 0);
		// });
	}, 1);
}
function Fire ()
{

	if(lockplanename != '')
	{
		console.log('shoot =>' + lockplanename);
		shoot(lockplanename);
	}
}
function LockPlane(name)
{
	lock(name);
}
function unLockPlane()
{
	unlock();
}
function PlaneRotation() {
	//sin 10 = 0.173648178
	//cos 10 = 0.984807753
		increX = PlaneUnitPath *  Math.sin( ( 90 - user.r ) / 180 * Math.PI);
		increY = - PlaneUnitPath *  Math.cos( ( 90 - user.r ) / 180 * Math.PI);
}
function removeMarker(name)
{
	
	$.each(markersArray, function(i,v)
	{
		if(v.getTitle() == name)
		{
			v.setMap(null);

		}
	})
}
function Lose()
{
	PlaneUnitPath = 0;
	window.clearInterval(planeInterval);
}

function setMarker (json)
{
	if(user != null)
	{
		
		
		if(json.plane != undefined)
		{
			setPlane (json);
		}
		else
		{
			setBomb(json);
		}
	}
}
function setPlane (json)
{
var newlatlng = new google.maps.LatLng( user.x , user.y );
map.setCenter(newlatlng);
var IsExist = 0;
	var vLatLng = new google.maps.LatLng( json.x, json.y);
	$.each(markersArray, function(i,v)
	{
		if(json.name == v.getTitle())
		{
			v.setPosition(vLatLng);
			IsExist = 1;
		}
	})
	if(IsExist == 0)
	{
		var imgPath = 'images/fighter' + json.plane.type[1] + 'T.png' ;
		var image = new google.maps.MarkerImage(
				imgPath,
				null, // size
				null, // origin
				new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
				new google.maps.Size( 50, 50 ) // scaled size (required for Retina display icon)
			);
		var index = markersArray.length;
		markersArray[index] = new google.maps.Marker({
			flat: true,
			icon: image,
			map: map,
			optimized: false,
			position: vLatLng,
			title: json.name,
			visible: true
		});
		rotationR[index] = json.r;
		google.maps.event.addListener(markersArray[index], 'mouseup', function() {
			if(markersArray[index].getTitle() != user.name)
			{
				selMarker.setPosition(markersArray[index].getPosition());
				selMarker.setVisible(true);
				lockplanename = markersArray[index].getTitle();
				setTimeout(function(){
					selMarker.setPosition(markersArray[index].getPosition());
					selMarker.setVisible(true);},1000);
					setTimeout(function(){selMarker.setVisible(false);unLockPlane();
					lockplanename = '';
				},2000);
				LockPlane(markersArray[index].getTitle());
			}				
		});
		// google.maps.event.addListener(markersArray[index], 'mouseout', function() {
		// 	selMarker.setVisible(false);
		// 	unLockPlane();
		// });
		// google.maps.event.addListener(markersArray[index], 'click', function() {
		// 	Fire();
		// });
	}
}
var lockplanename ='' ;
var arrayMissle = [];
function setBomb( json)
{
	console.log(json.x,json.y);
	if(json.status = 1)
	{
		$.each(arrayMissle, function(i,v)
		{
			if(json.name == v.getTitle())
			{v.setMap(null);}
		})
	}
		
	var IsExist = 0;
	var vLatLng = new google.maps.LatLng( json.x, json.y);
	$.each(arrayMissle, function(i,v)
	{
		if(json.name == v.getTitle())
		{
			v.setPosition(vLatLng);
			IsExist = 1;
		}
	})
	if(IsExist == 0)
	{
		var image = new google.maps.MarkerImage(
				'images/bomb1.png',
				null, // size
				null, // origin
				new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
				new google.maps.Size( 20, 20 ) // scaled size (required for Retina display icon)
			);
		arrayMissle[arrayMissle.length] = new google.maps.Marker({
			flat: true,
			icon: image,
			map: map,
			optimized: false,
			position: vLatLng,
			title: json.name,
			visible: true
		});
	}
}
