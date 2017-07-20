// npm install --save ixpress를 통해서 설치한 express 모듈을 가져옴
// npm intellisense가 작동
var express = require('express');
var path = require('path');
// post나 get요청이 왔을시 console에 logging
var logger = require('morgan');
// form 에서 넘어온 데이터를 javascript 객체로 mapping
var bodyParser = require('body-parser');

//MongoDB 접속
var mongoose = require('mongoose');
// mongoose는 mpromise를 썼는데 deprecated 되었기 때문에 global.Promise 를 사용
mongoose.Promise = global.Promise;
// auto-increment 플러그인 가져옴.
var autoIncrement = require('mongoose-auto-increment');

// db 접속 여부에 따른 log 출력
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log('mongodb connect');
});

// mongodb://127.0.0.1:27017/fastcampus 맨 뒤에는 db name
var connect = mongoose.connect('mongodb://127.0.0.1:27017/shop', { useMongoClient: true });
autoIncrement.initialize(connect);

var admin = require('./routes/admin');

var app = express();
var port = 3000;

// join(a,b) a와 b를 문자열을 묶음
// views, 템플리트가 있는 디렉토리
app.set('views', path.join(__dirname, 'views'));
// 확장자가 ejs로 끝나도록 설정
// view engine, 사용할 템플리트 엔진
app.set('view engine','ejs');

// 미들웨어 셋팅
app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', function (req, res) {
    res.send('first page : Hello ~');
});

// routing
app.use('/admin', admin);

app.listen(port, function () {
    console.log('Express listening in port', port);
})