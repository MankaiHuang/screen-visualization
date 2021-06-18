import React, { useState, useEffect } from 'react';
import { Button, Select } from 'antd';
import CodeMirror from '@uiw/react-codemirror';

const { Option } = Select;

const DataConversion = (props) => {
  const upProps = props.props
  const bindType = upProps.property.dataBindType.default // API or SSE

  const [codeList, setCodeList] = useState([{
    label: '数据转图表',
    value: 'charts',
    data: `function adaptor(data) {
      const a = data.data.charts.map(item => {
        return { name: item.name, value: item.value }
      })
      return [{ data: a }]
    }`
  }, {
    label: '地图折线数据',
    value: 'areaPoint',
    data: `function adaptor(data) {
      return JSON.parse(data.data.queryParam)
    }`
  }, {
    label: '内容库数据转换',
    value: 'dataContainer',
    data: `function adaptor(data) {
      const a = data.results.map(item => {
        let type = item.entityData.type_
        switch (type){
          case 'biz_sobey_audio':{
            type = 'voice'
          };break;
          case 'biz_sobey_video':{
            type = 'video'
          };break;
          case 'biz_sobey_picture':{
            type = 'img'
          };break;
          case 'biz_sobey_audio':{
            type = 'voice'
          };break;
        }
        return { title: item.entityData.name_, description:'上传人:'+ item.entityData.creator ,type,url:item.entityData.keyframe_}
      })
      return a
    }`
  }, {
    label: '新媒体任务',
    value: 'newMedia',
    data: `function adaptor(data) {
      const a = data.data.results.map(item => {
        return { title: item.instance.overview, time: item.instance.createTime,name:item.instance.overview,status: item.task.status === 'PASS'?2:0 }
      })
      return a
    }`
  }, {
    label: '新媒体任务图表',
    value: 'newMediaCharts',
    data: `function adaptor(data) {
      return [{ data: [{name:'不通过',value:data.data.count.REFUSE},{name:'通过',value:data.data.count.PASS_CC+data.data.count.PASS}] }]
    }`
  },])
  const [functionString, setFunctionString] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectCdoe, setSelectCode] = useState(codeList[currentIndex].data)
  const handleOk = () => {
    upProps.onPropertyChange && upProps.onPropertyChange(functionString, upProps.property.type, 'conversionFunction');
    props.close()
  };
  const onChange = e => {
    setFunctionString(e.getValue())
  }
  const handleChange = (e) => {
    const index = codeList.findIndex((item) => {
      return item.value == e
    })
    setCurrentIndex(index)
    setSelectCode(codeList[index].data)
  }
  useEffect(() => {
    const tempCodelist = [...codeList]
    const tempDataConversion = (bindType === 'api' ) ? upProps.property.dataConversionFunction : upProps.property.SSEDataConversionFunction
    if (tempDataConversion != '') {
      tempCodelist.unshift({
        label: '当前组件配置',
        value: 'nowConfig',
        data: tempDataConversion
      })
    }
    setCodeList(tempCodelist)
    setCurrentIndex(0)
    setSelectCode(tempCodelist[0].data)
  }, [])
  return (
    <div className="data-conversion">
      <p>请选择代码段</p>
      <Select value={codeList[currentIndex].value} style={{ width: 400 }} onChange={handleChange}>
        {codeList.map(item => {
          return (
            <Option value={item.value} key={item.value}>{item.label}</Option>
          )
        })}
      </Select>
      <p style={{ marginTop: '1em' }}>数据转换器代码内容</p>
      <CodeMirror
        value={selectCdoe}
        onChange={e => { onChange(e) }}
        options={{
          theme: 'ayu-dark',
          smartIndent: true,  // 是否智能缩进
          keyMap: 'sublime',
          lineNumbers: true,
          mode: 'JavaScript',
          lineWrapping: true,
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        }}
      />
      <Button type="primary" style={{ float: 'right' }} onClick={handleOk}>调试</Button>
    </div>
  )
}

export default DataConversion;