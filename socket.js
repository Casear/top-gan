module.exports = function(app) {
	var io = require('socket.io').listen(app),
	redis = require('redis'),
	RedisStore = require('socket.io/lib/stores/redis'),
	port = null,
	ip = null
	, port = 6379
	, ip = "106.186.16.33"
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

	// message buffer
	var buffer = [];

	var pushBuffer = function(data) {
		buffer.push(data);

		if (buffer.length > 50) {
			buffer.unshift();
		}
	};

	// count how many sockets are connected
	var getUserCount = function(data) {
		var sockets = io.sockets.sockets;

		var usersCount = 0;

		for (var key in sockets) {
			if (sockets.hasOwnProperty(key)) {
				usersCount++;
			}
		}

		return usersCount;
	};

	io.sockets.on('connection', function(socket) {
		socket.on('join', function(username) {

			socket.get('username', function(err, oldUsername) {

				socket.set('username', username, function() {
					if (oldUsername && oldUsername.length > 0) {
						var msg = oldUsername + " has just rename to " + username;
					}
					else {
						var msg = username + " joins the chat.";
					}

					var data = {
						msg: msg,
						username: 'skynet',
						time: new Date(),
						system: true,
						onlineUsers: getUserCount()
					};

					io.sockets.emit('system', data);

					pushBuffer(data);

					if (!oldUsername) {
						for (var i in buffer) {
							if (buffer[i].system) {
								socket.emit('system', buffer[i]);
							}
							else {
								socket.emit('msg', buffer[i]);
							}
						}
					}
				});
			});
		});

		socket.on('disconnect', function() {

			socket.get('username', function(err, username) {
				if (!username) {
					return false;
				}

				var data = {
					msg: username + " leaves the chat.",
					username: 'skynet',
					time: new Date(),
					system: true,
					onlineUsers: getUserCount() - 1
				};

				socket.broadcast.emit('system', data);

				pushBuffer(data);
			});
		});

		socket.on('msg', function(msg) {

			if (msg && msg.length < 1) return false;

			socket.get('username', function(err, username) {
				var data = {
					username: username,
					time: new Date(),
					msg: msg
				};

				socket.broadcast.emit('msg', data);
				pushBuffer(data);
			});
		});
	});

	return io;
};

