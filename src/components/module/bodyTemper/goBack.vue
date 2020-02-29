<!-- 留学汇款页面的顶部返回组件 -->
<template>

  <div class="back">
    <div :style="{'background':'#09b6f2'}">
      <i class="go_back" @click="prev()" :style="{'color':'white'}"></i>
      <span :style="{'color':'white'}">{{title}}</span>
      <!-- <i class="go_to" @click=" next()"
       :style="{'background':'url(./static/image/server.png)','background-size': '100% 100%'}">
      </i> -->
    </div>
  </div>

</template>

<script>
export default {
  name: 'goBack',
  methods:{
    //返回
    prev(){
      this.$router.go(-1);
    },
    //跳转
    next(){
      this.$router.push({name:this.nextUrl});
    }
  },
  props:['title','nextUrl']
}
</script>

<style scoped lang="less">
.back{
  position: relative;
  width: 100%;
  height: 100px;
  background: #F1F1F1;
  margin:-2px 0 0;

  >div{
    width: 100%;
    height: 100px;
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 3%;
    box-sizing: border-box;
    background: #F1F1F1;
    z-index:99999;
    >.go_back{
      display: inline;
      background: url(../../../../static/image/return.png);
      background-size: 100% 100%;
      width: 30px;
      height: 50px;
    }
    >span{
      position: absolute;
      width: 50%;
      font-size: 44px;
      margin: auto;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      line-height: 100px;
      text-align: center;
      font-family: "Microsoft YaHei";
    }
    >.go_to{
      display: inline;
      // background: url(../../../../static/image/server.png);
      // background-size: 100% 100%;
      width:80px;
      height: 80px;
    }
  }
}
</style>
