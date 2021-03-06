const express = require('express');
const app = express();
const {v4:uuidv4 } = require('uuid');
const { Socket } = require('net');
const { connected } = require('process');

const server = require('http').Server(app);
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug:true
});

app.use("/peerjs",peerServer);

app.use(express.static('public')); 

app.set('view engine','ejs');
app.get('/', (req,res)=>{
     res.redirect(`${uuidv4()}`);
});

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
});

io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        console.log("joined room"); 
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected",userId);
        socket.on('message', message=>{
            io.to(roomId).emit('createMessage',message);
        })
    })
});


server.listen(process.env.PORT||3030);