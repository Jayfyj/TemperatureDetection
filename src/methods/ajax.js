var ajax = function (type,params,RES,ERR,url) {
  console.log(window.navigator.userAgent)
  
  var that = this;

  if (window.navigator.userAgent.indexOf("Android")!=-1) {
    var levelNum = window.navigator.userAgent.split("Android ")
    console.log(parseInt(levelNum[1]))
    if(parseInt(levelNum[1]) <= 4){
      that.myModal.levelModal(that)
    }
  }
  
  //打开加图案
  that.myModal.downLoad(that,true);
  if(url!=''&&url!=undefined){
    url = url;
  }else{
    //同一入口
    url = "http://128.196.188.220:8101/osp_mng/iwap.ctrl";
  }
 
  //必须传的参数
  var origin = {
    
  }
  var newParams ={}
  //合并
  Object.assign(newParams,origin,params);
  //get请求
  if(type == "get"){
    this.$axios({
      method:type,
      url:url,
      params:newParams,
      //超时时间
      timeout: 1000 * 10,
    }).then(res=>{
      //关闭加载图案
      that.myModal.downLoad(that,false);
      RES(res);
        
    }).catch(err=>{
      //关闭加载图案
      that.myModal.downLoad(that,false);
      //并且提示
      that.myModal.messageModal(that);
      return
      ERR(err);
    });
  }
}
export default ajax;
