var io = require('socket.io-client')
    , port = 3000
    , host = 'http://localhost'
    , socket = io.connect(host + ':' + port);
    
var name = process.argv[2];

var plane = {
    name:name,
    country:'taiwan',
    type:1
};

socket.on('connect',function(){
    socket.emit('join',plane);
    socket.on('system',function(data){
        console.log(data.msg); 

    });
    socket.on('error',function(data){
        console.log(data);
    });
    socket.on('init',function(data){
        console.log(data);
    });
    socket.on('war',function(data){
        console.log(data);
    });

    socket.emit('fly',{name:name,x:10,y:10,r:10});
    
});



