<template>
  <div class="content">
      <drag-layout :layout.sync="echartsData">
        <drag-item v-for="item in echartsData" :key="item.i" :x='item.x' :y="item.y" :w="item.w" :h="item.h">
          {{item.i}}
            <!-- <render-chart :displayType="item.displayType" /> -->
        </drag-item>
      </drag-layout>
  </div>
</template>

<script>
import  DragLayout from "./dragComp/drag-layout";
import  DragItem from "./dragComp/drag-item";
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components:{
    DragLayout,
    DragItem
    // RenderChart:()=>import("./renderChart")
  },
  data(){
    return {
      echartsData:[
        {
          i:1,
          x:0,y:0,
          w:2,h:2
        },
         {
          i:2,
          x:0,y:0,
          w:2,h:2
        },
         {
          i:3,
          x:0,y:0,
          w:2,h:2
        },
         {
          i:4,
          x:0,y:0,
          w:2,h:2
        },
        {
          i:5,
          x:0,y:0,
          w:2,h:2
        },
         {
          i:6,
          x:0,y:0,
          w:2,h:2
        },
         {
          i:7,
          x:0,y:0,
          w:2,h:2
        },
         {
          i:8,
          x:0,y:0,
          w:2,h:2
        },
         {
          i:9,
          x:0,y:0,
          w:2,h:2
        },
         {
          i:10,
          x:0,y:0,
          w:2,h:2
        },
        {
          i:11,
          x:0,y:0,
          w:2,h:2
        },
         {
          i:12,
          x:0,y:0,
          w:2,h:2
        },
         {
          i:13,
          x:0,y:0,
          w:2,h:2
        },
         {
          i:14,
          x:0,y:0,
          w:2,h:2
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.centent{
  width: 100%;
}
</style>
