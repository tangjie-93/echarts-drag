<template>
   <div class="drag-container" ref="drag-container" :style="styleObj">
       <slot/>
   </div>
</template>

<script>
import {calcMaxRowByLayoutData, compact, correctBounds, validateLayout,debounce, throtle} from "../../utils/helper"
import { getBreakPointByWidth, getColNumByBreakPoint} from "../../utils/resizeUtil";
let that;
export default {
    name:"drag-layout",
    props:{
        layout:{
            type:Array,
            required:true
        },
        colNum:{
            type:Number,
            default:12,
        },
        rowHeight:{
            type:Number,
            default:150,
        },
        maxRows:{
            type:Number,
            default:Infinity
        },
        margin:{
            type:Array,
            default:function(){
                return [10,10]
            }
        },
        isDraggable:{
            type:Boolean,
            default:true
        },
        isResizable:{
            type:Boolean,
            default:true
        },
        isResponsive:{
            type:Boolean,
            default:true
        },
        breakPoints:{
            type:Object,
            default:function(){
                return {
                    lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0
                }
            }
        },
        colNums:{
            type: Object,
            default: function(){
                return{ lg: 12, md:8, sm: 6, xs: 4, xxs: 2 }
            },
        }
    },
    data(){
        return {
            width:NaN,
            styleObj:{
                display:'block'
            },
            lastColNum:NaN,
            storedLayout:{},
            intialLayout:this.layout
        }
    },
    created(){
        //  console.log("layoutitem created")
        this.$emit("layout-created");
        that=this;
    },
    mounted(){
       
        this.$nextTick(()=>{
           
            this.updateHeight();
            this.updateWidth();
            const {breakPoints,colNums,intialLayout,width,lastColNum}=this;
            const breakPoint=getBreakPointByWidth(breakPoints,width);
            const colNum=getColNumByBreakPoint(breakPoint,colNums);

            validateLayout(intialLayout);
            compact(intialLayout);
            correctBounds(intialLayout,colNum,lastColNum);
            this.lastColNum=colNum;
            this.$eventBus.$emit("dragLayout-mounted",this.width,colNum);
            this.storedLayout[colNum]=JSON.stringify(intialLayout);
            window.addEventListener('resize',this.windowResizeHandler)
        })
    },
    beforeDestroy(){
        window.removeEventListener('resize',this.windowResizeHandler);
    },
    methods:{
        updateHeight(){
            this.styleObj.height=this.calcHeight();
        },
        updateWidth(){
            this.calcWidth();
        },
        calcWidth(){
            if(this.$refs["drag-container"]){
                 this.width=this.$refs["drag-container"].offsetWidth;
            }
        },
        calcHeight(){
            const maxRows=calcMaxRowByLayoutData(this.layout)
            return  maxRows*(this.rowHeight + this.margin[1]) + this.margin[1] + 'px';
        },
        windowResizeHandler:debounce(()=>{
            that.$nextTick(()=>{
                that.updateWidth();
                const {breakPoints,colNums,intialLayout,width,lastColNum}=that;
                const breakPoint=getBreakPointByWidth(breakPoints,width);
                const colNum=getColNumByBreakPoint(breakPoint,colNums);
                that.$eventBus.$emit("dragLayout-mounted",width,colNum);
                if(that.storedLayout[colNum]){
                    that.intialLayout=JSON.parse(that.storedLayout[colNum])
                }else{
                    compact(intialLayout);
                    correctBounds(intialLayout,colNum,lastColNum);
                     this.lastColNum=colNum;
                    that.storedLayout[colNum]=JSON.stringify(intialLayout);
                }  
            })
           
        })
    }
}
</script>

<style lang="scss" scoped>
.drag-container{
    position: relative;
    transition:all 200ms ease;
}
</style>