import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select
const InputShare = props => {
  const [allTemplate, setAllTemplate] = useState([])
  // const [linkKeyMatchStatus, setLinkKeyMatchStatus] = useState()
  const [bindId, setBindId] = useState(props.property.shareList)
  const { layer, onPropertyChange, property } = props
  useEffect(() => {
    initLayer()
  }, [property.elementId]);
  function initLayer () {
    // 初始化可供选择的组件列表
    // 将页面上的组件放入可选择列表 供用户进行绑定联动
    const tempData = []
    const find = (node) => {
      node.forEach(v => {
        if (v.property.type === 'group') {
          find(v.property.children)
        } else if (v.property.componentsType !== 'pagination' && v.property.elementId !== property.elementId) {
          tempData.push({
            label: v.property.title || v.type,
            value: v.property.elementId
          })
        }
      })
    }
    find(layer)
    setAllTemplate(tempData)
  }
  function onChange (e) {
    setBindId(e)
    onPropertyChange({ path: 'shareList', value: e }, props.property.type, 'update');
  }

  return (
    <div className="interactive">
      <div className="prefix" style={{ marginBottom: '20px' }}>
        <span className="ant-input-prefix">{props.item.text}</span>
        <Select
          style={{ width: '100%' }}
          optionLabelProp="label"
          defaultValue={bindId || []}
          placeholder="请选择要绑定的组件"
          mode="multiple"
          onChange={e => onChange(e)}
        >
          {allTemplate.map(option => {
            return (
              <Option key={option.value} value={option.value} label={option.label} >
                {option.label}
              </Option>
            );
          })}
        </Select>
      </div>

    </div>
  );
};

export default InputShare;
