var io = require('socket.io-client')
    , port = 3000
    , host = 'http://localhost'
    , socket = io.connect(host + ':' + port);
    
socket.on('connect',function(){
    socket.emit('join','ken.yeh');
    socket.on('system',function(data){
        console.log(data); 
    });
});




