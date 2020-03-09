<!-- 留学规划页面的留学选项 -->
<template>

  <div>
    <div class= 'form' :style="{'border-bottom':dateTemperList.length>0?'':'1px solid silver'}">
      <!-- <span>选择时间</span> -->
      <div :class="popupVisible?'form_value':'form_value1'" @click="choose()">{{val}}</div>
    </div>
    <div class="formOpint" v-if="popupVisible">
        <div v-for="(item,index) in slots" :key="index" @click="select(item,index)" :style='{color:dateColor==index?"#09b6f2":"#616161"}'>
            <span>{{item.name}}</span><span>{{date[index]}}</span>
        </div>
    </div>

    <date-picker
        :show-picker-model = "showDatePicker" 
        :default-date = "new Date()"
        :start-date = "new Date('1900-01-01')"
        :end-date = "new Date('2200-01-01')"
        @cancel = "handleCancel"
        @confirm = "handleConfirm" />

    <!-- <div class="dataTemperListTitle" v-if = "flag">
        <div class="dataTemperList">
            <div class="dataTemperListChild">
                <span>日期</span>
            </div>
            <div class="dataTemperListChild">
                <span>姓名</span>
            </div>
            <div class="dataTemperListChild">
                 <span>体温</span>
            </div>
            <div class="dataTemperListChild">
                 <span>状态</span>
            </div>
        </div>
    </div> -->
    <div class="dataTemperListWarp" :style="{'z-index':showDatePicker?'-1':'1'}">
        <mt-loadmore :autoFill="false" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
            <div class="dataTemperList" v-for="(item,index) in dateTemperList" :key="index">
                <div class="dataTemperListChild">
                    <div><span style="color: black;">{{item.date}}</span></div>
                    <div><span>{{item.time}}</span></div>
                </div>
                <div class="dataTemperListChild">
                    <span >{{item.epname}}</span>
                </div>
                <div class="dataTemperListChild">
                    <span>{{item.temperature}}°C</span>
                </div>
                <div class="dataTemperListChild">
                    <span :style='{color:item.chkresult=="-1"?"red":""}'>{{item.CNStaus}}</span>
                </div>
            </div>
        </mt-loadmore>
        <div v-if = "allLoaded" class="alldata">
            <span>测温记录加载完毕</span>
        </div>
    </div>
    <div v-if = "!flag" class="nodata">
        <div :style="{'background': 'url('+img+') no-repeat center/cover','width':'1.3rem','height':'1.3rem'}"></div>
        <span>没有查询到符合条件的测温记录</span>
    </div>
  </div>

</template>

<script>
import DatePicker from './datePicker'
export default {
    name: 'dateSelect',
    data() {
        return {

        
            img:"./static/image/search.png",
            //一页显示多少条
            pageSize: 10,
            //页码
            pageNo:0,
            //是否加载完
            allLoaded:false,

            dateColor:1,
            timeVALUE:"today",
            date:[],
            // testURL:"./static/json/BodyTemper.json",
            testURL:"http://128.196.188.220:8101/osp_mng/iwap.ctrl",
            //选择的值
            val:"",
            //是否调出选择框
            popupVisible:false,
            //选择的内容
            slots: [{"name":"昨日","value":"yesterday"},{"name":"今日","value":"today"},{"name":"自定义","value":""}],
            cnStaus:{
                "0":"正常",
                "-1":"体温异常",
                "-2":"人脸识别失败",
                "-9":"其他异常"
            },
            dateTemperList:[],
            flag:true,
            nowDATE:'',
            
            //第四种用的参数
            showDatePicker:false,
        };
    },
    methods: {

        //下拉刷新
        loadTop(){
            this.allLoaded = false;
            this.pageNo = 0;
            this.$indicator.open({
                text: '刷新中...',
                spinnerType: 'fading-circle'
            });
            var div = document.getElementsByClassName("mint-indicator-mask")[0];
            div.setAttribute("style","z-index:2000;opacity:1;background:rgba(00,00,00,.5);")
            setTimeout(() => {
                //收回下拉动作
                this.$refs.loadmore.onTopLoaded();
                var that = this;
                that.$indicator.close();
                // console.log("下拉")
                // console.log(this.pageNo)
                that.getData();
            }, 2000)
        },


        //下拉加载
        loadBottom(){
            this.pageNo++;
            this.$indicator.open({
                text: '加载中...',
                spinnerType: 'fading-circle'
            });
            var div = document.getElementsByClassName("mint-indicator-mask")[0]
            div.setAttribute("style","z-index:2000;opacity:1;background:rgba(00,00,00,.5);")
            setTimeout(() => {
                this.$refs.loadmore.onBottomLoaded();
                var that = this;
                that.$indicator.close();
                // console.log("上拉")
                // console.log(this.pageNo)
                var params = {"txcode":"tempMng","time":this.timeVALUE,"size":this.pageNo,"limit":this.pageSize};
                this.ajax("get",params,function(res){
                    if(res.data.body.rows.length>0){
                        var list = res.data.body.rows;
                        // console.log(list)
                        that.tranCNStaus(list);
                        that.splitDate(list);
                        var newarr =  that.dateTemperList.concat(list);
                        that.dateTemperList = newarr;
                    }else{
                        that.allLoaded = true;
                    }
                },function(err){console.log(err,"错误提示")},this.testURL);
            }, 2000)
        },



        //状态
        tranCNStaus(list){
            for(var i = 0;i<list.length;i++){
                for(var key in this.cnStaus){
                    if(list[i].chkresult == key){
                        list[i].CNStaus = this.cnStaus[key]
                    }
                }
            }
        },

        //时间分割
        splitDate(list){
            for(var i = 0;i<list.length;i++){
                var arr = list[i].checkdate.split('');
                list[i].date = arr[0]+arr[1]+arr[2]+arr[3]+"-"+arr[4]+arr[5]+"-"+arr[6]+arr[7];
                list[i].time = arr[8]+arr[9]+":"+arr[10]+arr[11]+":"+arr[12]+arr[13];
            }
        },


        getData(){
            var that = this;
            var params = {"txcode":"tempMng","time":this.timeVALUE,"size":this.pageNo,"limit":this.pageSize};
            this.ajax("get",params,function(res){
                if( res.data.body.rows.length>0){
                   
                    that.flag = true;
                    that.dateTemperList = res.data.body.rows;
                    that.tranCNStaus(that.dateTemperList);
                    that.splitDate(that.dateTemperList);
                }else{
                    that.flag = false;
                    that.dateTemperList = [];
                }
            },function(err){console.log(err,"错误提示")},this.testURL);
        },

        //选择
        choose(){
            this.popupVisible = !this.popupVisible;
            this.getDate();
        },


        //获取时间
        getDate(){
            //昨天的时间
            var day1 = new Date();
            day1.setTime(day1.getTime()-24*60*60*1000);
            var m = day1.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = day1.getDate();
            d = d < 10 ? ('0' + d) : d;
            var s1 = day1.getFullYear()+"-" + m + "-" + d;
            // console.log(s1)
            this.date.push(s1)
            //今天的时间
            var day2 = new Date();
            day2.setTime(day2.getTime());
            var m = day2.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = day2.getDate();
            d = d < 10 ? ('0' + d) : d;
            var s2 = day2.getFullYear()+"-" + m + "-" + d;
            
            this.nowDATE = day2.getFullYear()+"" + m + "" + d;
            // console.log(s2)
            this.date.push(s2)
            this.date.push('')
            // console.log(this.date)
        },

        //第一种
        //选择里面的选项
        // select(item,index){
        //     if(this.date[index]==""){
        //         var message = '请输入查询日期(格式为'+this.nowDATE+')'
        //         this.$messagebox({
        //             $type:'prompt',
        //             title:'',
        //             message:message,
        //             showInput:true,
        //             confirmButtonText:'确定',
        //         }).then(({ value, action }) => {
        //             this.popupVisible = false;
        //             this.timeVALUE = value
        //             if(Number(this.timeVALUE)&&this.timeVALUE.length==8){
        //                 this.pageNo = 0;
        //                 this.allLoaded = false;
        //                 this.dateColor = index;
        //                 this.val = this.timeVALUE.split("")[0] + this.timeVALUE.split("")[1] +this.timeVALUE.split("")[2] +this.timeVALUE.split("")[3] + "-"
        //                 this.val += this.timeVALUE.split("")[4] + this.timeVALUE.split("")[5] + "-" + this.timeVALUE.split("")[6] + this.timeVALUE.split("")[7]
        //                 console.log(this.val)
        //                 this.getData()
        //             }else{
        //                 return
        //             }
        //         })
        //     }else{
        //         this.pageNo = 0;
        //         this.allLoaded = false;
        //         this.popupVisible = false;
        //         this.dateColor = index;
        //         this.timeVALUE = item.value;
        //         this.val = this.date[index];
        //         console.log(this.val)
        //         this.getData()
        //     }
        // }

        //第二种
        select(item,index){
            if(this.date[index]==""){
                setTimeout(()=>{
                    var title = document.getElementsByClassName("mint-msgbox-title")[0];
                    var inp = document.getElementsByClassName("mint-msgbox-input")[0].children[0];
                    inp.setAttribute("maxlength",'8');
                    title.innerHTML ='';
                },0)
                this.$messagebox.prompt('请输入查询日期(格式为'+this.nowDATE+')'
                ).then(({ value, action }) => {
                    // console.log(value)
                    this.popupVisible = false;
                    this.timeVALUE = value
                    if(Number(this.timeVALUE)&&this.timeVALUE.length==8){
                        this.pageNo = 0;
                        this.allLoaded = false;
                        this.dateColor = index;
                        this.val = this.timeVALUE.split("")[0] + this.timeVALUE.split("")[1] +this.timeVALUE.split("")[2] +this.timeVALUE.split("")[3] + "-"
                        this.val += this.timeVALUE.split("")[4] + this.timeVALUE.split("")[5] + "-" + this.timeVALUE.split("")[6] + this.timeVALUE.split("")[7]

                        this.getData()
                    }else{
                        var alterHtml = "格式不正确，请重输";
                        var alterTitle = "";
                        setTimeout(()=>{
                            
                            var content = document.getElementsByClassName('mint-msgbox-message')[0];
                            content.setAttribute("style","text-align:left;")
                            
                        },0)
                        this.$messagebox.alert(alterHtml,alterTitle);
                    }
                }).catch(({ value, action }) => {
                    // this.popupVisible = false;
                })
            }else{
                this.pageNo = 0;
                this.allLoaded = false;
                this.popupVisible = false;
                this.dateColor = index;
                this.timeVALUE = item.value;
                this.val = this.date[index];
                console.log(this.val)
                this.getData()
            }            
        },

        //第三种
        // select(item,index){
        //     if(this.date[index]==""){
        //         this.popupVisible = false;
        //         var nowDATE = this.date[1];
                
        //         this.$picker.show({
        //             type:'datePicker',
        //             date:nowDATE,
        //             endTime:'2200-01-01',//截至时间
        //             startTime:'1930-01-01',//开始时间
        //             onOk:(date)=>{
        //                 this.val = date;    // val就是所需字段，在data 里定义下
        //                 this.timeVALUE = date;
        //                 this.pageNo = 0;
        //                 this.allLoaded = false;
        //                 this.dateColor = index;
        //                 this.getData();
        //             } 
        //         })                
        //     }else{
        //         this.pageNo = 0;
        //         this.allLoaded = false;
        //         this.popupVisible = false;
        //         this.dateColor = index;
        //         this.timeVALUE = item.value;
        //         this.val = this.date[index];
        //         // console.log(this.val)
        //         this.getData();
        //     }            
        // },

        //第四种
        // select(item,index){
        //     if(this.date[index]==""){
        //        this.popupVisible = false;
        //        this.showDatePicker = true;
        //     }else{
        //         this.pageNo = 0;
        //         this.allLoaded = false;
        //         this.popupVisible = false;
        //         this.dateColor = index;
        //         this.timeVALUE = item.value;
        //         this.val = this.date[index];
        //         // console.log(this.val)
        //         this.getData();
        //     }            
        // },
        handleCancel(){
            this.showDatePicker = false;
        },
        handleConfirm(value){
            this.showDatePicker = false;
            this.dateColor = 2;
            this.pageNo = 0;
            this.allLoaded = false;
            var day = new Date(value);
            var m = day.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = day.getDate();
            d = d < 10 ? ('0' + d) : d;
            this.timeVALUE = day.getFullYear()+"-" + m + "-" + d;
            this.val = this.timeVALUE;

            this.getData();
            
        },

    },
    components: {
        DatePicker
    },
    mounted() {

        var topDiv = document.getElementsByClassName("mint-loadmore-top")[0];
        var botDiv = document.getElementsByClassName("mint-loadmore-bottom")[0];
        topDiv.setAttribute("style","opacity:0;")
        botDiv.setAttribute("style","opacity:0;")
        botDiv.innerHTML = "";
        topDiv.innerHTML = "";

        this.getDate();
        this.getData()
        this.val = this.date[1];

    }
}
</script>

<style scoped lang="less">

//选择框
.form{
  width: 100%;
  height: 100px;
  margin-bottom: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
//   margin-left: 2%;
  >span{
      font-size: .4rem;
      margin-right: 0.2rem;
      // color: #616161;
      font-family: "Microsoft YaHei";
  }
  >.form_value{
    width: 30%;
    height: 100px;
    font-size:.35rem;
    line-height: 100px;
    border-bottom:2px dotted silver;
    position: relative;
    text-align: center;
    color: #616161;
    font-family: "Microsoft YaHei";
    &::after{
      content: '';
      width: 30px;
      height: 30px;
      position: absolute;
      background: url(../../../../static/image/t_up.png);
      background-size: 100% 100%;
      right: -10px;
      top:35px;
    }
  }
  >.form_value1{
    width: 25%;
    height: 100px;
    font-size:.35rem;
    line-height: 100px;
    // border-bottom:2px dotted silver;
    position: relative;
    text-align: center;
    font-family: "Microsoft YaHei";
    color: #616161;
    &::after{
      content: '';
      width: 30px;
      height: 30px;
      position: absolute;
      background: url(../../../../static/image/t_down.png);
      background-size: 100% 100%;
      right: -20px;
      top:35px;
    }
  }
}

//下来框
.formOpint{
    position: absolute;
    top: 90px;
    width: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    background:rgba(0, 0, 0, .5);
    display: flex;
    flex-direction: column;
    z-index: 100;
    border-bottom: 1px solid silver;
    // border-top: 1px solid silver;
    >div{
        height: 1rem;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid silver;
        >span{
            font-size: .4rem;
            margin-right: .2rem;
            font-family: "Microsoft YaHei";
        }
    }

}

//列表
.dataTemperListWarp{
    width: 100%;
    position: absolute;
    top:100px;
    bottom:0;
    right: 0;
    left: 0;
    // background: pink;
    overflow: auto;
    .dataTemperList{
        width: 100%;
        height: 100px;
        // background: blue;
        display: flex;
        >.dataTemperListChild{
            flex: 1;
            border-bottom:2px dotted silver;
            border-top:2px dotted silver;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            >span{
                font-size: .35rem;
                // color: #616161;
                font-family: "Microsoft YaHei";
                // color:#aeaeae
            }
            >div{
                flex:1;
                // background: red;
                display: flex;
                justify-content: center;
                align-items: center;
                 >span{
                    font-size: .35rem;
                    color: #616161;
                    font-family: "Microsoft YaHei";
                    // color:#aeaeae
                }
            }
        }
    }
}

//表头
// .dataTemperListTitle{
//     width: 100%;
//     height: 50px;
//     >.dataTemperList{
//         background:#09b6f2;
//         width: 100%;
//         height: 100px;
//         // background: blue;
//         display: flex;
//         color: white;
//         font-size: .4rem;
//         >.dataTemperListChild{
//             flex: 1;
//             border-bottom:2px dotted silver;
//             border-top:2px dotted silver;
//             display: flex;
//             flex-direction: column;
//             justify-content: center;
//             align-items: center;
//             >div{
//                 flex:1;
//                 // background: red;
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//             }
//         }
//     }
// }

//没有数据显示和加载完毕
.nodata{
    margin-top: 35%;
    width: 100%;
    height: 200px;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    >div{
        margin-bottom: .4rem;
    }
    >span{
        font-size: .4rem;
        color:#aeaeae;
        font-family: "Microsoft YaHei";
    }
}

.alldata{
    width: 100%;
    height: 100px;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    >span{
        font-size: .4rem;
        color:#aeaeae;
        font-family: "Microsoft YaHei";
    }
}

.mint-loadmore{
    // padding: .5% 5%;
    // box-sizing: border-box;
    overflow: initial;
}
</style>
