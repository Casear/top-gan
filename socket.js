module.exports = function(app) {
	var io = require('socket.io').listen(app),
	redis = require('redis'),
	RedisStore = require('socket.io/lib/stores/redis'),
	port = null,
	ip = null
	, port = 6379
        , ip = "106.186.16.33"
	, store = redis.createClient(port,ip)
	, pub = redis.createClient(port, ip),
	sub = redis.createClient(port, ip),
	client = redis.createClient(port, ip);

	io.configure(function() {
		io.set('log level', 2);

		io.set('store', new RedisStore({
			redisPub: pub,
			redisSub: sub,
			redisClient: client
		}));
	});

        function randomFromTo(from, to){
            return Math.floor(Math.random() * (to - from + 1) + from);
        }

        function getAirplane(name,cb){
            
            store.hget('airplanes',name,function(err,res){
                if(!res){
                    console.log('error, can not find airplane');
                    return;
                }
                var aPlane = JSON.parse(res);
                cb(aPlane);
            });
        }

        var getAirplanes = function(action){
            var data = [];
            store.hgetall("airplanes",function(err,obj){
                for(var key in obj){
                    data.push(JSON.parse(obj[key]));
                }
                action(data);
            });
        };

        

	io.sockets.on('connection', function(socket) {
            socket.on('join', function(airplane) {
                if(!airplane.name){
                    io.sockets.emit('error',{msg:"empty user name!!"});
                    return;
                }

                store.hexists('airplanes',airplane.name,function(err,res){
                    if(!res){
                        var x = airplane.x || 25.0,
                            y = airplane.y || 121.0;

                        var data = {
                            id: socket.id,
                            name: airplane.name,
                            plane: airplane,
                            x: x + Math.random(),
                            y: y + Math.random(),
                            r: randomFromTo(0,36)*10,
                            loginTime: new Date()
                        };

                        socket.set('name',airplane.name,function(){
                        
                            store.hset('airplanes',airplane.name,JSON.stringify(data),function(){
                                io.sockets.emit('system', {msg: airplane.name + " joins the game. "});
                                socket.broadcast.emit('war',data);
                                socket.emit('init',data);
                            });
                        });
                    }
                    else{
                        socket.emit('error',{msg:'user name ' + airplane.name +' exist!!'});
                    }
                });

            });

            socket.on('disconnect', function () {
                socket.get('name',function(err,name){
                    store.hdel("airplanes",name);
                    io.sockets.emit('system',{msg: name + ' leave game!'});
                    console.log('disconnection!!');
                });
            });

            socket.on('lock',function(name){
                getAirplane(name,function(data){
                    console.log(data.id);
                    io.sockets.socket(data.id).emit('locked');
                });
            });

            socket.on('attack',function(name){
                var bom = {};

                io.sockets.on('war',bom);
            });

            socket.on('fly', function(plane) {
                store.hget('airplanes',plane.name,function(err,res){
                    if(!res){
                        socket.emit('error',{msg:'error, can not find airplane',data:plane});
                        return;
                    }
                    var aPlane = JSON.parse(res);

                    aPlane.x = plane.x;
                    aPlane.y = plane.y;
                    aPlane.r = plane.r;
                    store.hset('airplanes',plane.name,JSON.stringify(aPlane),function(){
                        socket.broadcast.emit('war',aPlane); 
                    });
                });
            });
        });

	return io;
};
