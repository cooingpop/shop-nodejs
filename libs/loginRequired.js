module.exports = function(req, res, next) {
    if (!req.isAuthenticated()){ 
        res.redirect('/accounts/login');
    }else{
        return next(); // 제어권을 다음으로 넘김.
    }
};