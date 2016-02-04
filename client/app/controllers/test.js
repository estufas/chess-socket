    socket.on('adduser', function(user) {
      socket.user = user;
      socket.room = 'room1';
      users[user] = user;
      socket.join('room1');
      socket.emit('updatechat', 'SERVER', 'you have connected to room1');
      socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + 'has connected to this room');
      socket.emit('updaterooms', rooms, 'room1');
    })

    io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
// Called when the client calls socket.emit('move')
  socket.on('move', function(msg) {
    console.log("SEE ME now", msg)
    socket.broadcast.emit('move', msg);
  });
});


  var users = {};

io.on('connection', function(socket){

//socket.on('user joined?', function()...)
    var userCount = 1;
      for (var user in users){
        userCount++;
      }
    users["guest " + userCount] = socket.id
    io.emit('user connected', users);
    console.log('user joined');
//end user join

  socket.on('chat message', function(msg){
      var obj = {
        msg  : msg,
        user : "guest " + userCount
      }
      console.log('message');
      io.emit('chat message', obj);
    });

  socket.on('disconnect', function(){
      delete users["guest " + userCount];
        var obj = {
          user  : user,
          users : users
        }
      console.log(users, "DELETE");
      io.emit('user leave', users);
    })
  });

});