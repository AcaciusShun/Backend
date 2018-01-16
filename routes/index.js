var express = require('express');
var router = express.Router();
//引用
var UserModel = require('../model/User');
var md5 = require('md5');


/* GET home page. */
router.get('/', function(req, res, next) {
	//render是调用ejs模板 生成页面
	//第一参数  模板名字  在views
  res.render('index', { title: '后台管理系统' });
});

router.get('/login', function(req, res,next) {
	res.render("login",{});
});

router.get('/regist', function(req, res, next) {
    res.render("regist",{});
});
router.post('/api/regist4ajax', function(req, res,next) {
    // res.render("regist",{});
    var username = req.body.username;
    var password = req.body.password;

    var result = {
        code : 1,
        messages : "注册成功"
    };

    //检查用户名 是否被使用
    UserModel.find({username: username},function (err,docs) {
        if (docs.length > 0){
            result.code = -109;
            result.messages = "该用户名已存在";
            // res.json(result);
            res.json(result);
            return;
        }

        //用User表中的数据  保存到数据库 开头引入
        //注册用户
        var um = new UserModel();
        um.username = username;
        um.password = md5(password);

        //异步处理 回调函数
        um.save(function(err) {
            if (err){
                result.code = -100;
                result.messages = "注册失败";
                res.send("注册失败");
            }else {
                res.json(result);
                // res.send("注册成功");
            }
        });

    });
    
});

router.get('/loginAction', function(req, res) {
    if (req.query.username == "admin" && req.query.password =="123" ){
        if (req.query.captcha == "GYDS"){
            res.send("登陆成功");
        }else{
            res.send("验证码错误");
        }
    }else {
        res.send("登陆失败");
    }


});

router.get('/admin', function(req, res) {

    res.render("admin",{});

});


module.exports = router;
