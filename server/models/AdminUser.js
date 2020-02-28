const mongoose=require('mongoose')
//新建模型
const schema=new mongoose.Schema({
    //字段以及字段类型
    username:{type:String},    
    password:{
        type:String,
        select:false,//密码默认查不出来
        set(val){
            return require('bcryptjs').hashSync(val,12)
        }
    },    
})

module.exports=mongoose.model('AdminUser',schema)