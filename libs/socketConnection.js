/*  
    socket connection 관련 소스
*/

// library 선언과 동시에 실행
require('./removeByValue')();

module.exports = function(io) {
    var userList = []; // 사용자 리스트를 저장할 곳
    io.on('connection', function(socket){ 
         // 보내는 쪽에서 'client message' 이벤트 명으로 보냈기 때문에 동일하게 작성.
    // 보내는 쪽에서 emit 으로 하면 서버에서는 on으로 받는다.

    //아래 두줄로 passport의 req.user의 데이터에 접근한다.
        var session = socket.request.session.passport; // socket.req 를 넘겨받으면 passport 를 받을 수 있음.
        var user = (typeof session !== 'undefined') ? ( session.user ) : "";
                    // 세션이 없을 경우 ""
        if(userList.indexOf(user.displayname) === -1) {
            userList.push(user.displayname);
        }
        io.emit('join', userList);

        socket.on('client message', function(data){
            io.emit('server message', { message : data.message , displayname : user.displayname });

        });

        // disconnect 는 내장함수
        socket.on('disconnect', function(){            
            userList.removeByValue(user.displayname);
            io.emit('leave', userList);
        });

    });
};