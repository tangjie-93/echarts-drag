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
    layout.sort((a,b)=>{
        a.y===b.y?a.x-b.x:a.y-b.y
    });
}
export function correctBounds(layout, bounds) {
    const collidesWith = getStatics(layout);
    for (let i = 0, len = layout.length; i < len; i++) {
      const l = layout[i];
      // Overflows right
      if (l.x + l.w > bounds.cols) l.x = bounds.cols - l.w;
      // Overflows left
      if (l.x < 0) {
        l.x = 0;
        l.w = bounds.cols;
      }
    //   if (!l.static) collidesWith.push(l);
      else {
        // If this is static and collides with other statics, we must move it down.
        // We have to do something nicer than just letting them overlap.
        while(getFirstCollision(collidesWith, l)) {
          l.y++;
        }
      }
    }
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