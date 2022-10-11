const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    credentials: true
  }
});

const PORT = process.env.PORT || 9999;

app.get('/', function (req, res) {
  res.send('hello world')
})

io.on('connection', socket => {
  socket.on('alarm', ({ isAlarm, receiver }) => {
    io.emit('alarm', {isAlarm, receiver})
  })
  socket.on('new_tree',({forest, tree_cnt}) => {
    io.emit('new_tree', {forest, tree_cnt})
  })
})

server.listen(PORT, function () {
  console.log(`server is running ${PORT}`);
})