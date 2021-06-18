import { Menu, Button, Tooltip } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { findGroupForId, getGuid } from '@/utils/utils'

import { FolderOutlined, LockOutlined, EyeInvisibleOutlined, BranchesOutlined } from '@ant-design/icons';
import './index.less';

const { SubMenu } = Menu;

function Layer (props) {
  const [dragId, setDragId] = useState(null)
  const [layer, setLayer] = useState([])
  const [isCtrl, setIsCtrl] = useState(false)
  const [openSubKey, setOpenSubKey] = useState([]) // 展开的subMenu Key数组
  const [isShowMenu, setIsShowMenu] = useState(false) // 右键菜单
  const [eventProperty, setEventProperty] = useState({ left: 0, top: 0 })
  const [showSubMenu, setShowSubMenu] = useState(false) // 是否显示submenu 右键菜单
  const [isClickSubMenu, setIsClickSubMenu] = useState(false) // 是否右键点击了submenu
  const [menuStatus, setMenuStatus] = useState(null)
  const layerRef = useRef(null);

  useEffect(() => {
    layerRef.current.addEventListener('keydown', keyDown, false);
    layerRef.current.addEventListener('keyup', keyUp, false);
    setLayer(props.layer)
    const tempOpenSubKey = [...openSubKey]
    if (props.nowGroupId) {
      const find = (node) => {
        // 找到当前组的所有父组
        if (!node) return;
        tempOpenSubKey.push(node.property.elementId)
        if (node.property.parentId) {
          find(findGroupForId(node.property.parentId, layer))
        }
      }
      const nowGroup = findGroupForId(props.nowGroupId, layer)
      find(nowGroup)
    }
    setOpenSubKey([...new Set(tempOpenSubKey)])
  }, [JSON.stringify(props.layer), props.nowGroupId])
  useEffect(() => {
    if (isShowMenu) {
      const menu = document.querySelector('#layerMenu')
      if (menu) {
        menu.style.left = `${eventProperty.clientX}px`
        menu.style.top = `${eventProperty.clientY - 70}px`
      }
    }

  }, [menuStatus]) // 当菜单属性改变时执行
  useEffect(() => {
    // 如果点了中间的iframe 则让菜单隐藏
    if (document.activeElement.tagName === 'IFRAME') {
      setIsCtrl(false)
      closeMenu()
    }
  }, [document.activeElement.tagName])

  function keyDown (event) {
    setIsCtrl(event.ctrlKey)
  }
  function keyUp (event) {
    const key = event.keyCode;
    if (key === 17) {
      setIsCtrl(false)
    }
  }
  function onClickGroup (e, id) {
    let tempOpenSubKey = [...openSubKey]
    if (tempOpenSubKey.includes(e.key)) {
      tempOpenSubKey = tempOpenSubKey.filter(item => { return item !== e.key }) // 去掉已经存在的
    } else {
      props.onPropertyChange({ groupId: id }, null, 'layerClickGroup');  // 展开的时候才发送点击组事件
      tempOpenSubKey.push(e.key)

    }
    setOpenSubKey(tempOpenSubKey)
    e.domEvent.preventDefault()

  }
  function clickLayer (id) {
    // 点击图层中某个图层
    let tempSelectKeys = [...(props.nowId || [])]
    if (isCtrl) {
      if (tempSelectKeys.includes(id)) {
        tempSelectKeys.splice(tempSelectKeys.findIndex(item => item === id), 1)
      } else {
        tempSelectKeys.push(id)
      }
    } else {
      tempSelectKeys = [id]
    }
    // setSelectKeys(tempSelectKeys)
    props.onPropertyChange({ selectKeys: tempSelectKeys }, null, 'layerClick');
  }
  function onMenuClick (type) {
    setIsShowMenu(false)
    setShowSubMenu(false)
    props.onPropertyChange({ type, selectElementId: props.nowId }, null, 'onMenuClick');
  }
  function closeMenu () {
    setIsShowMenu(false)

  }
  function openMenu (e, isSubMenu = false, groupId = null, isClickMenu = true) {
    // isSubMenu 是否点击的子菜单根节点
    // groupId 点击子菜单根节点的 groupId
    // isClickMenu 是否点击的菜单 
    if (e.target.tagName === 'UL' || !isClickMenu) {
      isShowMenu && setIsShowMenu(false) // 不显示菜单 并把菜单关掉
      e.preventDefault()
      return;
    };
    const id = e.target.dataset.id || e.target.parentElement.dataset.id
    if (!props.nowId.includes(id)) {// 右键的那个元素不包含在nowId中 则替换
      props.onPropertyChange({ selectKeys: [id] }, null, 'layerClick');
    }
    // 点击 submenu && 不是点击menu-item
    if (isSubMenu && !id) {
      props.onPropertyChange({ groupId }, null, 'layerClickGroup');  // 发送点击组事件
      setIsClickSubMenu(true) // 右键点击submenu
    } else {
      setIsClickSubMenu(false)
    }
    setMenuStatus(getGuid()) // 确保再次右键弹出菜单
    const property = {
      clientX: e.clientX,
      clientY: e.clientY
    }
    setEventProperty(property)
    setIsShowMenu(true)
    isSubMenu && e.stopPropagation() // 点击submenu阻止冒泡
    e.preventDefault()
  }
  function allowDrop (e) {
    e.preventDefault()
  }
  function _css (el, prop, val) {
    const style = el && el.style;

    if (style) {
      if (val === void 0) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
          val = document.defaultView.getComputedStyle(el, '');
        } else if (el.currentStyle) {
          val = el.currentStyle;
        }

        return prop === void 0 ? val : val[prop];
      }
      if (!(prop in style)) {
        prop = `-webkit-${prop}`;
      }

      style[prop] = val + (typeof val === 'string' ? '' : 'px');

    }
  }
  function onDrop (e) {
    const dragElement = document.getElementById(dragId)
    const moveOffsetTop = dragElement.offsetTop + 70 // 当前拖拽离顶部的高度
    let step = 0
    if (e.pageY - moveOffsetTop > 0) {
      // 下移
      step = 70
    } else {
      step = 40
    }
    _css(dragElement, 'will-change', `transform`); // 增加动画
    _css(dragElement, 'transition', `all ${300}ms`);
    _css(dragElement, 'transform', `translate3d(0,${e.pageY - moveOffsetTop}px,0)`);
    const dropGroupId = e.currentTarget.dataset.groupid // 拖入的groupId
    const targetId = e.target.dataset.id || e.target.parentElement.dataset.id
    setTimeout(() => {
      _css(dragElement, 'transition', `none`);
      _css(dragElement, 'transform', `translate3d(0,0,0)`); // 清除动画属性
      _css(dragElement, 'will-change', `auto`);
      props.onPropertyChange({ templateId: dragId, groupId: dropGroupId, targetId }, 'layer', 'updateLayer')
    }, 300);
    e.stopPropagation() // 阻止事件冒泡 因为是树结构 不阻止会调用父级的事件

  }
  function onDrag (e) {
    setDragId(e.currentTarget.dataset.id)
  }
  function onChangeShowSubMenu (isShow) {
    setShowSubMenu(isShow)
  }
  function isExportBluePrint (id) {
    return props.bluePrintIdList && props.bluePrintIdList.some(item => {
      if (item.elementId === id) return true;
    })
  }
  function renderMenu (node,) {
    node.sort((a, b) => {
      return b.property.zIndex - a.property.zIndex // 根据zIndex 排序
    })

    return node.map((item) => {
      if (item.property.type !== 'group') {
        return renderMenuItem(item, false)
      }
      return (
        <SubMenu
          key={item.property.elementId}
          icon={<FolderOutlined />}
          popupOffset={[-10, -10]}
          data-groupid={item.property.elementId}
          title={item.property.groupName || '组'}
          className={props.nowGroupId === item.property.elementId ? 'active-layer' : null}
          onDrop={onDrop}
          onDragOver={allowDrop}
          popupClassName="subMenu"
          onContextMenu={e => openMenu(e, true, item.property.elementId)}
          onTitleClick={e => { onClickGroup(e, item.property.elementId) }
          }
        >
          {renderMenu(item.property.children)}
        </SubMenu >
      )
    })
  }
  function renderMenuItem (item) {
    const { type, elementId, componentsType, preview, title, typeName, isHidden } = item.property
    return (
      <Menu.Item key={elementId} multiple onClick={e => clickLayer(elementId)} onDrag={onDrag} draggable="true" data-id={elementId} id={elementId}>
        {componentsType !== 'private' ? (<img src={require(`@/assets/templateImg/${type}.png`)} alt="图片" />) : (<img src={preview} alt="图片" />)}
        <span>{title || typeName || type}</span>
        <div className="menu-item-right-icon">
          {item.isLock && (<LockOutlined />)}
          {isHidden && (<EyeInvisibleOutlined />)}
          {isExportBluePrint(elementId) && (<BranchesOutlined />)}
        </div>

      </Menu.Item>
    );
  }

  return (
    <div id="layer" ref={layerRef} tabIndex="0" onClick={e => openMenu(e, false, null, false)} onContextMenu={e => openMenu(e, false, null, false)}>
      <div className="layerOperate">
        <Tooltip title="上移" color="geekblue">
          <Button ghost icon={<img src={require(`@/assets/icon/up.png`)} alt="img" />} onClick={e => onMenuClick('up')} />
        </Tooltip>
        <Tooltip title="下移" color="geekblue">
          <Button ghost icon={<img src={require(`@/assets/icon/down.png`)} alt="img" />} onClick={e => onMenuClick('down')} />
        </Tooltip>
        <Tooltip title="置顶" color="geekblue">
          <Button ghost icon={<img src={require(`@/assets/icon/sticky.png`)} alt="img" />} onClick={e => onMenuClick('sticky')} />
        </Tooltip>
        <Tooltip title="置底" color="geekblue">
          <Button ghost icon={<img src={require(`@/assets/icon/setLow.png`)} alt="img" />} onClick={e => onMenuClick('setLow')} />
        </Tooltip>
      </div>
      <Menu mode="inline" theme="dark" className="layer-list"
        selectedKeys={props.nowId}
        openKeys={openSubKey}
        onClick={closeMenu}
        onDrop={onDrop}
        onDragOver={allowDrop}
        onContextMenu={openMenu}>

        {renderMenu(layer)}
      </Menu>
      {isShowMenu && (<ul id="layerMenu" className="layer-menu">
        {!isClickSubMenu && (<li className="menu_item" onClick={() => onMenuClick('delete')}>删除</li>)}
        {!isClickSubMenu && (<li className="menu_item" onClick={() => onMenuClick('copy')}>复制</li>)}
        {props.nowId.length > 1 && !isClickSubMenu && (<li className="menu_item" onClick={() => onMenuClick('group')}>编组<span /></li>)}
        {isClickSubMenu && props.nowGroupId && (<li className="menu_item" onClick={() => onMenuClick('cannelGroup')}>取消编组<span /></li>)}
        {!isClickSubMenu && (<li className="menu_item" onMouseEnter={e => onChangeShowSubMenu(true)}
          onMouseLeave={e => onChangeShowSubMenu(false)}>图层操作</li>)}
        {showSubMenu && (<ul className="layer-menu sub_menu" onMouseEnter={e => onChangeShowSubMenu(true)}
          onMouseLeave={e => onChangeShowSubMenu(false)}>
          {!isClickSubMenu && (<li className="menu_item" onClick={() => onMenuClick('lock')}>锁定</li>)}
          {!isClickSubMenu && (<li className="menu_item" onClick={() => onMenuClick('unLock')}>解锁</li>)}
          {!isClickSubMenu && (<li className="menu_item" onClick={() => onMenuClick('sticky')}>置顶</li>)}
          {!isClickSubMenu && (<li className="menu_item" onClick={() => onMenuClick('setLow')}>置低</li>)}
          {!isClickSubMenu && (<li className="menu_item" onClick={() => onMenuClick('up')}>上移一层</li>)}
          {!isClickSubMenu && (<li className="menu_item" onClick={() => onMenuClick('down')}>下移一层</li>)}
        </ul>)}
      </ul>)}
    </div>

  );
}

export default Layer;
