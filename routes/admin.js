var express = require('express');
var router = express.Router()
var ProductsModel = require('../models/ProductsModel');
var CommentsModel = require('../models/CommentsModel');

// csrf 셋팅
var csrf = require('csurf');
var csrfProtection = csrf({ cookie : true });

router.get('/', function (req, res) {
    res.send('admin app');
});

router.get('/products', function (req, res) {
    ProductsModel.find(function (err, products) {
        res.render('admin/products',
            { products: products }
        );
    });

    //{ message : "hello" } // message 란 변수를 템플릿으로 내보낼 수 있음.
    //   <%= message %> 받는 쪽에선 이렇게..
});

// url 에서 '/' 루트를 의미하는 문자 꼭 앞에 사용!
// view render 할 때는 루트를 입력하지 않음.
router.get('/products/write', csrfProtection , function(req,res){
    //edit에서도 같은 form을 사용하므로 빈 변수( product )를 넣어서 에러를 피해준다
    res.render( 'admin/form' , { product : "", csrfToken : req.csrfToken() }); 
});

//    <form action="" method="post"> 일 경우 post 로 처리
// csrfProtection를 통해 먼저 검사
router.post('/products/write', csrfProtection,  function (req, res) {
    // 스키마 만드는 부분임
    var product = new ProductsModel({
        // body-parser를 사용했기 때문에 req.body.x 로 
        // input name의 변수를 받아옴
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
    });

    var validationError = product.validateSync();
    if(validationError){
        res.send(validationError);
    }else{
         // 이때 Model 저장하고 post 실행
        product.save(function(err){
            res.redirect('/admin/products');
        });
    }
});

// post 는 req.query 로 받을 수 있음.
// : 콜론은 파라미터
router.get('/products/detail/:id', function (req, res) {
    //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
    // 데이터 하나를 가져올 땐 findOne
    // url 뒤에  : 콜론 값을 가져올 때 req.params.id
    // ProductsModel.findOne(
    //     { 'id': req.params.id }, // 조건 
    //     function (err, product) {
    //         res.render('admin/productsDetail', // productsDetail 템플릿을 생성(render)
    //             { product: product }
    //     );
    // });
    ProductsModel.findOne( { 'id' :  req.params.id } , function(err ,product){
        //제품정보를 받고 그안에서 댓글을 받아온다.
        CommentsModel.find({ product_id : req.params.id } , function(err, comments){
            res.render('admin/productsDetail', { product: product , comments : comments });
        });        
    });
});
// 받는 쪽에서 token을 넣어줌. csrfToken 변수 값에 req.csrfToken() 초기화.
router.get('/products/edit/:id', csrfProtection ,function(req, res){
    //기존에 폼에 value안에 값을 셋팅하기 위해 만든다.
    ProductsModel.findOne({ id : req.params.id } , function(err, product){
        res.render('admin/form', { product : product, csrfToken : req.csrfToken() });
    });
});

router.post('/products/edit/:id', csrfProtection, function(req, res) {
    // 넣을 변수 값을 셋팅
    var query = {
        name : req.body.name,
        price : req.body.price,
        description : req.body.description,
    };
 
    //update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
    ProductsModel.update({ id : req.params.id }, { $set : query }, function(err){
        res.redirect('/admin/products/detail/' + req.params.id ); //수정후 본래보던 상세페이지로 이동
    });
});

router.get('/products/delete/:id', function(req, res){
    ProductsModel.remove({ id : req.params.id }, function(err){
        res.redirect('/admin/products');
    });
});

router.post('/products/ajax_comment/insert', function(req, res) {
    var comment = new CommentsModel({
        content : req.body.content,
        product_id : parseInt(req.body.product_id)
    });
    comment.save(function(err, comment) {
        res.json({
            id : comment.id,
            content : comment.content,
            message : "success"
        });
    })
});

router.post('/products/ajax_comment/delete', function(req, res){
    CommentsModel.remove({ id : req.body.comment_id } , function(err){
        res.json({ message : "success" });
    });
});

module.exports = router;