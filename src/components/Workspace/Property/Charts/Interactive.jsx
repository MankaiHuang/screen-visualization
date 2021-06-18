import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Select } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Option } = Select
const Interactive = props => {
  const [allTemplate, setAllTemplate] = useState([])
  // const [linkKeyMatchStatus, setLinkKeyMatchStatus] = useState()
  const [customBindKey, setCustomBindKey] = useState(props.property.multLink || { elementId: [], customKey: '' })
  const { layer, onPropertyChange, property, linkKeyMatchStatus } = props
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
        } else if (v.property.elementId !== property.elementId) {
          tempData.push({
            label: v.property.tit || v.typeName || v.type,
            value: v.property.elementId
          })
        }
      })
    }
    find(layer)

    setAllTemplate(tempData)
  }
  function onChange (e, isCustomKey) {
    if (isCustomKey) {
      customBindKey.customKey = e.target.value
    } else {
      customBindKey.elementId = e
    }
    property.multLink = customBindKey
    setCustomBindKey(customBindKey)
    // onPropertyChange({ ...customBindKey }, null, 'link');
    onPropertyChange({ path: 'multLink', value: customBindKey }, props.property.type, 'update');
  }

  return (
    <div className="interactive">
      <div className="prefix" style={{ marginBottom: '20px' }}>
        <span className="ant-input-prefix">{props.item.text}</span>
        <Select
          style={{ width: '100%' }}
          optionLabelProp="label"
          defaultValue={customBindKey.elementId || null}
          placeholder="请选择要绑定的组件"
          mode="multiple"
          onChange={e => onChange(e, false)}
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
      <Row gutter={16} style={{ display: 'flex', alignItems: 'center' }}>
        <Col span={17} style={{ display: 'flex' }}>
          <Input prefix="联动的字段：" defaultValue={customBindKey.customKey} onChange={e => onChange(e, true)} />;
        </Col>

        <Col span={7}>
          <a href='https://www.yuque.com/docs/share/bb1a86df-0ad6-4ef1-bdd6-115aae9c84a9?# 《组件之间交互》' target="_blank">
            <QuestionCircleOutlined />
          </a>
          {/* {linkKeyMatchStatus ? (
            <div className="link-status">
              <div />
              <span>匹配成功</span>
            </div>

          ) : (
              <div className="link-status link-status-error">
                <div />
                <span>匹配失败</span>
              </div>
            )} */}
        </Col>
      </Row>

    </div>
  );
};

export default Interactive;
