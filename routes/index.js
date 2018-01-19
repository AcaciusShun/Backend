var express = require('express');
var router = express.Router();
//引用
var UserModel = require('../model/User');
var GoodModel = require('../model/Goods');
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




router.post('/api/login4ajax', function(req, res,next) {
    var username = req.body.username;
    var password = req.body.password;
    var result = {
        code : 1,
        messages : "登录成功"
    };
    // UserModel.find( {username : username, password : md5(password)} ,(err,docs)=>{
    UserModel.find({username: username,password:md5(password)},function (err,docs) {
        if (docs.length == 0){
            result.code = -101;
            result.messages = "账号或密码错误，请重新登录"
        }else{
            //登录成功后生成session
            req.session.username = username;
            // console.log(req.session);
        }
        res.json(result);
    })
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

router.post('/api/addGoods',function (req,res,next) {

    console.log(req.body);


    var name = req.body.name;

    var price = req.body.price;
    var reserve = req.body.reserve;
    var weight = req.body.weight;
    // var brand = req.body.brand;

    var result = {
        code : 10,
        messages : "添加成功"
    };


    //检查用户名 是否被使用
    GoodModel.find({name: name},function (err,docs) {
        if (docs.length > 0){
            result.code = -119;
            result.messages = "该商品已存在";

            res.json(result);
            return;
        }
         // console.log(result);
        //用Good表中的数据  保存到数据库 开头引入
        //添加商品
        var gm = new GoodModel();
        gm.name = name;
        gm.price = price;
        // gm.classes = classes;
        gm.reserve = reserve;
        gm.weight = weight;
        // gm.brand = brand;
        console.log(gm.name);
        //异步处理 回调函数
        gm.save(function (err) {
            if (err){
                result.code = -10;
                result.messages = "保存失败";
                res.send("保存失败");
            }else {
                res.json(result);
                // res.send("注册成功");
            }
        });
    });
});


router.get('/loginAction', function(req, res) {
        if (req.query.captcha == "GYDS"){
            if (req.query.username == "admin" && req.query.password =="123" ){
                res.send("登陆成功");
            }else {
                res.send("登陆失败");
            }
        }else{
            res.send("验证码错误");
        }
});
router.get('/admin', function(req, res) {
    //判断用户是否登录，如果没登录 跳转到login页面
    if(req.session == null || req.session.username == null){
        // res.render("login",{});
        res.redirect("/login");//重定向
    }
    res.render("admin",{});
});



module.exports = router;
