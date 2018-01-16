var mongoose = require("mongoose");

var Schema  = mongoose.Schema;
var User = new Schema({
    username : String,
    password : String,
    create   : { type : Date, default : Date.now() }
});//创建model对象



//公开对象 暴露接口
var UserModel = mongoose.model('user',User);

//本质是Obj  所以直接赋
module.exports = UserModel;