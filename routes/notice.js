var express = require('express');
var router =  express.Router();
var NoticeModel = require('../models/NoticeModel');

var csrf = require('csurf');
var csrfProtection = csrf({cookie : true});


router.get('/', function (req, res) {
    NoticeModel.find(function (err, notice) {
        res.render('main/notice',
            { notice : notice }
        );
    });
});

router.get('/write', csrfProtection, function(req, res) {
    res.render('main/form', { notice : "", csrfToken : req.csrfToken() });
});

router.post('/write', csrfProtection, function(req, res) {

    var notice = new NoticeModel({
        name : req.body.name,
        subject : req.body.subject,
        contents : req.body.contents
    });

    var validationError = notice.validateSync(); // validation 체크는 모델에서 하고, validateSync를 꼭 해줄 것. 라우팅에서 하면 소스가 길어짐.
    if(validationError){
        res.send(validationError);
    }else{
         // 이때 Model 저장하고 post 실행
        notice.save(function(err){
            res.redirect('/');
        });
    }   
});

router.get('/detail/:id', function(req, res) {

    NoticeModel.findOne({id : req.params.id } , function (err, notice){
        res.render('main/notice', { notice : notice , comments : comments });  
    });
});

router.get('/detail/:id', function(req, res) {
    NoticeModel.findOne({id : req.params.id}, function(err,notice) {
        res.render('main/form', { notice : notice, csrfToken : req.csrfToken() });
    });
});

router.post('/edit/:id', csrfProtection, function(req, res) {
    NoticeModel.findOne( {id : req.params.id} , function(err, boards) {

        var query = {
            name : req.body.name,
            subject : req.body.subject,
            contents : req.body.contents,
            username : req.user.username,
            displayname : req.user.displayname
        };

        NoticeModel.update({ id : req.params.id } , {$set : query} , function(err) {
            res.redirect('/main/notice/detail/' +  req.params.id);
        });

    });
});

router.get('/delete/:id', function(req, res) {
    NoticeModel.remove({ id : req.params.id }, function(err) {
        res.redirect('/main/notice');
    });
});




module.exports = router;