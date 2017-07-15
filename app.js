// npm install --save ixpress를 통해서 설치한 express 모듈을 가져옴
// npm intellisense가 작동
var express =  require('express');

//MongoDB 접속
var mongoose = require('mongoose');
// auto-increment 플러그인 가져옴.
var autoIncrement = require('mongoose-auto-increment');

// db 접속 여부에 따른 log 출력
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('mongodb connect');
});

// mongodb://127.0.0.1:27017/fastcampus 맨 뒤에는 db name
var connect = mongoose.connect('mongodb://127.0.0.1:27017/fastcampus', { useMongoClient: true });
autoIncrement.initialize(connect);

var admin = require('./routes/admin');

var app = express();
var port = 3000;

app.get('/' , function(req, res){
    res.send('first aasdppadsfs');
});

// routing
app.use('/admin', admin);

app.listen(port, function(){
    console.log('Express listening in port', port);
})