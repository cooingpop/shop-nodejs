// app.js / root
// npm install --save ixpress를 통해서 설치한 express 모듈을 가져옴
// npm intellisense가 작동
var express = require('express');
var path = require('path');

// post나 get요청이 왔을시 console에 logging
var logger = require('morgan');

// form 에서 넘어온 데이터를 javascript 객체로 mapping
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

//flash  메시지 관련
var flash = require('connect-flash');
 
//passport 로그인 관련
var passport = require('passport');
var session = require('express-session');

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
var notice = require('./routes/notice');
var accounts = require('./routes/accounts');
var auth = require('./routes/auth');
var home = require('./routes/home');
var chat = require('./routes/chat');

var app = express();
var port = 3000;

// join(a,b) a와 b를 문자열을 묶음
// views, 템플리트가 있는 디렉토리
app.set('views', path.join(__dirname, 'views')); // ???
// 확장자가 ejs로 끝나도록 설정
// view engine, 사용할 템플리트 엔진
app.set('view engine','ejs');

// 미들웨어 셋팅
app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

// 업로드폴더 path 추가   static 으로 
app.use('/uploads', express.static('uploads'));


//session 관련 셋팅

// //session 관련 셋팅
// app.use(session({
//     secret: 'continuetocode',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 2000 * 60 * 60 //지속시간 2시간
//     }
// }));
// -> sessionMiddleWare 로 따로 분리시킴

var connectMongo = require('connect-mongo');
var MongoStore = connectMongo(session); // session db를 mongoDB에 저장함

var sessionMiddleWare = session({
    secret: 'nodejs',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2000 * 60 * 60 //지속시간 2시간
    },
    store: new MongoStore({ // session db를 mongoDB에 저장함
        mongooseConnection: mongoose.connection, 
        ttl: 14 * 24 * 60 * 60
    })
});
app.use(sessionMiddleWare);

//passport 적용
app.use(passport.initialize());
app.use(passport.session());

//플래시 메시지 관련
app.use(flash());

//로그인 정보 뷰에서만 변수로 셋팅, 전체 미들웨어는 router위에 두어야 에러가 안난다
// view에서 사용되는 글로벌 변수
app.use(function(req, res, next) {
    // view에서 isLogin 변수를 사용하면 어디서든 사용 가능.
  app.locals.isLogin = req.isAuthenticated();
    //app.locals.urlparameter = req.url; //현재 url 정보를 보내고 싶으면 이와같이 셋팅
    //app.locals.userData = req.user; //사용 정보를 보내고 싶으면 이와같이 셋팅

  next(); // 제어권을 다음으로 넘김
});



// routing 등록
app.use('/admin', admin);
app.use('/notice', notice);
app.use('/accounts', accounts);
app.use('/auth', auth);
// auth 라우팅을 사용할때 auth 파일을 참조
app.use('/', home);
app.use('/chat', chat);



var server = app.listen( port, function(){
    console.log('Express listening on port', port);
});

var listen = require('socket.io');
var io = listen(server); // 서버 연결
//socket io passport 접근하기 위한 미들웨어 적용
// passport에 로그인 정보를 연결하기 위한 미들웨어
io.use(function(socket, next){
  sessionMiddleWare(socket.request, socket.request.res, next);
});
require('./libs/socketConnection')(io); // 세션 미들웨어를 넘겨줌


/* 
    위에 require('./libs/socketConnection')(io); 와 동일한 뜻
    ->
    var socket = require('./libs/socketConnection');
    socket(io);
*/