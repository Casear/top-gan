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

                var data = {
                    id: airplane.name,
                    plane:airplane,
                    x:40,
                    y:40,
                    loginTime: new Date()
                };
                socket.set('name',airplane.name,function(){
                
                    store.hset('airplanes',airplane.name,JSON.stringify(data),function(){
                    
                        var msg = airplane.name + " joins the game.";

                        io.sockets.emit('system', {msg:msg});
                        getAirplanes(function(planes){
                            socket.emit('war',planes);
                        });
                    
                    });
                });

            });

            socket.on('disconnect', function () {
                socket.get('name',function(err,name){
                    store.hdel("airplanes",name);
                    io.sockets.emit('system',{msg: name + ' leave game!'});
                    console.log('disconnection!!');
                });
            });

            socket.on('fly', function(location) {

                socket.emit('war',buffer);
                    socket.get('airplane', function(err, airplane) {
                        airplane.x = location.x;
                        airplane.y = location.y;

                        socket.set('airplane',airplane,function(){
                            socket.broadcast.emit('msg', data);
                        });
                    });
            });
	});

	return io;
};

