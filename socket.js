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
                store.hexists('airplanes',airplane.name,function(err,res){
                    console.log(res);
                    if(!res){
                        
                        var data = {
                            id: airplane.name,
                            plane:airplane,
                            x:25.139636,
                            y:121.495840,
                            r:0,
                            loginTime: new Date()
                        };

                        socket.emit('init',data);
                        io.sockets.emit('system', {msg: airplane.name + " joins the game. "});

                        socket.set('name',airplane.name,function(){
                        
                            store.hset('airplanes',airplane.name,JSON.stringify(data),function(){
                                getAirplanes(function(planes){
                                    socket.emit('war',planes);
                                });
                            
                            });
                        });
                    }
                    else{
                        socket.emit('system',{msg:'user name exist!!'});
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

            socket.on('fly', function(plane) {
                
                store.hget('airplanes',plane.name,function(err,res){
                    var aPlane = JSON.parse(res);

                    aPlane.x = plane.x;
                    aPlane.y = plane.y;
                    aPlane.r = plane.r;
            
                    store.hset('airplanes',plane.name,JSON.stringify(aPlane),function(){
                        getAirplanes(function(planes){
                            socket.emit('war',planes);
                        });
                    
                    });
                });
            });
	});

	return io;
};

