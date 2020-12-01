import { Object } from "core-js";

export function calcMaxRowByLayoutData(layout) {
  const count = layout.length,
    max = Math.max;
  let maxRow = 0;
  for (let i = 0; i < count; i++) {
    maxRow = max(maxRow, layout[i].y + layout[i].h);
  }
  return maxRow;
}
export function validateLayout(layout) {
  const keys = ["x", "y", "w", "h"];
  if (!Array.isArray(layout)) throw new Error("layout data must be an array!");
  let item;
  for (let i = 0, len = layout.length; i < len; i++) {
    item = layout[i];
    for (let j = 0; j < keys.length; j++) {
      if (typeof item[keys[j]] !== "number") {
        throw new Error(
          "layout" + "[" + i + "]." + keys[j] + " must be a number!"
        );
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
export function compact(layout) {
  //根据row和col值来排序
  const sortedLayout = layout.slice().sort((a, b) => {
    a.y === b.y ? a.x - b.x : a.y - b.y;
  });
  const compareWith = [],
    verticalCompact = false,
    horizontalCompact = true;
  const res = Array(sortedLayout.length);
  let tempLayout;
  for (let i = 0, len = sortedLayout.length; i < len; i++) {
    tempLayout = sortedLayout[i];
    tempLayout = compactItem(
      compareWith,
      tempLayout,
      verticalCompact,
      horizontalCompact
    );

    compareWith.push(tempLayout);
    res[layout.indexOf(tempLayout)] = tempLayout;
  }
  return res;
}
/**
 * Compact an item in the layout.
 */
function compactItem(compareWith, l, verticalCompact, horizontalCompact) {
  if (verticalCompact) {
    // Move the element up as far as it can go without colliding.
    while (l.y > 0 && !getFirstCollision(compareWith, l)) {
      l.y--;
    }
    // Move it down, and keep moving it down if it's colliding.
    let collides;
    while ((collides = getFirstCollision(compareWith, l))) {
      l.y = collides.y + collides.h;
    }
  }
  if (horizontalCompact) {
    // Move the element up as far as it can go without colliding.
    while (l.x > 0 && !getFirstCollision(compareWith, l)) {
      l.x--;
    }
    // Move it down, and keep moving it down if it's colliding.
    let collides;
    while ((collides = getFirstCollision(compareWith, l))) {
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
export function correctBounds(layout, curColNum, lastColNum) {
  for (let i = 0, len = layout.length; i < len; i++) {
    const l = layout[i];
    // Overflows left
    if (l.x < 0) {
      l.x = 0;
      l.w = curColNum;
    }
  }
  setLayoutForOverItems(curColNum, lastColNum, layout);
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
 * 给超出边界的item进行布局定位 根据每个元素的宽度为2来进行计算的，不太合理
 * @param {Number} colNum 排的列数
 * @param {Array} overItemArr 超出边界的item
 * @param {Array} layout 所有的布局数据
 */
export function setLayoutForOverItems(curColNum, lastColNum, layout) {
  let overItemArr = [];
  //1、没有超出边界，并且当前布局宽度大于上次布局宽度 2、操出布局的元素大于0
  if (curColNum > lastColNum) {
    //每一层布局多少个
    const lastCountPerLayer = Math.floor(lastColNum / 2);
    const curCountPerLayer = Math.floor(curColNum / 2);
    //还需要布局的数量
    overItemArr = layout.slice(lastCountPerLayer);
    //布局了1层
    let layers = 0;
    //第一层布局了几个
    let alreadyCount = lastCountPerLayer;
    let item = overItemArr.shift();
    while (item) {
      if (curCountPerLayer !== 1) {
        //当前层已经布局有item了
        if (alreadyCount > 0) {
          item.x = alreadyCount * 2;
          item.y = 2 * layers;
          //判断当前层是否布局完毕
          if (++alreadyCount === curCountPerLayer) {
            layers++;
            alreadyCount = 0;
          }
        } else {
          item.x = 0;
          item.y = 2 * layers;
          alreadyCount++;
        }
      } else {
        item.x = 0;
        item.y = 2 * layers;
        layers++;
      }
      item = overItemArr.shift();
    }
  } else {
    // 每一层布局多少个
    const curCountPerLayer = Math.floor(curColNum / 2);
    // 布局了几层
    let layers = 1;
    // 最后一层布局了几个
    let alreadyCount = 0;
    let startX = 0;
    //还需要布局的数量
    overItemArr = layout.slice(curCountPerLayer);
    let item = overItemArr.shift();
    while (item) {
      if (curCountPerLayer !== 1) {
        //当前层已经布局有item了
        if (alreadyCount > 0) {
          item.x = alreadyCount * 2;
          item.y = 2 * layers;
          //判断当前层是否布局完毕
          if (++alreadyCount === curCountPerLayer) {
            layers++;
            alreadyCount = 0;
          }
        } else {
          item.x = 0;
          item.y = 2 * layers;
          alreadyCount++;
        }
      } else {
        item.x = 0;
        item.y = 2 * layers;
        layers++;
      }
      item = overItemArr.shift();
    }
  }
}
/**
 * 为尚未布局的元素布局
 * @param {*} curColNum
 * @param {*} lastColNum
 * @param {*} layout
 */
export function setLayoutForUnLayoutItem(curColNum, lastColNum, layout) {
  let unLayoutItems;
  const count = layout.length;
  //1、没有超出边界，并且当前布局宽度大于上次布局宽度 2、操出布局的元素大于0
  if (curColNum > lastColNum) {
    //最开始的x坐标，兼容处理
    let startX = 0; //
    let startY = 0;
    //以前每一层布局多少个item
    let lastCountPerLayer;
    for (let i = 0; i < count; i < count) {
      if (startX + layout[i].w <= lastColNum) {
        startX += layout[i];
      }
      lastCountPerLayer = i;
      break;
    }
    //还需要布局的数量
    unLayoutItems = layout.slice(lastCountPerLayer);
    //每次都是从第一层开始布局
    let layers = 0;
    let item = unLayoutItems.shift();
    while (item) {
		//当前层已经布局有item了
		if (startX + item.w < curColNum) {
			item.x = startX;
			item.y = 2 * layers;
		} else {
			layers++;
			startX = 0;
			item.x = 0;
			item.y = 2 * layers;
		}
		item = unLayoutItems.shift();
    }
  } else {
    // 每一层布局多少个
    const curCountPerLayer = Math.floor(curColNum / 2);
    // 布局了几层
    let layers = 1;
    // 最后一层布局了几个
    let alreadyCount = 0;
    let startX = 0;
    //还需要布局的数量
    unLayoutItems = layout.slice(curCountPerLayer);
    let item = unLayoutItems.shift();
    while (item) {
      if (curCountPerLayer !== 1) {
        //当前层已经布局有item了
        if (alreadyCount > 0) {
          item.x = alreadyCount * 2;
          item.y = 2 * layers;
          //判断当前层是否布局完毕
          if (++alreadyCount === curCountPerLayer) {
            layers++;
            alreadyCount = 0;
          }
        } else {
          item.x = 0;
          item.y = 2 * layers;
          alreadyCount++;
        }
      } else {
        item.x = 0;
        item.y = 2 * layers;
        layers++;
      }
      item = unLayoutItems.shift();
    }
  }
}
