/**
 * 大屏拖拽,缩放控制功能
 */
let isChangeLeft = true
let isChangeTop = true
function MHQDrager () {
  this.init();
}

function move (e, that, nowTemplate) {
  let outLayerProperty = {}
  const { type, parentId } = nowTemplate.property

  if (type === 'group' && !parentId) {
    // 最外层的组
    outLayerProperty.top = 0
    outLayerProperty.left = 0
  } else if (type === 'group') {
    outLayerProperty = vm.getParentGroupProperty(nowTemplate, false)
  } else {
    outLayerProperty = vm.getParentGroupProperty(nowTemplate)
  }

  let top = 0
  let left = 0
  e.pageX = Math.round(e.pageX / vm.zoom);
  e.pageY = Math.round(e.pageY / vm.zoom);
  const posix = !document.move_target
    ? {
      x: 0,
      y: 0,
    }
    : document.move_target.posix;


  // 限制拖拽的位置不能超过边界
  let elementWidth = 600;
  let elementHeight = 400;
  if (nowTemplate) {
    elementWidth = nowTemplate.property.width;
    elementHeight = nowTemplate.property.height;
  }
  if (elementWidth + e.pageX - posix.x > vm.basicConfig.width) {
    left = vm.basicConfig.width - elementWidth;
  } else if (e.pageX - posix.x < 0) {
    left = 0;
  } else {
    left = e.pageX - posix.x;
  }
  if (elementHeight + e.pageY - posix.y > vm.basicConfig.height) {
    top = vm.basicConfig.height - elementHeight;
  } else if (e.pageY - posix.y < 0) {
    top = 0;
  } else {
    top = e.pageY - posix.y;
  }

  left -= outLayerProperty.left
  top -= outLayerProperty.top;
  // top left 相差10像素的元素自动吸附对齐
  if (type !== 'group') { // 不是组
    (function autoAlign () {
      // 自动对齐
      vm.templateList.map(item => {
        if (
          top + 10 >= item.property.top &&
          top - 10 <= item.property.top
        ) {
          // 水平对齐
          if (nowTemplate.property.elementId !== item.property.elementId) {
            top = item.property.top  // 对齐时与实际top保持一致
            item.isHorizontal = true;
          }
        } else if (
          left + 10 >= item.property.left &&
          left - 10 <= item.property.left
        ) {
          // 垂直对齐
          if (nowTemplate.property.elementId !== item.property.elementId) {
            left = item.property.left
            item.isVertical = true;
          }
        } else if (
          left + nowTemplate.property.width + 10 >= item.property.left + item.property.width &&
          left + nowTemplate.property.width - 10 <= item.property.left + item.property.width
        ) {
          // 右侧对齐
          if (nowTemplate.property.elementId !== item.property.elementId) {
            left = item.property.left + item.property.width - nowTemplate.property.width
            item.isHorizontal = true;
          }
        }
        else if (
          top + nowTemplate.property.height + 10 >= item.property.top + item.property.height &&
          top + nowTemplate.property.height - 10 <= item.property.top + item.property.height
        ) {
          // 底部对齐
          if (nowTemplate.property.elementId !== item.property.elementId) {
            top = item.property.top + item.property.height - nowTemplate.property.height
            item.isVertical = true;
          }
        } else if (
          top + nowTemplate.property.height / 2 + 10 >=
          item.property.top + item.property.height / 2 &&
          top + nowTemplate.property.height / 2 - 10 <=
          item.property.top + item.property.height / 2
        ) {
          // 水平中心对齐
          top =
            item.property.top + item.property.height / 2 - nowTemplate.property.height / 2;

          item.isHorCenter = true;
        } else if (
          left + nowTemplate.property.width / 2 + 10 >=
          item.property.left + item.property.width / 2 &&
          left + nowTemplate.property.width / 2 - 10 <=
          item.property.left + item.property.width / 2
        ) {
          // 垂直中心对齐
          left =
            item.property.left + item.property.width / 2 - nowTemplate.property.width / 2;

          item.isVerCenter = true;
        } else {
          left = left
          item.isHorizontal = false;
          item.isVertical = false;
          item.isHorCenter = false;
          item.isVerCenter = false;
        }
      });
    })();
  }

  if (vm.multiplyStatus && nowTemplate.property.type !== 'group') { // 多选移动
    vm.multiplyMoveList.map((item) => {
      if (item === nowTemplate.property.elementId) return; // 不修改自己
      const template = vm.findTemplateForId(item)
      const moveTop = top - nowTemplate.property.top + template.property.top
      const moveLeft = left - nowTemplate.property.left + template.property.left // 移动的距离
      requestAnimationFrame(() => {
        vm.setValue(template.property, 'top', Math.round((moveTop)))
        vm.setValue(template.property, 'left', Math.round(moveLeft))
      })
    })
    requestAnimationFrame(() => {
      vm.setValue(nowTemplate.property, 'left', left)
      vm.setValue(nowTemplate.property, 'top', top)
    })
  }
  else {
    requestAnimationFrame(() => {
      if (isChangeLeft) {
        vm.setValue(nowTemplate.property, 'left', left)
      }
      if (isChangeTop) {
        vm.setValue(nowTemplate.property, 'top', top)
      }

    })
  }

  const callback =
    document.call_down ||
    function () {
      requestAnimationFrame(() => {
        if (that.move_target) {
          let translate3d = vm.setTranslate3d(that.move_target.style.transform, 'left', left);
          translate3d = vm.setTranslate3d(translate3d, 'top', top);
          $(that.move_target).css({
            transform: translate3d,
          });
        }
      })
    };
  callback.call(that, e, posix);
}
MHQDrager.prototype.init = function () {
  // 注册全局拖拽和缩放监听
  $(document)
    .mousemove(function (e) {
      vm.isMove = false;
      if (this.move) {
        if (vm.isMoveGroup && vm.nowGroupTemplate) {
          move(e, this, vm.nowGroupTemplate)
        } else if (vm.nowTemplate) {
          move(e, this, vm.nowTemplate)
        }
        vm.isMove = true;
      }
    })
    .mouseup(function (e) {
      setTimeout(() => {
        isChangeLeft = true
        isChangeTop = true
      }, 100); // 每次抬起鼠标 恢复默认 防止拖拽不实时更新 延迟100毫秒 防止缩放时 很快速度耍一下鼠标  导致图表位移
      const callback = document.call_up || function () { };
      callback.call(this, e);
      $.extend(this, {
        move: false,
        move_target: null,
        call_down: false,
        call_up: false,
      });
    });
};

/**
 * 新建可拖动实例
 * obj 选择器 ".xx" or '#xx'
 * cb回调
 */
MHQDrager.prototype.newInstance = function (obj, cb) {
  // 创建可拖动实例
  const $box = $(obj)
    .mousedown(function (e) {
      // 鼠标点击事件
      if (vm.nowTemplate && vm.nowTemplate.isLock) {
        // 如果是锁定状态就禁止拖拽
        vm.Toast('图层被锁定禁止拖拽!', 'warning');
        return false;
      }
      const offset = $(this).offset();
      this.posix = {
        x: e.pageX - offset.left,
        y: e.pageY - offset.top,
      };
      this.posix.x = Math.round(this.posix.x / vm.zoom);
      this.posix.y = Math.round(this.posix.y / vm.zoom);
      $.extend(document, {
        move: true,
        move_target: this,
        call_up (e) {
          // 通知发生了宽高变化
          cb && cb($(obj));
        },
      });
      e.stopPropagation() // 阻止冒泡 防止拖拽的时候选择框出现
    })
    .on('mousedown', '.coor', e => {
      handlerScale(e, ['width', 'height'], $box)     // 点击右下角缩放事件
    }).on('mousedown', '.handle-top', e => {
      handlerScale(e, ['topHeight', 'top'], $box)     // 点击上方
    }).on('mousedown', '.handle-right', e => {
      handlerScale(e, ['width'], $box)       // 点击右方
    }).on('mousedown', '.handle-bottom', e => {
      handlerScale(e, ['height'], $box)        // 点击下方
    }).on('mousedown', '.handle-left', e => {
      handlerScale(e, ['leftWidth', 'left'], $box)      // 点击左方
    }).on('mousedown', '.el-icon-refresh-right', e => {
      handlerScale(e, ['transform'], $box)      // 旋转
    });

};

function handlerScale (e, changeProperty, box) {
  // 缩放旋转公共函数
  isChangeLeft = false // 小圆点默认都不实时更新
  isChangeTop = false
  if (changeProperty.includes('left')) {
    isChangeLeft = true
  } else if (changeProperty.includes('top' || changeProperty.includes('topHeight'))) {
    isChangeTop = true
  }
  const posix = {
    w: box.width(),
    h: box.height(),
    x: e.pageX,
    y: e.pageY,
    r: changeProperty.includes('transform') && Number(box[0].children[0].children[0].style.transform.split('(')[1].replace('deg)', '')),
  };

  posix.x = Math.round(posix.x / vm.zoom);
  posix.y = Math.round(posix.y / vm.zoom);
  $.extend(document, {
    move: true,
    call_down (e) {
      requestAnimationFrame(() => {
        const css = {}
        changeProperty.forEach(item => {
          switch (item) {
            case 'width': css[item] = Math.max(30, e.pageX - posix.x + posix.w); break;
            case 'leftWidth': css.width = Math.max(30, posix.x + posix.w - e.pageX); break; // 这个是左侧圆点的计算方式 
            case 'height': css[item] = Math.max(30, e.pageY - posix.y + posix.h); break;
            case 'topHeight': css.height = Math.max(30, posix.y + posix.h - e.pageY); break; // 这个是顶部圆点的计算方式 
            // case 'left': css[item] = posix.x + posix.w - e.pageX > 30 && e.pageX; break;
            // case 'top': css[item] = posix.y + posix.h - e.pageY > 30 && e.pageY; break;
            case 'left': css.transform = vm.setTranslate3d(box[0].style.transform, posix.x + posix.w - e.pageX > 30 && e.pageX); break;
            case 'top': css.transform = vm.setTranslate3d(box[0].style.transform, item, posix.y + posix.h - e.pageY > 30 && e.pageY); break;
            case 'transform': css[item] = `rotate(${(posix.r + ((e.pageX / posix.x) - 1.35) * 100) % 360}deg)`; break;
            default: break;
          }
        })
        if (changeProperty.includes('transform')) { // 旋转单独处理
          box[0].children[0].children[0].style.transform = css.transform
        } else {
          box.css(css);
        }
      })
    },
  });
  return false;
}
