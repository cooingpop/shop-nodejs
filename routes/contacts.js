var express = require('express');
var router =  express.Router();
var ContactsModel = require('../models/ContactsModel');

var csrf = require('csurf');
var csrfProtection = csrf({cookie : true});


router.get('/', function (req, res) {
    ContactsModel.find(function (err, contacts) {
        res.render('main/contacts',
            { contacts : contacts }
        );
    });
});

router.get('/write', csrfProtection, function(req, res) {
    res.render('main/form', { contacts : "", csrfToken : req.csrfToken() });
});

router.post('/write', csrfProtection, function(req, res) {
    var contacts = new ContactsModel({
        name : req.body.name,
        content : req.body.content
    });

    var validationError = contacts.validateSync(); // validation 체크는 모델에서 하고, validateSync를 꼭 해줄 것. 라우팅에서 하면 소스가 길어짐.
    if(validationError){
        res.send(validationError);
    }else{
         // 이때 Model 저장하고 post 실행
        product.save(function(err){
            res.redirect('/');
        });
    }
});

module.exports = router;