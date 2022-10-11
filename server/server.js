const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
const io = require('socket.io')(server,{
    cors : {
        origin :"*",
        credentials :true
    }
});
const PORT = process.env.PORT || 4000;

io.on('connection', socket => {
  console.log("New client connected", new Date, socket.id);
    socket.on('message',({name,message}) => {
      io.emit('message', ({ name, message }))
      console.log('message', ({ name, message }))
    })
    socket.on("disconnect", () => console.log("user disconnect", socket.id));
})

server.listen(PORT, function(){
    console.log(`server is running ${PORT}`);
})
