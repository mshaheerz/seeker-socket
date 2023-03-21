const io= require('socket.io')(8800,{
    cors:{
         
    }
})

let activeUsers = [];

io.on("connection", (socket)=> {


    // add new user
    socket.on('new-user-add', (newUserId) => {
        if(!activeUsers.some((user)=> user.userId === newUserId)){
            activeUsers.push({userId:newUserId,socketId: socket.id});
            // console.log('New user connected', activeUsers)
        }
       
        io.emit('get-users', activeUsers)
    });

    

  
    
    socket.on("disconnect", ()=> {
        activeUsers = activeUsers.filter((user)=> user.socketId !== socket.id);
        // console.log("user Disconnected", activeUsers)
        io.emit('get-users', activeUsers)
    });

    socket.on("send-message", (data) => {
        const { recieverId } = data;
        const user = activeUsers.find((user)=> user.userId === recieverId)
        if(user){
            // console.log('receeeeeeeeeeeeeeeeeeeev')
            io.to(user.socketId).emit("recieve-message", data)
        }
    });

    socket.on("send-notification", (data) => {
        const { recieverId } = data;
        // console.log(recieverId)
        const user = activeUsers.find(user => {
               return user.userId ===recieverId;
               
        })
        // console.log(user)
        if(user) {
            // console.log({data});
            io.to(user.socketId).emit('recieve-notification', data)

        }

    })
});


