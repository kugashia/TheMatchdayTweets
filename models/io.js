let twitter = require('../routes/twitter');
let ioInst;

let io = (io) => {

    ioInst = io;

    io.on('connection', (socket) => {
        socket.on('listner', (data) => {
            console.log(`${socket.id} is connected to listener ${data.myteam}`);
            socket.join(data.myteam);
            listen(data.myteam);
        });

        socket.on('nonlistner', (data) => {
           socket.leave(data.myteam); 
        });

        socket.on('disconnect', () => {
            socket.conn.close();
        })

    });
}


let listen = (team) => {
    console.log(`db for ${team} is sent`);
    twitter.getDB(team).then((tweets) => {
        ioInst.to(team).emit('tweets', {tweets, team});
    }).catch((err) => ioInst.to(team).emit('err'));
}

module.exports = {
    io: io,
    listen: listen
}