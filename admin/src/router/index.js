import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
//登录
import Login from '../views/Login.vue'
/***********主页面***********/
//分类
import CategoryEdit from '../views/CategoryEdit.vue'
import CategoryList from '../views/CategoryList.vue'
//物品
import ItemEdit from '../views/ItemEdit.vue'
import ItemList from '../views/ItemList.vue'
//英雄
import HeroEdit from '../views/HeroEdit.vue'
import HeroList from '../views/HeroList.vue'
//文章
import ArticleEdit from '../views/ArticleEdit.vue'
import ArticleList from '../views/ArticleList.vue'

//广告位
import AdEdit from '../views/AdEdit.vue'
import AdList from '../views/AdList.vue'

//管理员
import AdminUserEdit from '../views/AdminUserEdit.vue'
import AdminUserList from '../views/AdminUserList.vue'

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/login', name: 'login', component: Login, meta: { isPublic: true } },
    {
      path: '/',
      name: 'main',
      component: Main,
      children: [
        { path: '/categories/create', component: CategoryEdit },
        { path: '/categories/edit/:id', component: CategoryEdit, props: true },
        { path: '/categories/list', component: CategoryList },

        { path: '/items/create', component: ItemEdit },
        { path: '/items/edit/:id', component: ItemEdit, props: true },
        { path: '/items/list', component: ItemList },

        { path: '/heroes/create', component: HeroEdit },
        { path: '/heroes/edit/:id', component: HeroEdit, props: true },
        { path: '/heroes/list', component: HeroList },

        { path: '/articles/create', component: ArticleEdit },
        { path: '/articles/edit/:id', component: ArticleEdit, props: true },
        { path: '/articles/list', component: ArticleList },

        { path: '/ads/create', component: AdEdit },
        { path: '/ads/edit/:id', component: AdEdit, props: true },
        { path: '/ads/list', component: AdList },

        { path: '/admin_users/create', component: AdminUserEdit },
        { path: '/admin_users/edit/:id', component: AdminUserEdit, props: true },
        { path: '/admin_users/list', component: AdminUserList },

      ]
    },

  ]
})
//每次切换路由时的处理办法
router.beforeEach((to, from ,next) => {
  if (!to.meta.isPublic && !localStorage.token) {  //如果不是公开访问的页面并且不存在用户token时跳转到登录页
    return next('/login')
  }
  next()
})

export default router
