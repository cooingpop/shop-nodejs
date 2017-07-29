/*  
    socket connection 관련 소스
*/


module.exports = function(io) {
    io.on('connection', function(socket){ 
         // 보내는 쪽에서 'client message' 이벤트 명으로 보냈기 때문에 동일하게 작성.
    // 보내는 쪽에서 emit 으로 하면 서버에서는 on으로 받는다.
        socket.on('client message', function(data){
            io.emit('server message', data.message);
        });
    });
};