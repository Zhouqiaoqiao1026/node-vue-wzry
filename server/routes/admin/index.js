module.exports=app=>{
    const express=require('express')
    const router=express.Router({mergeParams:true})// express的子路由
    const jwt=require('jsonwebtoken')
    const assert=require('http-assert')
    const AdminUser=require('../../models/AdminUser')
    /*******CRUD接口*******/
    //创建资源
    router.post('/',async(req,res)=>{
        const model=await req.Model.create(req.body)
        res.send(model)
    })
    //更新资源
    router.put('/:id',async(req,res)=>{
        const model=await req.Model.findByIdAndUpdate(req.params.id,req.body)
        res.send(model)
    })
     //删除资源
     router.delete('/:id',async(req,res)=>{
        await req.Model.findByIdAndDelete(req.params.id,req.body)
        res.send({
            success:true
        })
    })
    //资源列表
    router.get('/',async(req,res)=>{
       const queryOptions={}
       if(req.Model.modelName==='Category'){
           queryOptions.populate='parent'
       }
        const items=await req.Model.find().setOptions(queryOptions).limit(100)
        res.send(items)
    })

    //资源详情
    router.get('/:id',async(req,res)=>{
        const model=await req.Model.findById(req.params.id)
        res.send(model)
    })
    const resourceMiddleware=require('../../middleware/resource') 

 /*******图片上传接口*******/
    const multer=require('multer')
    const upload =multer({dest:__dirname + '/../../uploads'})  //目标地址

    app.post('/admin/api/upload',authMiddleware(),upload.single('file'),async(req,res)=>{
        const file=req.file
        file.url=`http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })

 /*******登录接口*******/
    const authMiddleware=require('../../middleware/auth')

    app.post('/admin/api/login',async(req,res)=>{
        const {username,password}=req.body  //解构赋值
        //1.根据用户名找用户
        const user=await AdminUser.findOne({username}).select('+password')
        assert(user,422,'用户不存在') //确保用户存在

        //2.校验密码
        const isValid=require('bcryptjs').compareSync(password,user.password)
        assert(isValid,422,'密码错误')//确保密码正确

        //3.返回token
        const token=jwt.sign({id:user._id},app.get('secret'))   //生成token 给密钥secret防止客户端篡改信息
        res.send({token})  //发送token给客户端
    })
    //错误处理函数
    app.use(async(err,req,res,next)=>{
        res.status(err.statusCode || 500).send({
            message:err.message
        })
    })

    app.use('/admin/api/rest/:resource',authMiddleware(),resourceMiddleware(),router)  //挂载子路由   第四个参数resource动态参数
}