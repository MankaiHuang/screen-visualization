import React, { useState, useEffect } from 'react';
import request from '@/utils/request';
import { Modal, Spin, Select, Button, Row, Col, Input, Tabs, message, Tooltip, Switch, InputNumber } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import DataConversion from './DataConversion.jsx';
import DataKeyMap from './DataKeyMap';
import './Debugger.less'
import { initProxyPack, queryDataSource } from '@/services/dataSource.js'

const { Option } = Select;
const { TabPane } = Tabs;

const Debugger = (props) => {
  const upProps = props.props
  const [visible, setVisible] = useState(true);
  const [response, setResponse] = useState(upProps.property.dataBindType.default === 'api' ? upProps.property.responseData : upProps.property.SSEResponseData)
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState(upProps.property.dataBindType.default === 'api' ? '1' : '2');
  const [isSuccess, setIsSuccess] = useState(false)
  const [dataOriginList, setDataOriginList] = useState({})
  const [url, setUrl] = useState(upProps.property.url)
  const [method, setMethod] = useState(upProps.property.method.default)
  const [params, setParams] = useState(upProps.property.params)
  const { SSEServer } = upProps
  const { dataOrigin } = upProps.property
  const bindType = upProps.property.dataBindType.default // API or SSE
  const isShareAPi = Boolean(upProps.property.shareApiId)  // 是否是共享api
  const handleCancel = e => {
    props.closeDebugger()
    setVisible(false)
  };

  const fixParamsTime = (params) => {
    // 如果params中存在时间查询 因 参数里面不可获取当前时间 因此这里对约定的特殊字符进行获取替换
    // getTime(0) 当天 getTime(5)  五天前
    function getTime (type, hhmmss) {
      // type =0 为当天 type = 1 为前一天
      // hhmmss 自己传需要的时分秒
      const now = new Date();
      let date
      if (type === 0) {
        date = new Date(now + 8 * 3600 * 1000); // 增加8小时 当天
      } else {
        const now = new Date();
        date = new Date(now - 3 * type * 8 * 3600 * 1000); // type天前
      }
      return `${date.toJSON().substr(0, 19).replace('T', ' ').substring(0, 10)} ${hhmmss}`;
    }
    let newParams = JSON.stringify(params)
    const bakTime = newParams.match(/#.*?\#/gi)
    bakTime && bakTime.forEach(item => {
      const time = item.split('#')[1].split(',')
      const originTime = getTime(time[0], time[1])
      newParams = newParams.replace(item, originTime)
    })

    return JSON.parse(newParams)
  }
  const initData = async () => {
    switch (bindType) {
      case 'api': {
        const { dataPath } = upProps.property;
        const newParams = fixParamsTime(params)
        let result = null;
        if (url && method) {
          try {
            setLoading(true);
            result = await request(url, {
              prefix: '',
              method,
              data: newParams,
              credentials: 'same-origin'
            });
            setIsSuccess(true)
            setActiveKey('2')
          } catch (err) {
            result = err;
          } finally {
            setLoading(false);
          }
          setResponse(JSON.stringify(result, null, '\t\t'))
          if (upProps.property.dataPath.length > 0) {
            // 如果存在绑定 则点击调试立即更新组件
            upProps.onPropertyChange && upProps.onChangeSingle(upProps.property.dataPath, 'updateApiBind');
          } else {
            upProps.onPropertyChange && upProps.onPropertyChange({ path: 'responseData', value: result }, upProps.property.type, 'update');
          }
        }
      }; break;
      case 'SSE': {
        const { dataPath } = upProps.property;
        if (SSEServer) {
          setLoading(true);
          const source = new EventSource(SSEServer);
          source.onerror = event => {
            message.error('连接失败')
            source.close()
            setLoading(false);
            // this.Toast(item.name || `${item.type}连接中断`, 'warning')
          };
          source.onmessage = event => {
            setResponse(JSON.parse(event.data))
            setIsSuccess(true)
            setActiveKey('2')
            if (upProps.property.dataPath.length > 0) {
              // 如果存在绑定 则点击调试立即更新组件
              upProps.onChangeSingle && upProps.onChangeSingle(upProps.property.SSEDataPath, 'updateApiBind');
            } else {
              upProps.onPropertyChange && upProps.onPropertyChange({ path: 'SSEResponseData', value: JSON.parse(event.data) }, upProps.property.type, 'update');
            }
            source.close()
            setLoading(false);
          };
        }
      }; break;
     
    }

  }
  const tabsChange = e => {
    setActiveKey(e)
  }
  const onFiledChange = (e, type) => {
    switch (type) {
      case 'method': {
        setMethod(e)
        props.onPropertyChange && props.onPropertyChange({ path: `method.default`, value: e }, upProps.property.type, 'update');
      }; break;
      case 'params': {
        setParams(JSON.parse(e.getValue()))
        props.onPropertyChange && props.onPropertyChange({ path: 'params', value: JSON.parse(e.getValue()) }, upProps.property.type, 'update');
      }; break;
      case 'dataIsAdd': {
        upProps.property[type] = e
        props.onPropertyChange && props.onPropertyChange({ path: 'dataIsAdd', value: e }, upProps.property.type, 'update');
      }; break;
      case 'dataMaxLength': {
        props.onPropertyChange && props.onPropertyChange({ path: 'dataMaxLength', value: e }, upProps.property.type, 'update');
      }; break;
      case 'url': {
        setUrl(e.target.value)
        props.onPropertyChange && props.onPropertyChange({ path: 'url', value: e.target.value }, upProps.property.type, 'update');
      }; break;
    }


  }

  useEffect(() => {
    if (bindType === 'SSE' && upProps.SSEServer && (!response || JSON.stringify(response) === '{}')) {
      initData()
    }

    if (JSON.stringify(response) !== '{}') {
      setIsSuccess(true)
      setActiveKey("2")
    }
  }, [])
  return (
    <Modal
      title={bindType === 'api'  ? '数据调试' : 'SSE调试'}
      visible={visible}
      width="50%"
      closable={false}
      getContainer={document.getElementById("workspace")}
      onCancel={handleCancel}
      footer={[
        <Button type="primary" onClick={handleCancel}>
          关闭
          </Button>
      ]}
    >
      <Row gutter={16}>
        {bindType === 'api' && (<Col span={2.5} className="data-conversion" >
          <Select defaultValue={method || 'get'} disabled={isShareAPi} onChange={e => onFiledChange(e, 'method')}>
            <Option value="get">GET</Option>
            <Option value="post">POST</Option>
            <Option value="put">PUT</Option>
            <Option value="delete">DELETE</Option>
          </Select>
        </Col>)}
        <Col span={18}>
          {bindType === 'api' ?
            (
              isShareAPi ? <Tooltip title="共享api禁止修改" trigger="click" color="geekblue">
                <Input prefix={`${bindType}地址：`} defaultValue={url} value={url} />
              </Tooltip> :
                <Input prefix={`${bindType}地址：`} defaultValue={url} onChange={e => onFiledChange(e, 'url')} />
            ) :
            (
              bindType === 'SSE' ?
                <Tooltip title="请前往大屏菜单修改" trigger="click" color="geekblue">
                  <Input prefix={`${bindType}地址：`} value={upProps.SSEServer} defaultValue={upProps.SSEServer} />
                </Tooltip> :
                <Tooltip title="请前往数据配置修改" trigger="click" color="geekblue">
                  <Input prefix={`${bindType}地址：`} value={dataOriginList.proxy || dataOriginList.url} defaultValue={dataOriginList.proxy || dataOriginList.url} />
                </Tooltip>
            )}
        </Col>
        <Col span={2}>
          <Button type="primary" loading={loading} onClick={e => initData()}>发送</Button>
        </Col>
      </Row>

      <div className="tab-header">

        {bindType === 'SSE' && isSuccess && (<div className="data-is-add" >
          <span>是否开启数据叠加</span>
          <Switch defaultChecked={upProps.property.dataIsAdd} onChange={e => { onFiledChange(e, 'dataIsAdd') }} />
          { upProps.property.dataIsAdd && (<div className="prefix">
            <span className="ant-input-prefix">数据最大长度：</span>
            <InputNumber defaultValue={upProps.property.dataMaxLength} onChange={e => onFiledChange(e, 'dataMaxLength')} />
          </div>)}
        </div>)}
        <Tabs activeKey={activeKey} onChange={e => tabsChange(e)}>
          {bindType === 'api' && (<TabPane tab="请求参数(params)" key="1">
            <CodeMirror
              value={JSON.stringify(params || {}, null, '\t')}
              onChange={e => { onFiledChange(e, 'params') }}
              options={{
                theme: 'ayu-dark',
                smartIndent: true,  // 是否智能缩进
                keyMap: 'sublime',
                lineNumbers: true,
                mode: 'JavaScript',
                lineWrapping: true,
                foldGutter: true,
                readOnly: isShareAPi,
                gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
              }}
            />
          </TabPane>)}
          <TabPane tab="请求的结果(response)" key="2">
            <Spin spinning={loading} tip="加载中...">
              <CodeMirror
                value={Object.prototype.toString.call(response) === '[object Object]' ? JSON.stringify(response || {}, null, '\t') : response}
                options={{
                  theme: 'ayu-dark',
                  smartIndent: true,  // 是否智能缩进
                  keyMap: 'sublime',
                  lineNumbers: true,
                  mode: 'JavaScript',
                  lineWrapping: true,
                  readOnly: true,
                  foldGutter: true,
                  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                }}
              />
            </Spin>
          </TabPane>
          {isSuccess && (<TabPane tab="数据映射" key="3">
            <DataKeyMap
              props={upProps}
              onChangeSingle={upProps.onChangeSingle}
              close={handleCancel}
            />
          </TabPane>)}
          {isSuccess && (<TabPane tab="数据转换器" key="4">
            <DataConversion props={upProps}
              close={handleCancel} />
          </TabPane>)}

        </Tabs>
      </div>


    </Modal>
  )
}

export default Debugger;