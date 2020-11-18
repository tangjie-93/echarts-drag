<template>
   <div class="drag-container" ref="drag-container" :style="styleObj">
       <slot/>
   </div>
</template>

<script>
import {calcMaxRowByLayoutData, compact, correctBounds, validateLayout} from "../../utils/helper"
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
        cols:{
            type: Object,
            default: function(){
                return{ lg: 12, md: 9, sm: 6, xs: 4, xxs: 2 }
            },
        }
    },
    data(){
        return {
            width:NaN,
            styleObj:{
                display:'block'
            }
        }
    },
    created(){
        //  console.log("layoutitem created")
         this.$emit("layout-created");
         this.updateHeight();
    },
    mounted(){
        validateLayout(this.layout);
        compact(this.layout);
        correctBounds(this.layout,{cols:this.colNum});
        console.dir(this.layout.slice(0));
        this.width=this.$refs["drag-container"]&&this.$refs["drag-container"].offsetWidth;
        this.$eventBus.$emit("dragLayout-mounted",this.width);
    },
    methods:{
        updateHeight(){
            this.styleObj.height=this.calcHeight();
        },
        calcHeight(){
            const maxRows=calcMaxRowByLayoutData(this.layout)
            return  maxRows*(this.rowHeight + this.margin[1]) + this.margin[1] + 'px';
        }
    }
}
</script>

<style lang="scss" scoped>
.drag-container{
    position: relative;
    transition:all 200ms ease;
}
</style>