<template>
  <div class="article">
   <div class="d-flex py-3 px-2 border-bottom">
        <div class="iconfont icon-back text-blue-light" @click="$router.push('/')"></div>
      <strong class="flex-1 text-blue-light pl-2 fs-sm">{{model.title}}</strong>
      <div class="text-grey fs-xs">2019-06-19</div>
   </div>
   <div v-html="model.body" class="text-center px-3 body"></div>
   <div class="px-3 border-top py-3">
     <div class="d-flex ai-center">
       <i class="iconfont icon-moments"></i>
       <strong class="text-blue-light fs-md ml-1">相关资讯</strong>
     </div>
     <div class="pt-2">
       <router-link
       class="py-2 px-1"
        tag="div" 
        :to="`/articles/${item._id}`"  
        v-for="item in model.related" 
        :key="item._id">
        {{item.title}}
       </router-link>
     </div>
   </div>
  </div>
</template>

<script >
export default {
  data(){
    return{
      model:null,
    }
  },
  watch:{
    id(){
      this.fetch()
    }
  },
  props:{
    id:{require:true}
  },
  methods:{
    async fetch(){
      const res= await this.$http.get(`/articles/${this.id}`)
      this.model=res.data
    }
  },
  created(){
    this.fetch()
  }
}
</script>

<style lang="scss" >
.article{
  .body{
    img{
      max-width:100%;
      height: auto;
      }
    iframe{
        max-width:100%;
       height: auto;
      }
  }
}
</style>