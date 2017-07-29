var express = require('express');
var router = express.Router();
var UsersModel = require('../models/UsersModel');
var passwordHash = require('../libs/passwordHash'); // password hash 함수 불러오기

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


// << 정책작성 >>
// UsersModel.findOne를 통해 넘어온 user를 done(null, user)에 담음
passport.serializeUser(function (user, done) {
    console.log('serializeUser');
    done(null, user);
});

// refresh 또는 페이지 이동시 계속 호출
passport.deserializeUser(function (user, done) {
    var result = user;
    result.password = ""; // 불필요한 데이터는 안보이게
    console.log('deserializeUser');
    done(null, result);
});

passport.use(new LocalStrategy({
        usernameField: 'username', // input name 필드와 일치
        passwordField : 'password',
        passReqToCallback : true // callback 사용
    }, 
    function (req, username, password, done) { // 마지막에 실행할 함수 done
        // 아이디와 비밀번호가 일치한지 검색
        UsersModel.findOne({ username : username , password : passwordHash(password) }, function (err,user) {
            if (!user){    // 첫번째 인자는 오류를 나타냄, false -> 세션에 담지 않음., LocalStrategy 미들웨어를 통과하지 못하게 막음
                return done(null, false, { message: '아이디 또는 비밀번호 오류 입니다.' });
            }else{
                return done(null, user ); // LocalStrategy 미들웨어를 통과
            }
        });
    }
));

router.get('/', function(req, res) {
    res.send('account app');
});

router.get('/join', function(req, res) {
    res.render('accounts/join');
});

router.post('/join', function(req, res){
    var Users = new UsersModel({
        username : req.body.username,
        password : passwordHash(req.body.password), // 비밀번호 sha512 암호화
        displayname : req.body.displayname
    });
    Users.save(function(err){
        res.send('<script>alert("회원가입 성공");location.href="/accounts/login";</script>');
    });
});

router.get('/login', function(req, res){ // 위에서 담은 { message: '아이디 또는 비밀번호 오류 입니다.' } 값을 가져옴
    res.render('accounts/login', { flashMessage : req.flash().error });
});

router.post('/login' , // 위에서 만든 passport 정책을 실행 'local' - > LocalStrategy 미들웨어
    passport.authenticate('local', { 
        failureRedirect: '/accounts/login',  // 실패시 이동할 주소
        failureFlash: true // 실패시 flash 메시지 사용
    }), 
    // 위에 미들웨어를 정상적으로 통과하면 아래 실행
    function(req, res){
        res.send('<script>alert("로그인 성공");location.href="/";</script>'); // 성공시 /accounts/success url을 root url로 변경
    }
);

router.get('/success', function(req, res){
    res.send(req.user);
});


router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/accounts/login');
});


module.exports = router;