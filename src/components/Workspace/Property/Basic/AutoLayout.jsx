import { message, Modal } from 'antd';
import { useState, useEffect } from 'react';
import './index.less';

// 动态属性表头,为方便扩展

const AutoLayout = props => {
  const [selectLayout, setSelectLayout] = useState(null)
  const [visible, setVisible] = useState(true);
  const [templateListIndex, setTemplateListIndex] = useState([])
  const layoutList = [{
    name: '布局1',
    value: [
      { width: '40%', height: '40%', top: 0, left: 0 },
      { width: '20%', height: '40%', top: 0, left: '40%' },
      { width: '40%', height: '40%', top: 0, left: '60%' },
      { width: '70%', height: '60%', top: '40%', left: 0 },
      { width: '30%', height: '60%', top: '40%', left: '70%' },
    ],
  }, {
    name: '布局2',
    width: 1920,
    height: 1080,
    value: [
      { width: '20%', height: '50%', top: 0, left: 0 },
      { width: '60%', height: '50%', top: 0, left: '20%' },
      { width: '20%', height: '50%', top: 0, left: '80%' },
      { width: '50%', height: '50%', top: '50%', left: 0 },
      { width: '50%', height: '50%', top: '50%', left: '50%' },
    ],
  }, {
    name: '布局3',
    width: 1920,
    height: 1080,
    value: [
      { width: '20%', height: '50%', top: 0, left: 0 },
      { width: '20%', height: '50%', top: 0, left: '20%' },
      { width: '20%', height: '50%', top: 0, left: '40%' },
      { width: '20%', height: '50%', top: 0, left: '60%' },
      { width: '20%', height: '50%', top: 0, left: '80%' },
      { width: '33.3%', height: '50%', top: '50%', left: 0 },
      { width: '33.3%', height: '50%', top: '50%', left: '33.3%' },
      { width: '33.3%', height: '50%', top: '50%', left: '66.6%' },
    ],
  }, {
    name: '布局4',
    width: 1000,
    height: 800,
    value: [
      { width: '40%', height: '50%', top: 0, left: 0 },
      { width: '40%', height: '50%', top: 0, left: '40%' },
      { width: '20%', height: '50%', top: 0, left: '80%' },
      { width: '70%', height: '50%', top: '50%', left: 0 },
      { width: '30%', height: '50%', top: '50%', left: '70%' },
    ],
  }]
  let templateList = props.layer // 当前页面存在的组件
  const obj = {};
  templateList = templateList.reduce((cur, next) => {
    obj[next.elementId] ? "" : obj[next.elementId] = true && cur.push(next);
    return cur;
  }, []) // 数组对象去重
  function handleOk () {
    if (selectLayout === null) {
      message.error('请选择布局');
    } else {
      props.onChangeSingle && props.onChangeSingle({ ...selectLayout, templateListIndex }, 'autoLayout');
      setVisible(false)
      props.closeAutoLayout()
    }
  };

  function handleCancel () {
    setVisible(false)
    props.closeAutoLayout()
  };
  function onSelectLayout (data) {
    // 选择要增加的模型
    setSelectLayout(data)
  }
  function drage (ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
  }
  function drop (ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("Text");
    try {
      ev.target.appendChild(document.getElementById(data));
      const newSelectLayout = JSON.parse(JSON.stringify(selectLayout))
      setTemplateListIndex([
        ...templateListIndex,
        {
          elementId: data,
          index: ev.target.id
        }
      ])
    }
    catch (err) { }

  }
  function allowDrop (ev) {
    ev.preventDefault();
  }
  return (
    <Modal
      visible={visible}
      wrapClassName="mapModal"
      closable={false}
      full
      getContainer={document.getElementById("basic-property")}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      {!selectLayout && (<div><span className="title">请选择布局</span></div>)}
      <div className="gift">
        {layoutList.map((item, index) => {
          const type = index + 1
          return (
            <div key={item.name} onClick={e => onSelectLayout(item)} className={item.value === selectLayout ? 'active' : null}>
              <img src={require(`@/assets/layout/layout${type}.png`)} />
              <span>{item.name}</span>
            </div>
          )
        })}
      </div>
      {selectLayout && (<div className="templateList">
        {templateList.map(item => {
          const { type } = item
          if (item.componentsType !== 'private') {
            return (
              <li key={item.elementId} draggable="true" onDragStart={e => drage(e)} >
                <img id={item.elementId} className="templateImg" src={require(`@/assets/templateImg/${type}.png`)} alt="img" />
                <span>{item.title || item.type}</span>
              </li>
            )
          }
          <li key={item.elementId} draggable="true" onDragStart={e => drage(e)}>
            <img id={item.elementId} className="templateImg" src={require('@/assets/noImage.png')} alt="img" />
            <span>{item.title || item.type}</span>
          </li>

        })}
      </div>)}
      <div className="layoutDetails">
        {selectLayout && selectLayout.value.map((item, index) => {
          const { width, height, top, left } = item
          return (
            <div
              id={index}
              key={item.name}
              onDrop={e => drop(e)}
              onDragOver={e => { allowDrop(e) }}
              style={{ width, height, top, left, backgroundColor: `#${Math.random().toString(16).substr(2, 6).toUpperCase()}` }} />
          )
        })}
      </div>
    </Modal>
  )
}
export default AutoLayout;
