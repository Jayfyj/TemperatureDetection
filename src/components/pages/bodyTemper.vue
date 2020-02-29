<!-- 更多菜单页面 -->
<template>
  <div class="bodyTemper_page">
    <!-- 返回 -->
    <GoBack :title ='title'></GoBack>
    <div class="bodyTemper_date">
      <DateSelect></DateSelect>
    </div>
  </div>

</template>

<script>

import GoBack from '../module/bodyTemper/goBack.vue'
import DateSelect from '../module/bodyTemper/dateSelect.vue'


export default {
  name: 'bodyTemper',
  data(){
    return{
      title:"体温检测情况",
    }
  },
  methods:{
    
  },
  components: {
    
    GoBack,
    DateSelect,
  },
}
</script>

<style scoped lang="less">
.bodyTemper_page{
    position: absolute;
    top:0;
    bottom:0;   
    right: 0;
    left: 0;
    >.bodyTemper_date{
        position: absolute;
        top:100px;
        bottom:0;   
        right: 0;
        left: 0;
        overflow: auto; 
    }
}

</style>
