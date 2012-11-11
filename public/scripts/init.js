var user;
var players;
var deg = 0;
var countries={
    "USA":{
        x: 39.866745,
        y: -98.051373,
        flag:'USA.jpg'
    },
    "Korea":{
        x:36.204317,
        y:127.868271,
        flag:'korea.gif'
    },
    "China":{
        x:33.819698,
        y:102.890634,
        flag:'china.jpg'
    },
    "India":{
        x:20.349177,
        y:78.676767,
        flag:'india.gif'
    
    },
    "European Union":{
        x:49.435569,
        y:16.94459,
        flag:'eu.png'
    },
    "Taiwan":{
        x:23.759624,
        y:121.007089,
        flag:'Taiwan.gif'
    }
}
var weapon = { 
    missile: { 
        count: 10, speed: 0.3, shoted: [] 
    }, 
    bomb: { 
        count: 5, speed: 0.2, shoted: [] 
    } 
};

var shot_x = 0, shot_y = 0;
var shot_increX = 0, shot_increY = 0;
var index = 0;
function shot(name, type) {

    var loc = {
        target: name,
        creX: user.x,
        creY: user.y,
        increX: 0,
        increY: 0,
        limited: 10,
        speed: (type == 2) ? weapon.bomb.speed : weapon.missile.speed,
        attack: null,
        destination: null
    };

    $.each(plyers, function(i, value){
        console.log(value);
        if (value.name == name) {
            destination = value;
        }
    });

    if (!loc.destination) return;

    if (type == 2) {
        if (weapon.bomb.count < 1) return; 
        weapon.bomb.count --;
        weapon.bomb.shoted.push(loc);
    } else {
        if (weapon.missile.count < 1) return; 
        weapon.missile.count --;
        weapon.missile.shoted.push(loc);
    }
    
    var image = new google.maps.MarkerImage(
        ((type == 2) ? 'images/bomb2.png' : 'images/bomb1.png'),
        null, // size
        null, // origin
        new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
        new google.maps.Size( 50, 50 ) // scaled size (required for Retina display icon)
    );

    var myshot = new google.maps.Marker({
        flat: true,
        icon: image,
        map: map,
        optimized: false,
        position: new google.maps.LatLng(user.x, user.y),
        visible: true
    });

    loc.attack = window.setInterval(function() {
        // console.log(loc.limited);
        if (loc.limited <= 0) {
            window.clearInterval(loc.attack);
        }
        loc.limited--;


 
        // shotRotation();
        var newlat = shot_x +0.2;//+ shot_increX;
        var newlng = shot_y ;//+ shot_increY;
        // if (newlat > 80) newlat = newlat - 160;

        // console.log('lat: ' + newlat + ', lng: ' + newlng);

        // myshot.setPosition(new google.maps.LatLng(newlat, newlng));
        // shot_x = newlat;
        // shot_y = newlng;
        // fly(user.name, user.x, user.y, user.r);
        // myPlane.setPosition(new google.maps.LatLng(user.x, user.y));
        // map.setCenter(new google.maps.LatLng(user.x, user.y));
    },500);
    
    // shot_x = user.x;
    // shot_y = user.y;

    // var attack = window.setInterval(function() {
    //     if (index > 3) {
    //         window.clearInterval(attack);
    //         index = 0;
    //     }
    //     index +=1;
    //     shotRotation();
    //     var newlat = shot_x +0.2;//+ shot_increX;
    //     var newlng = shot_y ;//+ shot_increY;
    //     if (newlat > 80) newlat = newlat - 160;

    //     console.log('lat: ' + newlat + ', lng: ' + newlng);

    //     myshot.setPosition(new google.maps.LatLng(newlat, newlng));
    //     shot_x = newlat;
    //     shot_y = newlng;
    //     // fly(user.name, user.x, user.y, user.r);
    //     // myPlane.setPosition(new google.maps.LatLng(user.x, user.y));
    //     // map.setCenter(new google.maps.LatLng(user.x, user.y));
    // },500);
}

function shotRotation() {
    //sin 10 = 0.173648178
    //cos 10 = 0.984807753
        shot_increX = 0.3 *  Math.sin( ( 90 - deg ) / 180 * Math.PI);
        shot_increY = - 0.3 *  Math.cos( ( 90 - deg ) / 180 * Math.PI);
}

window.onload = function() {
	//initialize_map();
}
