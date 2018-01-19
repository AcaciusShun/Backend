var mongoose = require("mongoose");

var Schema  = mongoose.Schema;
var Good = new Schema({
    name : String,
    price : String,
    // classes : String,
    reserve : Number,
    weight : Number,
    // brand : String,
    create   : { type : Date, default : Date.now() }
});//创建model对象


//公开对象 暴露接口
var GoodModel = mongoose.model('good',Good);

//本质是Obj  所以直接赋
module.exports = GoodModel;