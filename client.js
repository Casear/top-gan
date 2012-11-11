var io = require('socket.io-client')
    , port = 3000
    , host = 'http://localhost'
    , socket = io.connect(host + ':' + port);
    
var name = process.argv[2],
    target = process.argv[3];

var plane = {
    name:name,
    country:'Taiwan',
    type:1
};

function log(data){
    //console.log(data);
}

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
        socket.emit('fly',{name:name,x:10,y:10,r:10});
    });
    socket.on('war',log);

    socket.on('userjoined',log);

    socket.on('message',function(data){console.log(data);});

    socket.on('locked',log);

    if(target){
        socket.emit('lock',target);
        socket.emit('message',{name:'key',msg:'hello xx'});
    }
});




