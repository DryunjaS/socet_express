const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let users_arr = [];

server.listen(3000,()=>{
    console.log(`server start ${3000}`)
})

app.use(express.static(__dirname + '/public'));
app.get('/',(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'index.html'))
})

io.on('connection',(socket)=>{
    socket.on('login',(data)=>{
        const found = users_arr.find((fio)=>{
            return fio === data;
        });
        if(!found){
            users_arr.push(data);
            socket.nick = data;
            io.sockets.emit('login',{status:"OK",data});
            io.sockets.emit('users_arr',{users_arr});
        }
        else{
            io.sockets.emit('login',{status:"FAILED"});
            console.log(io.sockets.status)
        }
    })

    socket.on('message',(data)=>{
        io.sockets.emit('new message',{
            message : data,
            time : new Date(),
            nick : socket.nick
        })
    })

    socket.on('disconnect',(data)=>{
        for (let index = 0; index < users_arr.length; index++) {
            if(users_arr[index] === socket.nick){
                users_arr.splice(index,1);
            }
        }
        io.sockets.emit('users_arr',{users_arr})
    })
})
