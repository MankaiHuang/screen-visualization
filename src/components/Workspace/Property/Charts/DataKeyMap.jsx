import React, { useState, useEffect } from 'react';
import { Input, Button, TreeSelect, Row, Col } from 'antd';

const DataKeyMap = props => {
  const upProps = props.props
  const bindType = upProps.property.dataBindType.default // API or SSE
  const [responseDataKey, setResponseDataKey] = useState([]);
  const [dataKey, setDataKey] = useState(bindType === 'api' ? upProps.property.dataPath : upProps.property.SSEDataPath);
  const tempResponseDataKey = []
  const initResponseDatakey = (responseData, keys) => {
    // 获取response的所有key 并生成tree供treeSelect使用
    // cbzIndex 为数组的占位符 在preview页面会根据此占位符进行替换
    // tree的每个值带上父节点的路径便于preview处理
    if (responseData) {
      if (Object.prototype.toString.call(responseData) === '[object Array]') {
        // 是数组取第一项
        responseData = responseData[0];
      }
      let currentIndex = 0;
      for (const i in responseData) {
        if (Object.prototype.toString.call(responseData[i]) === '[object Array]') {
          // 是数组
          keys.push({ title: i, value: i, children: [] });

          for (const j in responseData[i][0]) {
            keys[currentIndex].children.push({
              title: `${i}.${j}`,
              value: `${i}.cbzIndex.${j}`,
            });
          }
        } else if (Object.prototype.toString.call(responseData[i]) === '[object Object]') {
          // 是对象
          keys.push({ title: i, value: i, children: [] });
          let index = 0;
          for (const j in responseData[i]) {
            keys[currentIndex].children.push({
              title: `${i}.${j}`,
              value: `${i}.${j}`,
              children: [],
            });
            if (
              Object.prototype.toString.call(responseData[i][j]) === '[object Object]' ||
              Object.prototype.toString.call(responseData[i][j]) === '[object Array]'
            ) {
              initResponseDatakey(responseData[i][j], keys[currentIndex].children[index]);
            }
            index++
          }
        } else if (keys.children) {
          keys.children.push({ title: `${keys.title}.${i}`, value: `${keys.title}.cbzIndex.${i}` });
        } else {
          keys.push({ title: i, value: i });
        }
        currentIndex++;
      }
      // disabledHaveChildren(allKey);
    }
  };
  function initDataKey () {
    let defaultData = null;
    let keys = [];
    const tempMapKey = []
    try {
      defaultData = upProps.property.option.data
      if (Object.prototype.toString.call(defaultData) === '[object Array]') {
        // 数组就第一项的key
        if (Object.prototype.toString.call(defaultData[0]) === '[object Object]') {
          // 如果是数组对象则取第一个
          keys = Object.keys(defaultData[0]);
        } else {
          keys = Object.keys(defaultData);
        }
      } else if (Object.prototype.toString.call(defaultData) === '[object Object]') {
        // 对象取全部
        keys = Object.keys(defaultData);
      } else {
        keys = ['option.data'];
      }
    } catch (err) {
      keys = ['option.data'];
    }
    keys.map(key => {
      tempMapKey.push({ systemKey: key, apiKey: '' });
    });
    setDataKey(tempMapKey)
  }
  // const disabledHaveChildren = tree => {
  //   // 让有子节点的父节点禁止点击
  //   tree.map(item => {
  //     if (item.children && item.children.length > 0) {
  //       // item.disabled = true;
  //       disabledHaveChildren(item.children);
  //     }
  //   });
  //   setApiKey(tree);
  // };
  useEffect(() => {
    (dataKey.length == 0 || !dataKey) && initDataKey()
    initResponseDatakey(bindType === 'api' ? upProps.property.responseData : upProps.property.SSEResponseData, tempResponseDataKey);
    setResponseDataKey(tempResponseDataKey)
  }, [upProps.property.elementId]);
  const submit = () => {
    if (bindType === 'api') {
      upProps.property.dataPath = dataKey
    } else {
      upProps.property.SSEDataPath = dataKey
    }
    upProps.onChangeSingle && upProps.onChangeSingle(dataKey, 'updateApiBind');
    props.close()
  }
  const onChange = (value, index) => {
    const tempDataKey = JSON.parse(JSON.stringify(dataKey));
    tempDataKey[index].apiKey = value;
    setDataKey(tempDataKey)
  };

  return (
    <div className="data-key">
      <Row>
        <Col span={3}>
          <p>字段</p>
        </Col>
        <Col span={8}>
          <p>映射</p>
        </Col>
      </Row>
      {dataKey.map((item, index) => {
        return (
          <Row key={item.systemKey} style={{ marginBottom: '10px' }}>
            <Col span={3}>
              <span >{item.systemKey}</span>
            </Col>
            <Col span={8}>{responseDataKey.length > 0 && (<Input.Group className="selectKeyMap" compact >
              <TreeSelect
                style={{ width: '100%' }}
                defaultValue={item.apiKey}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={responseDataKey}
                placeholder="请选择"
                treeDefaultExpandAll
                onSelect={e => {
                  onChange(e, index);
                }}
              />
            </Input.Group>)}</Col>
          </Row>
        )
      })}
      <Button type="primary" onClick={e => { submit() }}>刷新图表</Button>
    </div>
  );
};

export default DataKeyMap;
