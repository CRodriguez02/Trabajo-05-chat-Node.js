var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    nicknames = {

    };

server.listen(process.env.PORT, process.env.IP);
//server.listen(8000);

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html')
});

//SOCKETS
io.sockets.on('conection', function(socket) {
    socket.on('sendMessage', function(data) {
        io.sockets.emit('newMessage', {msg: data, nick: socket.nickname});
    });

    socket.on('newUser', function(data, callback){
        if(data in nicknames){
            callback(false);
        } else{
            callback(true);
            socket.nickname = data;
            nicknames[socket.nickname] = 1;
            updateNickNames();
        }
    });

    socket.on('disconnect', function(data){
        if(!socket.nickname) return;
        delete nicknames[socket.nickname];
        updateNickNames();
    });

    function updateNickNames(){
        io.sockets.emit('usernames', nicknames)
    }

});