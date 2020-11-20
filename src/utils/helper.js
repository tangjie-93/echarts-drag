import { Object } from "core-js";

export function calcMaxRowByLayoutData(layout){
    const count=layout.length,max=Math.max;
    let maxRow=0;
    for(let i=0;i<count;i++){
        maxRow=max(maxRow,layout[i].y+layout[i].h);
    }
    return maxRow;
}
export function validateLayout(layout){
    const keys=["x","y","w","h"];
    if (!Array.isArray(layout)) throw new Error("layout data must be an array!");
    let item;
    for(let i=0,len=layout.length;i<len;i++){
        item=layout[i];
        for(let j=0;j<keys.length;j++){
            if(typeof item[keys[j]]!=='number') {
                throw new Error("layout" + '[' + i + '].' + keys[j] + ' must be a number!');
            }
        }
    }
}
/**
 * Get all static elements.
 * @param  {Array} layout Array of layout objects.
 * @return {Array}        Array of static layout items..
 */
export function getStatics(layout) {
    //return [];
    return layout.filter((l) => l.static);
}
//
export function compact(layout){
    //根据row和col值来排序
    const sortedLayout= layout.slice().sort((a,b)=>{
        a.y===b.y?a.x-b.x:a.y-b.y
    });
    const compareWith=[],verticalCompact=false,horizontalCompact=true;
    const res=Array(sortedLayout.length);
    let tempLayout;
    for(let i=0,len=sortedLayout.length;i<len;i++){
      tempLayout=sortedLayout[i];
      tempLayout=compactItem(compareWith,tempLayout,verticalCompact,horizontalCompact);
      
      compareWith.push(tempLayout);
      res[layout.indexOf(tempLayout)]=tempLayout;
    }
    return res;
}
/**
 * Compact an item in the layout.
 */
function compactItem(compareWith,l,verticalCompact,horizontalCompact){
  if (verticalCompact) {
    // Move the element up as far as it can go without colliding.
    while (l.y > 0 && !getFirstCollision(compareWith, l)) {
      l.y--;
    }
      // Move it down, and keep moving it down if it's colliding.
    let collides;
    while((collides = getFirstCollision(compareWith, l))) {
      l.y = collides.y + collides.h;
    }
  }
  if(horizontalCompact){
     // Move the element up as far as it can go without colliding.
     while (l.x > 0 && !getFirstCollision(compareWith, l)) {
      l.x--;
    }
      // Move it down, and keep moving it down if it's colliding.
    let collides;
    while((collides = getFirstCollision(compareWith, l))) {
      l.x = collides.x + collides.w;
    }
  }
  return l;
}
/**
 * 
 * @param {Array} layout 
 * @param {*} bounds 
 */
export function correctBounds(layout, curColNum,lastColNum) {
    const overItemArr=[];//用于统计超出布局的元素
    for (let i = 0, len = layout.length; i < len; i++) {
      const l = layout[i];
      // Overflows right
      if (l.x + l.w > curColNum) {
        overItemArr.push(l);
      }
      // Overflows left
      if (l.x < 0) {
        l.x = 0;
        l.w = curColNum;
      }
	}
	console.log(overItemArr);
	setLayoutForOverItems(curColNum,lastColNum,overItemArr,layout);
	return layout;
}
/**
 * Returns the first item this layout collides with.
 * It doesn't appear to matter which order we approach this from, although
 * perhaps that is the wrong thing to do.
 *
 * @param  {Object} layoutItem Layout item.
 * @return {Object|undefined}  A colliding layout item, or undefined.
 */
export function getFirstCollision(layout, layoutItem) {
  for (let i = 0, len = layout.length; i < len; i++) {
    if (collides(layout[i], layoutItem)) return layout[i];
  }
}

  /**
 * Given two layoutitems, check if they collide.
 *
 * @return {Boolean}   True if colliding.
 */
export function collides(l1, l2) {
    if (l1 === l2) return false; // same element
    if (l1.x + l1.w <= l2.x) return false; // l1 is left of l2
    if (l1.x >= l2.x + l2.w) return false; // l1 is right of l2
    if (l1.y + l1.h <= l2.y) return false; // l1 is above l2
    if (l1.y >= l2.y + l2.h) return false; // l1 is below l2
    return true; // boxes overlap
}
/**
 * 给超出边界的item进行布局定位
 * @param {Number} colNum 排的列数
 * @param {Array} overItemArr 超出边界的item
 * @param {Array} layout 所有的布局数据
 */
export function setLayoutForOverItems(curColNum,lastColNum,overItemArr,layout){
	if(!overItemArr.length) return [];
	//已经布局的item个数
	const count=layout.length-overItemArr.length;
	//每一层布局多少个
	const countPerLayer=Math.floor(curColNum/2);
	//布局了几层
	let layers=Math.floor(count/countPerLayer);
	//最后一层布局了几个
	let alreadyCount=count%countPerLayer;

	let item=overItemArr.shift();
	while(item){
		if(countPerLayer!==1){
			//当前层已经布局有item了
			if(alreadyCount>0){
				item.x=alreadyCount*2;
				item.y=2*layers;
				//判断当前层是否布局完毕
				if(++alreadyCount===countPerLayer){
					layers++;
					alreadyCount=0;
				}
			}else{
				item.x=0;
				item.y=2*layers;
				alreadyCount++;
			}
		}else{
			item.x=0;
			item.y=2*layers;
			layers++;
		}
		item=overItemArr.shift();
	}
}
/**
 * 获取数据的类型
 * @param {any} obj 
 */
export function toType(obj){
	const toString=Object.prototype.toString;
	const type= typeof obj;
	return /^(object|function)/.test(type) ?toString.call(obj).slice(8,-1).toLowerCase():type;

}
/**
 * 获取数据所有可遍历的属性
 * @param {Object} obj 
 */
export function getOwnProperty(obj){
	if(obj==null) return [];
	return [
		...Object.keys(obj),...Object.getOwnPropertySymbols(obj)
	]
}
/**
 * 数据浅拷贝
 * @param {any} objData 
 */
export function shallowCopy(objData){
  const type=toType();
  if(/^(number|string|boolean|symbol|bigint)$/.test(type)) return objData;
  if(/^(date|regexp)$/.test(type)) return new objData.consgtructor(objData);
  if(/^function$/.test(type)) return new objData.call(this,...arguments);
  if(/^error$/.test(type)) return new objData.consgtructor(objData.message);
  if(/^(array|object)/.test(type)){
    const res=type==='object'?{}:[];
    const keys=getOwnProperty(objData);
    keys.forEach(key=>{
      res[key]=objData[key];
    })
    return res;
  }
}
/**
 * 数据深拷贝
 * @param {any} objData 
 * @param {Set} cache 
 */
export function deepCopy(objData,cache=new Set()){
  const type=toType(objData);
  if(!/^(array|object)$/.test(type)) return shallowCopy(objData);
  //避免调用自身出现死循环
  if(cache.has(objData)) return shallowCopy(objData);
  cache.add(objData);
  //只处理数组和对象
  const keys=getOwnProperty(objData);
  const res=type==='array'?[]:{};
  return keys.reduce((obj,key)=>{
    obj[key]=deepCopy(objData[key],cache);
    return obj;
  },res)
}
/**
 * 函数防抖
 * @param {Function} fn 
 * @param {Number} wait 
 */
export function debounce(fn,wait=300){
	let timer=null;
	return ()=>{
		timer&&clearTimeout(timer);
		!timer&&fn.call(this,...arguments);
		timer=setTimeout(()=>{
		timer=null;
		},wait);
	}
}
/**
 * 函数节流
 * @param {Function} fn 
 * @param {Number} wait 
 */
export function throtle(fn,wait=300){
  let timer=null;
  let previousTime=0;//函数执行的上一个时间点
  return ()=>{
    let now=+new Date();//获取当前时间戳
    let remain=now-previousTime;//表示等待的时间是否大于需要等待的时间
    if(remain>wait){
      if(timer){
        clearTimeout(timer);
        timer=null;
        previousTime=+new Date();
        fn.call(this,...arguments);
      }
    }else{
      if(!timer){
        timer=setTimeout(()=>{
          timer=null;
          previousTime=+new Date();
          fn.call(this,...arguments);
          //表示还需要等待多少时间才能实行函数
        },wait-remain)
      }
    }
  }
}

