import React, { useState, useEffect } from "react";
import { Input, InputNumber } from 'antd';
import CodeMirror from '@uiw/react-codemirror';

const DetailPanel = (props) => {
  const onFiledChange = (e, id, type) => {
    switch (type) {
      case 'codeMirror': {
        props.onNodePropertyChange(e.getValue(), id, props.nowJudge.type)
      }; break;
      case 'number': {
        props.onNodePropertyChange(e, id, props.nowJudge.type)
      }; break;
      case 'string': {
        props.onNodePropertyChange(e.target.value, id, props.nowJudge.type)
      }; break;
    }
  }
  const formatEditor = (property) => {
    if (!property) return [];
    return property.map(item => {
      let component = null
      switch (item.type) {
        case 'codeMirror': {
          component = (
            <React.Fragment>
              <p className="title">{item.title}</p>
              <p className="codeTitle">{'function adapter(data){'}</p>
              <div className="codeMirror">
                <CodeMirror
                  value={item.value}
                  onChange={e => { onFiledChange(e, item.id, 'codeMirror') }}
                  options={{
                    theme: 'ayu-dark',
                    smartIndent: true,  // 是否智能缩进
                    keyMap: 'sublime',
                    lineNumbers: true,
                    mode: 'JavaScript',
                    lineWrapping: true,
                    foldGutter: true,
                    readOnly: false,
                    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                  }}
                />

              </div>
              <p className="codeEnd">{'}'}</p></React.Fragment>
          )
        }; break;
        case 'number': {
          component = (<div className="prefix">
            <span className="ant-input-prefix">{item.title}：</span>
            <InputNumber defaultValue={item.value} onChange={e => onFiledChange(e, item.id, 'number')} />
          </div>);
        }; break;
        case 'string': {
          component = (
            <Input prefix={`${item.title}：`} defaultValue={item.value} onChange={e => onFiledChange(e, item.id, 'string')} />
          );
        }; break;
      }

      return { ...item, component }
    })
  }
  return (
    <React.Fragment>
      <p>节点名称：{props.nowJudge.name}</p>
      {formatEditor(props.nowJudge.property).map(item => {
        return (
          <div key={item.name} className="property-item" >
            <div className="editor">{item.component}</div>
          </div>
        );
      })}



    </React.Fragment>
  )
}
export default DetailPanel;
