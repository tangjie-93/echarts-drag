<template>
  <div class="drag-item" ref='drag-item' :style="styleObj">
      <slot/>
  </div>
</template>

<script>
export default {
    name:"drag-item",
    props:{
        w:{
            type:Number,
            required:true
        },
        h:{
            type:Number,
            required:true
        },
        x:{
            type:Number,
            required:true
        },
        y:{
            type:Number,
            required:true
        },
        isDraggable: {
            type: Boolean,
            required: false,
            default: null
        },
        isResizable: {
            type: Boolean,
            required: false,
            default: null
        },
    },
    data(){
        return {
            itemX:this.x,
            itemY:this.y,
            itemW:this.w,
            itemH:this.h,
            colNum:1,
            containerWidth: 100,
            rowHeight: 30,
            margin: [10, 10],
            maxRows: Infinity,
            draggable: null,
            resizable: null,
            useCssTransforms: false,
            styleObj:null
        }
    },
    created(){
        this.$eventBus.$on("dragLayout-mounted",(width)=>{
            this.containerWidth=width;
            this.createStyle();
        })
        this.initData();
        this.createStyle();
    },
    mounted(){
        console.log("item mounted")
    },
    methods:{
        initData(){
            const parent=this.$parent;
            this.colNum=parent.colNum;
            this.rowHeight=parent.rowHeight;
            this.containerWidth=parent.width||100;
            this.margin=parent.margin||[10,10];
            this.maxRows=parent.maxRows;
            this.draggable=parent.isDraggable||this.isDraggable;
            this.resizable=parent.isDraggable||this.isResizable;
            this.useCssTransforms=parent.useCssTransforms;
        },
        createStyle(){
            //设置item的宽
            if(this.x+this.w>this.colNum){
                this.itemX=0;
                this.itemW=this.w>this.colNum?this.colNum:this.w;
            }else{
                this.itemX=this.x;
                this.itemW=this.w;
            }
            const position=this.calcPosition(this.itemX,this.itemY,this.itemW,this.itemH);
            this.styleObj=this.setPosition(position);
        },
        setPosition({top,left,width,height}){
            
            return {
                top: top + "px",
                left: left + "px",
                width: width + "px",
                height: height + "px",
                position: 'absolute'
            }
        },
        /**
         * @param {Number} x item的x轴的位置
         * @param {Number} y item的y轴的位置
         * @param {Number} w item的在x轴占几个单位
         * @param {Number} h item的在y轴占几个单位
         */
        calcPosition(x,y,w,h){
            //每一列的宽度
            const colWidth=this.calcColWidth();
            const {rowHeight,margin}=this;
            const {round,max}=Math;
            const left=round(colWidth*x+(x+1)*margin[0]),
             top=round(rowHeight*y+(y+1)*margin[1]),
             width=w===Infinity?w:round(colWidth*w+max(0,w-1)*margin[0]),
             height=  h===Infinity?h:round(rowHeight*h+max(0,h-1)*margin[1]);

            return {
                left,
                top,
                width,
                height
            }
        },
        //计算每一列的宽度
        calcColWidth(){
            const {containerWidth,margin,colNum}=this;
            const colWidth=(containerWidth-(margin[0]*(colNum+1)))/colNum;
            return colWidth;
        }

    }
}
</script>

<style lang="scss" scoped>
.drag-item{
    position: absolute;
    border: 1px solid gray;
}
</style>