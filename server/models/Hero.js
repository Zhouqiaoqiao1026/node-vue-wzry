const mongoose=require('mongoose')
//新建模型
const schema=new mongoose.Schema({
    //字段以及字段类型
    name:{type:String},     //名称
    avatar:{type:String},   //头像
    title:{type:String},    //称号
    banner:{type:String},    //Banner
    categories:[{type:mongoose.SchemaTypes.ObjectId,ref:'Category'}],  //类型
    //英雄属性
    scores:{
        difficult:{type:Number},
        skills:{type:Number},
        attack:{type:Number},
        survive:{type:Number},
    },
    skills:[{
        icon:{type:String},
        name:{type:String},
        description:{type:String},
        tips:{type:String},
        delay:{type:String},
        cost:{type:String},
    }],
    //装备-顺风
    items1:[{type:mongoose.SchemaTypes.ObjectId,ref:'Category',ref:'Item'}],
    //装备-逆风
    items2:[{type:mongoose.SchemaTypes.ObjectId,ref:'Category',ref:'Item'}],
    usageTips:{type:String},
    battleTips:{type:String},
    teamTips:{type:String},
    partners:[{
        hero:{type:mongoose.SchemaTypes.ObjectId,ref:'Hero'},
        description:{type:String},
    }],

})

module.exports=mongoose.model('Hero',schema,'heroes')  //指定集合名称