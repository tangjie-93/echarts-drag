/**
 * 根据breaPoint获取排列的列数
 * @param {String} breakPoint 
 */
export function getColNumByBreakPoint(breakPoint,colNums){
    if (!colNums[breakPoint]) {
      throw new Error("cols for current breakpoint " + breakPoint + " is not exised!");
    }
    return colNums[breakPoint];
  }
  
  /** 根据宽度来获取breakPoint
   * @param {Object} breakPoints
   * @param {Number} width 
   */
  export function getBreakPointByWidth(breakPoints,width){
      const keys=Object.keys(breakPoints);
      for(let i=0,len=keys.length;i<len;i++){
          if(width>breakPoints[keys[i]]){
            return keys[i];
          }
      }
  }
  