import { Modal, Input, Select } from 'antd';
import { useState, useEffect } from 'react';
import { autoChart } from '@antv/chart-advisor';
import CodeMirror from '@uiw/react-codemirror';
import './AiCharts.less';

const AiCharts = props => {
  const [optionConfig, setOptionConfig] = useState(props.optionConfig)
  const [aiChartsDiv, setAiChartsDiv] = useState(null)
  useEffect(() => {
    const { data, title, description, selectPurpose, selectTheme } = optionConfig
    const container = document.getElementById('AiCharts');
    if (aiChartsDiv) {
      container.removeChild(aiChartsDiv);
    }
    const tempChartDiv = document.createElement('div');
    tempChartDiv.style.width = '100%'
    tempChartDiv.style.height = '100%'
    container.appendChild(tempChartDiv);
    const autoChartOption = {
      toolbar: true, development: true, title, description, theme: selectTheme.default
    }
    if (selectPurpose.default !== 'all') {
      autoChartOption.purpose = selectPurpose.default
    }
    autoChart(tempChartDiv, data, autoChartOption);
    setAiChartsDiv(tempChartDiv)
  }, [JSON.stringify(optionConfig)])

  const handleCancel = () => {
    // setVisible(false)
    props.closeAiChart()
  }
  const submit = () => {
    props.insertElement('AiCharts', 'AiCharts', optionConfig, '智能图表')
    handleCancel()
  }


  const onFiledChange = (e, type) => {
    switch (type) {
      case 'data': {
        setOptionConfig({ ...optionConfig, ...{ [type]: JSON.parse(e.getValue()) } })
      }; break;
      case 'title':
      case 'description': {
        setOptionConfig({ ...optionConfig, ...{ [type]: e.target.value } })
      }; break;
      case 'theme': {
        const temp = JSON.parse(JSON.stringify(optionConfig))
        temp.selectTheme.default = e
        setOptionConfig(temp)
      }; break;
      case 'purpose': {
        const temp = JSON.parse(JSON.stringify(optionConfig))
        temp.selectPurpose.default = e
        setOptionConfig(temp)
      }; break;
    }
  }
  return (
    <Modal
      title='智能图表'
      visible
      width="80%"
      closable={false}
      getContainer={document.getElementById("workspace")}
      onCancel={handleCancel}
      onOk={submit}
    // footer={[
    //   <Button type="primary" onClick={handleCancel}>
    //     关闭
    //     </Button>
    // ]}
    >

      <div className="ai-charts-container">
        <div className="ai-code-Mirror">
          <Input prefix='图表标题：' onChange={e => onFiledChange(e, 'title')} value={optionConfig.title} />
          <Input prefix='图表副标题：' onChange={e => onFiledChange(e, 'description')} value={optionConfig.description} />
          <div className="prefix">
            <span className="ant-input-prefix">选择图表主题：</span>
            <Select
              style={{ width: '100%' }}
              defaultValue={optionConfig.selectTheme.default}
              optionLabelProp="label"
              onChange={e => onFiledChange(e, 'theme')}
            >
              {optionConfig.selectTheme.option.map(option => {
                return (
                  <Option key={option.value} value={option.value} label={option.label} >
                    {option.label}
                  </Option>
                );
              })}
            </Select>

          </div>
          <div className="prefix">
            <span className="ant-input-prefix">指定图表分析目的：</span>
            <Select
              style={{ width: '100%' }}
              defaultValue={optionConfig.selectPurpose.default}
              optionLabelProp="label"
              onChange={e => onFiledChange(e, 'purpose')}
            >
              {optionConfig.selectPurpose.option.map(option => {
                return (
                  <Option key={option.value} value={option.value} label={option.label} >
                    {option.label}
                  </Option>
                );
              })}
            </Select>
          </div>
          <div className="code-mirror">
            <CodeMirror
              value={JSON.stringify(optionConfig.data || {}, null, '\t')}
              onChange={e => { onFiledChange(e, 'data') }}
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
              }} />
          </div>

        </div>

        <div id="AiCharts" />
      </div>
    </Modal>
  )
}
export default AiCharts;
