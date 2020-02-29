<template>
  <div class="appid">
    <router-view></router-view>

  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      startTime:"",
      endTime:"",
      time:1000*10*60,
      flag:true,
    }
  },
  methods:{
    // touchStart(){
    //   if(this.flag){
    //     var date = new Date()
    //     this.endTime = date.getTime()
    //     console.log(this.endTime)
    //     var allTime = this.endTime -this.startTime
    //     if (allTime>this.time){
    //       this.flag = false
    //       localStorage.removeItem("USERID")
    //       localStorage.removeItem("SESSIONKEY")
    //       this.myModal.timeOverModal(this);
    //       return
    //     }else{
    //       this.startTime = this.endTime
    //     }
    //   }
    // } ,

    //不操作提示退出登录
    noTocuh(){

      var appid = document.getElementsByClassName("appid")[0]
      var date = new Date ()
      this.startTime = date.getTime()
      var that = this
      appid.addEventListener("touchstart",function(){
        if(that.flag){
          var date = new Date()
          that.endTime = date.getTime()
          var allTime = that.endTime -that.startTime
          if (allTime>that.time){
            that.flag = false
            // localStorage.removeItem("USERID")
            // localStorage.removeItem("SESSIONKEY")
            that.myModal.timeOverModal(that);
            // return
          }else{
            that.startTime = that.endTime
          }
        }
      },{passive:false})

    },
    renderResize() {
        // 判断横竖屏
        var width = document.documentElement.clientWidth 
        var height = document.documentElement.clientHeight 
        if(width > height) {
          setTimeout(()=>{
            var title = document.getElementsByClassName("mint-msgbox-title")[0];
            var content = document.getElementsByClassName('mint-msgbox-message')[0];
            content.setAttribute("style","text-align:left;")
            title.setAttribute("style","font-size:.6rem;")
          },0)
          this.$messagebox.alert('',{
            message: "请竖屏使用,或者前往手机设置设置竖屏操作",
            title: '提示',
          }).then(action => {
            this.renderResize()
          })
        }        
    }
  },
  computed:{

  },
  watch:{

  },
  mounted(){
    // this.renderResize()
    // window.addEventListener("resize", this.renderResize, false)

    // this.noTocuh();
  }
 
}
</script>

<style>

#app {

  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}
</style>
