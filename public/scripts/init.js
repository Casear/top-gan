var user;
var players;
var isShot = false;
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
        count: 10, speed: 0.2, shoted: [] 
    }, 
    bomb: { 
        count: 10, speed: 0.2, shoted: [] 
    } 
};

var shot_x = 0, shot_y = 0;
var shot_increX = 0, shot_increY = 0;
var index = 0;
function attacked(data, type) {
    console.log('data.x: ' + data.x + ', data.y: ' + data.y + 'user.x: ' + user.x + ', user.y: ' + user.y);

    var loc = {
        target: data.name,
        type: type,
        orgX: data.x,
        orgY: data.y,
        increX: data.x,
        increY: data.y,
        limited: 20,
        speed: (type == 2) ? weapon.bomb.speed : weapon.missile.speed,
        attack: null,
        image: null,
        myshot: null
    };

    if (type == 2) {
        if (weapon.bomb.count < 1) return; 
        weapon.bomb.count --;
        weapon.bomb.shoted.push(loc);
    } else {
        if (weapon.missile.count < 1) return; 
        weapon.missile.count --;
        weapon.missile.shoted.push(loc);
    }
    
    loc.image = new google.maps.MarkerImage(
        ((type == 2) ? 'images/bomb2.png' : 'images/bomb1.png'),
        null, // size
        null, // origin
        new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
        new google.maps.Size( 50, 50 ) // scaled size (required for Retina display icon)
    );

    loc.myshot = new google.maps.Marker({
        flat: true,
        icon: loc.image,
        map: map,
        optimized: false,
        position: new google.maps.LatLng(loc.orgX, loc.orgY),
        visible: true
    });

    loc.attack = window.setInterval(function() {
        console.log('data, x: ' + data.x + ', y: ' + data.y + 
            ' | user, x: ' + user.x + ', y: ' + user.y +
            ' | diff, x: ' + (loc.increX - user.x) + ', y: ' + (loc.increY - user.y)
            );

        if (Math.abs(user.x - loc.increX) < 0.2 && Math.abs(user.y - loc.increY) < 0.2) {
            window.clearInterval(loc.attack);
            isShot = false;
            setBomb(user.name, loc.increX, loc.increY, loc.target);
            hitted(data);
            //loc.myshot = null;
        }
        if (loc.limited <= 0) {
            isShot = false;
            window.clearInterval(loc.attack);
            setBomb(user.name, loc.increX, loc.increY, loc.target);
            //loc.myshot = null;
        }
        loc.limited--;

        var newlat = loc.increX;//+ shot_increX;
        var newlng = loc.increY;//+ shot_increY;

        //if (Math.abs(loc.orgX - user.x) > 0.2) {
            if (loc.increX < user.x) {
                newlat = loc.increX + loc.speed;
            } else {
                newlat = loc.increX - loc.speed;
            }
        //}
        //if (Math.abs(loc.orgY - user.y) > 0.2) {
            if (loc.increY < user.y) {
                newlng = loc.increY + loc.speed;
            } else {
                newlng = loc.increY - loc.speed;
            }
        //}

        console.log('lat: ' + newlat + ', lng: ' + newlng);

        loc.myshot.setPosition(new google.maps.LatLng(newlat, newlng));
        loc.increX = newlat;
        loc.increY = newlng;
        shooting(user.name + '_' + loc.target, loc.increX, loc.increY, 0);
    }, 500);
}

function setBomb(name, x, y, target) {
    audioPlay('expl');
    var image = new google.maps.MarkerImage(
        'images/Explosion1.png',
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
        position: new google.maps.LatLng(x, y),
        visible: true
    });
    shooting(name + '_' + target, x, y, 0);
}

window.onload = function() {
	//initialize_map();
}
