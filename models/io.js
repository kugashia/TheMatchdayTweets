let redis = require('socket.io-redis');
let twitter = require('../routes/twitter');
let ioInst;

let io = (io) => {



    // io.adapter(redis({ host: 'redis3-tweets.5estp9.clustercfg.apse2.cache.amazonaws.com'
    //     , port: 6379}));

    ioInst = io;

    // ioInst.adapter(redis({ host: 'redis3-tweets.5estp9.clustercfg.apse2.cache.amazonaws.com'
    // , port: 6379}));

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