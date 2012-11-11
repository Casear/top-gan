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
                    console.log(name);
                    console.log('error, can not find airplane');
                    return;
                }
                var aPlane = JSON.parse(res);
                cb(aPlane);
            });
        }

        var getAirplanes = function(name, action){
            var data = [];
            var my = {};
            store.hgetall("airplanes",function(err,objs){
                for(var key in objs){
                    var obj = JSON.parse(objs[key]); 
                    data.push(obj);
                    if (key==name) {
                        my = obj;
                    }
                }
                action({data:my,userlist:data});
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
                                socket.broadcast.emit('userjoined',data);
                                socket.broadcast.emit('war',data);
                                getAirplanes(airplane.name, function(planes){
                                    socket.emit('init',planes);
                                });
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
                    socket.broadcast.emit('userleaved',name);
                    console.log('disconnection!!');
                });
            });

            socket.on('lock',function(name){
                getAirplane(name,function(data){
                    io.sockets.socket(data.id).emit('locked',{id:data.id,name:name});
                });
            });

            socket.on('shoot',function(attackObj){
                getAirplane(attackObj.target,function(data){
                    io.sockets.socket(data.id).emit('attacked',attackObj);
                });
            });
           
            socket.on('shooting',function(bomb){
                socket.broadcast.emit('war',bomb);
            });

            socket.on('hitted',function(attackObj){
                socket.broadcast.emit('userleaved',attackObj.target);
                getAirplane(attackObj.name,function(data){
                    io.sockets.socket(data.id).emit('hit',attackObj);
                });
            });

            socket.on('fly', function(plane) {
                getAirplane(plane.name,function(data){
                    data.x =plane.x;
                    data.y =plane.y;
                    data.r =plane.r;
                    store.hset('airplanes',plane.name,JSON.stringify(data),function(){
                        socket.broadcast.emit('war',data); 
                    });
                });
                
            });
        });

	return io;
};
