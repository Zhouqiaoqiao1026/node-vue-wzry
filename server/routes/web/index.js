module.exports=app=>{
    const router=require('express').Router()
    const mongoose=require('mongoose')
    const Article=mongoose.model('Article')
    const Category=mongoose.model('Category')
    const Hero = mongoose.model('Hero')
 // 导入新闻数据
 router.get('/news/init', async (req, res) => {
    const parent = await Category.findOne({
      name: '新闻分类'
    })
    const cats = await Category.find().where({
      parent: parent
    }).lean()

    const newsTitles = ["凤求凰&amp;凤凰于飞限时返场 皮肤优化即将来袭", "【已开服】1月9日正式服“强者之路”版本更新公告", "强者之路开启 S18全新赛季来临 超多福利等你来拿", "新皮肤爆料丨守护皇后，黑桃队长鲁班七号待命中", "新皮肤爆料丨守护皇后，黑桃队长鲁班七号待命中", "", "新星元套装爆料丨大小姐驾到！未来机甲高能预警~", "过年有王者！新春相约峡谷，与你开启福气年", "和“王者荣耀”英雄组团，逛京东，贺新年！", "新春王者翼起嗨 千店齐发线下开黑", "峡谷英雄辞旧岁，快手集结迎新年", "觉醒之战——斗鱼主播带你嗨翻天", "年兽入侵丨那个神秘生物来了！搅乱峡谷的竟是它？！", "嬴政小头像不显示问题说明", "", "李白-凤求凰个人主页展示异常问题说明", "1月16日全服不停机更新公告", "微信区组队消费活动链接异常说明", "觉醒之战版本更新后开启", "赛季奖励领取调整说明及未领取奖励补发公告", "【已开服】1月9日正式服“强者之路”版本更新公告", "游戏内限时活动入口无法显示异常说明", "【蔷薇的历练之年兽大作战】活动公告及FAQ", "", "内测皮肤获取方式升级【蔷薇的历练】开启", "凤求凰&amp;凤凰于飞限时返场 皮肤优化即将来袭", "王者新春年货节，组队消费活动赢好礼！", "【觉醒英雄，赢精彩豪礼】活动开启公告", "娜可露露首套史诗皮肤-晚萤即将上架 更多礼遇等你解锁！", "探秘玄雍活动 参与拿专属好礼", "强者之路开启 S18全新赛季来临 超多福利等你来拿", "假期狂欢季开启，高校区域联赛战队携手虎牙人气主播开战啦！", "假期狂欢季开启，高校区域联赛战队携手虎牙人气主播开战啦！", "高校自制定格动画：说出来你可能不信，我们的“作业”打起来了！", "2020年KPL春季转会期俱乐部挂牌名单公布", "假期狂欢季线上赏金对抗赛即将开启，这次由你当“教练”！", "历时72小时打造东北版《王者荣耀》，雪雕王者经典形象", "王者少年的英雄梦！高校打造文字矩阵空间通道装置", "强强联合！LGD携手大鹅文化，斥资8000万进军KPL", "一笔绘峡谷，一梦登王者！ 山东工艺美术学院“王者360度全景画”来了！", "年度巡礼——2019年XQ的重生", "一年的时间XQ有很多改变，从无缘季后赛到常规赛最大黑马，无数粉丝见证了这支战队的成长。2019年属于XQ的比赛已经谢幕，但前行的路从不止步，期待2020年XQ在赛场上的表现！", "再见选手AT，LGD大鹅官宣AT加入教练组", "2020年KPL新春贺岁短片《赢家》来袭，粉丝见面会1月18日南京开启", "年度巡礼——2019打醉拳的RW侠", "年度巡礼——eStarPro，星光闪耀，蓝色海洋", "年度巡礼——胜战传说，王者归来Hero久竞", "2019年终总结之AG超玩会：秋风起，少年归"]
    //const newsTitles = ["年度巡礼——胜战传说，王者归来Hero久竞", "2019年终总结之AG超玩会：秋风起，少年归"]
    //循环newsTitles 得到对象数组
    const newsList = newsTitles.map(title => {

      const randomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5)
      return {
        categories: randomCats.slice(0, 2),  //对应的分类
        title: title
      }
    })

     await Article.deleteMany({})  //将数据库所有内容清空
     await Article.insertMany(newsList) //插入newsList数据
    res.send(newsList)
  })
  
  //新闻列表接口
  router.get('/news/list',async(req,res)=>{
    const parent=await Category.findOne({
        name:'新闻分类'
    })
      /*聚合查询*/
    const cats = await Category.aggregate([
        { $match: { parent: parent._id } },  //过滤数据，条件查询上级分类
        {
          /*能够查询出每个分类底下的所有文章*/
          $lookup: {         //关联查询
            from: 'articles',  //从Article模型中查询
            localField: '_id', 
            foreignField: 'categories',  //外键
            as: 'newsList'  //命名为newsList
          }
        },
        {
            $addFields: {
              newsList: { $slice: ['$newsList', 5] }  //只取每个分类底下的5个文章数据
            }
          }
        ])
         /*新增热门分类，其中的文章从其他的分类中获取得到*/
        const subCats = cats.map(v => v._id)  //子分类是之前的那4个分类
        //在4个类别前加上“热门”分类
        cats.unshift({
          name: '热门',
          newsList: await Article.find().where({
            categories: { $in: subCats }
          }).populate('categories').limit(5).lean()
        })
        //获取热门分类里的文章的原分类
        cats.map(cat => {
          cat.newsList.map(news => {
            news.categoryName = (cat.name === '热门')   
              ? news.categories[0].name : cat.name
            return news
          })
          return cat
        })
        res.send(cats)
  })

//导入英雄数据
router.get('/heroes/init',async(req,res)=>{
    await Hero.deleteMany({})
    const rawData= [{ "name": "热门", "heroes": [{ "name": "后羿", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg" }, { "name": "孙悟空", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg" }, { "name": "铠", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg" }, { "name": "鲁班七号", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg" }, { "name": "亚瑟", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg" }, { "name": "甄姬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg" }, { "name": "孙尚香", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111.jpg" }, { "name": "典韦", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/129/129.jpg" }, { "name": "韩信", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150.jpg" }, { "name": "庄周", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg" }] }, { "name": "战士", "heroes": [{ "name": "赵云", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg" }, { "name": "钟无艳", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg" }, { "name": "吕布", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg" }, { "name": "曹操", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/128/128.jpg" }, { "name": "典韦", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/129/129.jpg" }, { "name": "宫本武藏", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/130/130.jpg" }, { "name": "达摩", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg" }, { "name": "老夫子", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/139/139.jpg" }, { "name": "关羽", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/140/140.jpg" }, { "name": "露娜", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg" }, { "name": "花木兰", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg" }, { "name": "亚瑟", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg" }, { "name": "孙悟空", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg" }, { "name": "刘备", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/170/170.jpg" }, { "name": "杨戬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/178/178.jpg" }, { "name": "雅典娜", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/183/183.jpg" }, { "name": "哪吒", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/180/180.jpg" }, { "name": "铠", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg" }, { "name": "狂铁", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/503/503.jpg" }, { "name": "李信", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/507/507.jpg" }, { "name": "盘古", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/529/529.jpg" }] }, { "name": "法师", "heroes": [{ "name": "小乔", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/106/106.jpg" }, { "name": "墨子", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg" }, { "name": "妲己", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg" }, { "name": "嬴政", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/110/110.jpg" }, { "name": "高渐离", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/115/115.jpg" }, { "name": "扁鹊", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/119/119.jpg" }, { "name": "芈月", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg" }, { "name": "周瑜", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/124/124.jpg" }, { "name": "甄姬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg" }, { "name": "武则天", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/136/136.jpg" }, { "name": "貂蝉", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg" }, { "name": "安琪拉", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg" }, { "name": "姜子牙", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/148/148.jpg" }, { "name": "王昭君", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/152/152.jpg" }, { "name": "张良", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/156/156.jpg" }, { "name": "不知火舞", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg" }, { "name": "钟馗", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg" }, { "name": "诸葛亮", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190.jpg" }, { "name": "干将莫邪", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/182/182.jpg" }, { "name": "女娲", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/179/179.jpg" }, { "name": "杨玉环", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/176/176.jpg" }, { "name": "弈星", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/197/197.jpg" }, { "name": "米莱狄", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/504/504.jpg" }, { "name": "沈梦溪", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/312/312.jpg" }, { "name": "上官婉儿", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg" }, { "name": "嫦娥", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg" }] }, { "name": "坦克", "heroes": [{ "name": "廉颇", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/105/105.jpg" }, { "name": "刘禅", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg" }, { "name": "白起", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/120/120.jpg" }, { "name": "夏侯惇", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg" }, { "name": "项羽", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/135/135.jpg" }, { "name": "程咬金", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg" }, { "name": "刘邦", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/149/149.jpg" }, { "name": "牛魔", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg" }, { "name": "张飞", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg" }, { "name": "东皇太一", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/187/187.jpg" }, { "name": "苏烈", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg" }, { "name": "梦奇", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/198/198.jpg" }, { "name": "孙策", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg" }, { "name": "猪八戒", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/511/511.jpg" }] }, { "name": "刺客", "heroes": [{ "name": "阿轲", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/116/116.jpg" }, { "name": "李白", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/131.jpg" }, { "name": "韩信", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150.jpg" }, { "name": "兰陵王", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/153/153.jpg" }, { "name": "娜可露露", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/162/162.jpg" }, { "name": "橘右京", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg" }, { "name": "百里玄策", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/195/195.jpg" }, { "name": "裴擒虎", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg" }, { "name": "元歌", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/125/125.jpg" }, { "name": "司马懿", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg" }, { "name": "云中君", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg" }] }, { "name": "射手", "heroes": [{ "name": "孙尚香", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111.jpg" }, { "name": "鲁班七号", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg" }, { "name": "马可波罗", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/132/132.jpg" }, { "name": "狄仁杰", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/133/133.jpg" }, { "name": "后羿", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg" }, { "name": "李元芳", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/173/173.jpg" }, { "name": "虞姬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/174/174.jpg" }, { "name": "成吉思汗", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/177/177.jpg" }, { "name": "黄忠", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/192/192.jpg" }, { "name": "百里守约", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg" }, { "name": "公孙离", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/199/199.jpg" }, { "name": "伽罗", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/508/508.jpg" }] }, { "name": "辅助", "heroes": [{ "name": "庄周", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg" }, { "name": "孙膑", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg" }, { "name": "蔡文姬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/184/184.jpg" }, { "name": "太乙真人", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg" }, { "name": "大乔", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/191/191.jpg" }, { "name": "鬼谷子", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/189/189.jpg" }, { "name": "明世隐", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/501/501.jpg" }, { "name": "盾山", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg" }, { "name": "瑶", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg" }] }]
    for(let cat of rawData){
        if (cat.name==='热门'){
            continue
        }
        //找到当前分类在数据库中对应的数据
        const category=await Category.findOne({
            name:cat.name
        })
        cat.heroes=cat.heroes.map(hero=>{
            hero.categories=[category]
            return hero
        })
        //录入英雄（带分类的）
        await Hero.insertMany(cat.heroes)
    }
    res.send(await Hero.find())
})

  //英雄列表接口
  router.get('/heroes/list',async(req,res)=>{
    //聚合查询
  const parent=await Category.findOne({
      name:'英雄分类'
  })
  const cats = await Category.aggregate([
      { $match: { parent: parent._id } },  //过滤数据
      {
        $lookup: {         //关联查询
          from: 'heroes',
          localField: '_id',
          foreignField: 'categories',
          as: 'heroList'
        }
      },
    
      ])
      const subCats = cats.map(v => v._id)
      cats.unshift({
        name: '热门',
        heroList: await Hero.find().where({
          categories: { $in: subCats }
        }).limit(10).lean()
      })
      res.send(cats)
});
   // 文章详情
   router.get('/articles/:id', async (req, res) => {
    const data = await Article.findById(req.params.id).lean()
    data.related = await Article.find().where({
      categories: { $in: data.categories }
    }).limit(2)
    res.send(data)
  })
  
  //英雄详情
  router.get('/heroes/:id', async (req, res) => {
    const data = await Hero
    .findById(req.params.id)
    .populate('categories items1 items2 partners.hero')
    .lean()
    res.send(data)
  })
  app.use('/web/api', router)
}