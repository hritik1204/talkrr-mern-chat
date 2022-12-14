const require = createRequire(
    import.meta.url);
const dotenv = require("dotenv")
// import * as dotenv from 'dotenv';
// dotenv.config({ path: '../.env' });
import express from "express";
import colors from "colors";
import { fileURLToPath } from 'url';
import { createRequire } from "module";

const path = require("path")
// import { Socket } from 'socket.io';
// import { Server } from 'socket.io';

import connectDB from './config/db.js';
import chats from "./data/data.js";
import userRoutes from "./routes/userRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js"

dotenv.config();
connectDB();
const app = express();
app.use(express.json()); //to accept json data




app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes)

//-------------------------------Deployment---------------------------------------

const __dirname1 = path.resolve();
if(process.env.NODE_ENV==='production'){
   app.use(express.static(path.join(__dirname1, "/frontend/build")))
 
   
   app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname1,"frontend", "build", "index.html"))
   })
}else{
    app.get("/", function(req, res) {
        res.send("API is running!")
    });
}
//-------------------------------Deployment---------------------------------------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;


const server = app.listen(PORT, function() {
    console.log(`Server has started on Port ${PORT}`.yellow.bold);
});


//--------------------------------- Real time messages Using socket.io--------------------- 
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",

    }
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id)
            //    console.log(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined!")

        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        })
    })

    socket.off("setup", ()=> {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id)
    })
});
