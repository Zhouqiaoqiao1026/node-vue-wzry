<template>
  <div class="home">
   <swiper :options="swiperOption">
      <swiper-slide>
        <img class="w-100" src="../assets/images/b9905b35bb0afa9050d9ddbe04d82d29.jpeg">
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/210794580bb9303653804bb7b482f2a4.jpeg">
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/ddc8c8922cbb694dfb73c86bb03fce22.jpeg">
      </swiper-slide>
    <div class="swiper-pagination pagination-home text-right px-3 pb-2" 
    slot="pagination"></div>
   </swiper>
  <!--end if swiper-->

   <div class="nav-icons bg-white mt-3  pt-3 text-center text-dark-1" >
     <div class="d-flex flex-wrap">
        <div class="nav-item mb-3">
          <i class="sprite sprite-news" ></i>
          <div >爆料站</div>
        </div>
        <div class="nav-item mb-3">
          <i class="sprite sprite-story"></i>
          <div >故事站</div>
        </div>
        <div class="nav-item mb-3">
          <i class="sprite sprite-mall"></i>
          <div>周边商城</div>
        </div>
        <div class="nav-item mb-3">
          <i class="sprite sprite-tyf"></i>
          <div>体验服</div>
        </div>
        <div class="nav-item mb-3">
          <i class="sprite sprite-newuser"></i>
          <div>新人专区</div>
        </div>
        <div class="nav-item mb-3">
          <i class="sprite sprite-honor"></i>
          <div>荣耀 传承</div>
        </div>
        <div class="nav-item mb-3">
          <i class="sprite sprite-community"></i>
          <div>同人社区</div>
        </div>
          <div class="nav-item mb-3">
          <i class="sprite sprite-ground"></i>
          <div>王者营地</div>
        </div>
          <div class="nav-item mb-3">
          <i class="sprite sprite-wechat"></i>
          <div>公众号</div>
        </div>
          <div class="nav-item mb-3">
          <i class="sprite sprite-version"></i>
          <div>版本介绍</div>
        </div>
     </div>
     
      <div class="bg-light py-2 fs-sm mt-3 jc-center">
        <i class="sprite sprite-arrow mr-1"></i>
        <span>收起</span>
      </div>


   </div>
  <!--end if nav-icons-->

  <m-list-card icon="menu" title="新闻资讯" :categories="newsCats">
    <template #items="{category}">
      <router-link 
        tag="div"
        :to="`/articles/${news._id}`"
         class="py-2 d-flex" 
         v-for="(news,i) in category.newsList" :key="i">
            <span class="text-blue">[{{news.categoryName}}]</span>
            <span class="px-2">|</span>
            <span class="flex-1 text-dark-1 text-ellipsis pr-2">{{news.title}}</span>
            <span class="text-grey ">{{news.createdAt | date}}</span>
      </router-link>
    </template>
  </m-list-card>
  <!--end if 新闻资讯-->

   <m-list-card icon="card-hero" title="英雄列表" :categories="heroCats">
    <template #items="{category}">
       <div class="d-flex flex-wrap" style="margin:-0.5rem -0.5rem">
           <router-link 
           tag="div"
           :to="`/heroes/${hero._id}`"
           class="p-2 text-center" style="width:20%" 
           v-for="(hero,i) in category.heroList" 
           :key="i">
             <img :src="hero.avatar" alt="" class="w-100">
             <div>{{hero.name}}</div>
           </router-link>
       </div>
    </template>
  </m-list-card>
  <!--end if 英雄列表-->

  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  filters:{
    date(val){
        return dayjs(val).format('MM/DD')
    }
  },
     data(){
        return{
             swiperOption: {
               pagination: {
               el: '.swiper-pagination'
              }
           }, 
            newsCats:[],
            heroCats:[],
        }
    },
    methods:{
      async fetchNewsCats(){
        const res =await this.$http.get('news/list')
        this.newsCats=res.data
      },
       async fetchHeroCats(){
        const res =await this.$http.get('heroes/list')
        this.heroCats=res.data
      }
    },
    created(){
      this.fetchNewsCats(),
      this.fetchHeroCats()
    }
  
}
</script>
<style lang="scss">
@import '../style.scss';
.pagination-home{
  .swiper-pagination-bullet{
    opacity: 1;
    border-radius: 0.1538rem;
    background: #ffffff;
    &.swiper-pagination-bullet-active{
      background: map-get($colors,'blue');
    }
  }
}

.nav-icons{
  border-top:1px solid $border-color;
  border-bottom:1px solid $border-color;
  .nav-item{
    width: 25%;
    border-right: 1px solid $border-color;
    &:nth-child(4n){
      border-right:none;
    }
  }
}
//精灵图标
.sprite{
    background: url(../assets/images/index.png) no-repeat 0 0;
    background-size: 28.8462rem;
    display: inline-block;
}

</style>