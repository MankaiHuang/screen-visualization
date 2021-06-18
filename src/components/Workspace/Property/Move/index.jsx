import { Button } from 'antd';
import { } from 'react';

import './index.less';

const MoveProperty = props => {
  const alignList = [{
    label: '组件对齐',
    option: [{
      label: '左对齐',
      value: 'left',
    }, {
      label: '右对齐',
      value: 'right',
    }, {
      label: '顶部对齐',
      value: 'top',
    }, {
      label: '底部对齐',
      value: 'bottom',
    }, {
      label: '水平对齐',
      value: 'hor',
    }, {
      label: '垂直对齐',
      value: 'ver',
    }, {
      label: '水平均分',
      value: 'horSplit',
    }, {
      label: '垂直均分',
      value: 'verSplit',
    }]
  },]
  const onChange = type => {
    props.onPropertyChange && props.onPropertyChange(type, null, 'multiply');
  }
  return (
    <div className="moveProperty">
      {alignList.map(list => {
        return (
          <div key={list.label} className="property-item">
            <div className="title">{list.label}</div>
            <div className="editor menu-list" >
              {list.option.map(item => {
                return (
                  <div key={item.value} onClick={e => { onChange(item.value) }}>
                    <img src={require(`@/assets/icon/${item.value}.png`)} />
                    <span>{item.label}</span>
                  </div>
                  // <Tooltip key={item.value} title={item.label} >
                  //   <Button type="text" ghost icon={<img src={require(`@/assets/icon/${item.value}.png`)} />} onClick={e => { onChange(item.value) }} />
                  // </Tooltip>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="property-item exit">
        <div className="editor">
          <Button danger ghost onClick={e => { onChange('exit') }}>退出多选状态</Button>
        </div>
      </div>
    </div>

  );
};

export default MoveProperty;
