<template>
  <div id="app">
      <div class="container" ref="listWarp" @scroll="updateData">
        <!-- 填充使得滚动条是真实的高度 -->
        <div ref="scroller"></div>
        <div class="inner" ref="inner">
           <div v-for="item in showList" :key="item.name" :style="{height:`${itemHeight}px`}"><span>{{item.name}}</span></div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
      
  },
  computed:{
    showList(){
      return this.totalList.slice(this.start,this.end);
    }
  },
  data(){
    return {
      totalList:[],
      pageSize:20,
      start:0,//展示数据起始
      end:20,//展示数据结尾
      itemHeight:30
    }
  },
  mounted(){
    for(let i=1;i<=1000;++i){
      this.totalList.push({name:`元素${i}`});
    }
    this.$refs.scroller.style.height =  `${this.itemHeight*1000}px`;
    console.log(this.totalList,this.showList);
  },
  methods:{
    updateData(){//滚动更新展示的数据
      let innerTop = this.$refs.listWarp.scrollTop;//获取内部滚动元素的滑动距离
      console.log(innerTop);
      this.start = Math.floor(innerTop/this.itemHeight);//计算该位置展示的滚动数据
      this.end = this.start+this.pageSize;
      this.$refs.inner.style.top = `${this.itemHeight*this.start}px`;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.container{
  width: 120px;
  height: 400px;
  overflow-y: auto;
  position: relative;
}
.inner{
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>
