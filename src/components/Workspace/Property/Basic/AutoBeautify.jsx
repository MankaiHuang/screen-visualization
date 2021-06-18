import { Modal, Button, Collapse, Switch, Checkbox, InputNumber, Input, Select } from 'antd';
import { useState, useEffect } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ColorPicker from '../Charts/ColorPicker.tsx';

const { Panel } = Collapse;
const { Option } = Select;
const options = [
  { label: '边框', value: 'border' },
  { label: '装饰', value: 'decoration' },
  { label: '联动', value: 'pagination' },
  { label: '文字', value: 'text' },
];
const textOptions = [{ label: '靠左', value: 'flex-start' }, { label: '居中', value: 'center' }, { label: '靠右', value: 'flex-end' }]
const AutoBeautify = props => {
  const [visible, setVisible] = useState(false)
  const [visibleDecoration, setVisibleDecoration] = useState(false)
  const [data, setData] = useState({
    ...props.data, ...{
      exclude: ['border', 'pagination', 'decoration', 'text'], // 排除
      padding: 40,
      isTitle: true,
      isLine: true,
      titlePosition: 'center',
      fontSize: 26,
      fontColor: '#fff',
      decorationType: 2,
      borderColor: '#1296DB',
      borderType: 10,
    }
  })
  const [visibleTitle, setVisibleTitle] = useState(data.isTitle || true)
  const [visibleLine, setVisibleLine] = useState(data.isLine || true)
  const submit = (value) => {
    props.onPropertyChange({ path: 'autoBeautify', value }, 'basic', 'update');
  }

  const onchange = (e, type) => {
    data[type] = e
    if (type === 'isTitle') { // 因为数据未通过onPropertyChange回传 导致无法使用isTitle进行实时判断
      setVisibleTitle(e)
    } else if (type === 'isLine') {
      setVisibleLine(e)
    }
    setData(data)
  }
  const onFiledChange = (e, item, type) => {
    onchange(e, item.type)
  }
  const openModal = () => {
    setVisible(true)
  }
  const handleCancel = () => {
    setVisible(false)
  }
  const handleCancelDecoration = () => {
    setVisibleDecoration(false)
  }
  const selectBorder = (index, type) => {
    data[type] = index
    setData(data)
    type === 'borderType' ? handleCancel() : handleCancelDecoration()
  }

  return (
    <Collapse ghost bordered={false} expandIconPosition="right" defaultActiveKey={['0']} >
      <Panel header={
        <div className="collapse-header-help">
          <span>一键美化</span>
          <a href="https://www.yuque.com/docs/share/19051cdd-17c1-4db8-8f18-585f797c69a3?# 《一键美化》" target="_blank">
            <QuestionCircleOutlined />
          </a>
        </div>
      } key="1" >
        <div className="property-item" style={{ width: '100%', float: 'left', marginRight: '5%' }}>
          <div className="editor">
            <img onClick={openModal} src={require(`@/assets/templateImg/border${data.borderType}.png`)} style={{ width: '100%', cursor: 'pointer' }} />
            <Modal
              width="80%"
              title="请选择边框样式"
              getContainer={document.getElementById("workspace")}
              visible={visible}
              closable={false}
              onCancel={handleCancel}
              footer={[
                <Button type="primary" onClick={handleCancel}>
                  关闭
                </Button>
              ]}
            >
              <div className="background-list">
                {[...Array(20)].map((item, index) => {
                  return (
                    <img key={index} onClick={e => selectBorder(index + 1, 'borderType')} src={require(`@/assets/templateImg/border${index + 1}.png`)} />
                  )
                })}
              </div>
            </Modal>
          </div>
        </div>
        <div className="property-item" style={{ width: '100%', float: 'left', marginRight: '5%' }}>
          <div className="editor">
            <span style={{ marginRight: '5px' }}>排除类型</span>
            <Checkbox.Group options={options} defaultValue={data.exclude} onChange={e => { onchange(e, 'exclude') }} />
          </div>
        </div>
        <div className="property-item" style={{ width: '100%', float: 'left', marginRight: '5%' }}>
          <div className="editor">
            <div className="prefix">
              <span className="ant-input-prefix">内边距：</span>
              <InputNumber defaultValue={data.padding} onChange={e => { onchange(e, 'padding') }} />
            </div>
          </div>
        </div>
        <div className="property-item" style={{ width: '100%', float: 'left', marginRight: '5%' }}>
          <div className="editor">
            <Collapse ghost bordered={false} expandIconPosition="right" defaultActiveKey={['1']} style={{ position: 'relative' }}>
              <Panel header="标题设置" key="1" >
                <div className="property-item" style={{ width: '100%', float: 'left', marginRight: '5%' }} >
                  <div className="editor">
                    <div className="switch-div">
                      <span>是否显示标题</span>
                      <Switch
                        defaultChecked={data.isTitle}
                        rows={4}
                        onChange={e => { onchange(e, 'isTitle') }}
                      />
                    </div>
                  </div>
                </div>
                {visibleTitle && (
                  <React.Fragment>
                    <div className="property-item" style={{ width: '100%', float: 'left', marginRight: '5%' }}>
                      <div className="editor">
                        <div className="prefix">
                          <span className="ant-input-prefix">标题对齐方式</span>
                          <Select
                            style={{ width: '100%' }}
                            defaultValue={data.titlePosition}
                            optionLabelProp="label"
                            onChange={e => onchange(e, 'titlePosition')}
                          >
                            {textOptions.map(option => {
                              return (
                                <Option key={option.label} value={option.value} label={option.label}>
                                  {option.label}
                                </Option>
                              );
                            })}
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="property-item" style={{ width: '100%', float: 'left', marginRight: '5%' }}>
                      <div className="editor">
                        <div className="prefix">
                          <span className="ant-input-prefix">标题字号大小:</span>
                          <InputNumber value={data.fontSize} onChange={e => { onchange(e, 'fontSize') }} />
                        </div>
                      </div>
                    </div>
                    <div className="property-item" style={{ width: '100%', float: 'left', marginRight: '5%' }}>
                      <div className="editor">
                        <div className="color-property basic-color-property">
                          <span>标题字体颜色</span>
                          <ColorPicker onFiledChange={onFiledChange} item={{ default: data.fontColor, type: 'fontColor' }} />
                        </div>
                      </div>
                    </div>
                    <div className="property-item" style={{ width: '100%', float: 'left', marginRight: '5%' }}>
                      <div className="editor">
                        <div className="property-item" style={{ width: '100%', float: 'left', marginRight: '5%' }} >
                          <div className="editor">
                            <div className="switch-div">
                              <span>是否开启下划线</span>
                              <Switch
                                defaultChecked={data.isLine}
                                onChange={e => { onchange(e, 'isLine') }}
                              />
                            </div>
                          </div>
                        </div>
                        {visibleLine && (
                          <React.Fragment>
                            <div className="property-item" style={{ width: '100%', float: 'left', marginRight: '5%' }} >
                              <div className="editor">
                                <img onClick={e => setVisibleDecoration(true)} src={require(`@/assets/templateImg/decoration${data.decorationType}.png`)} style={{ width: '100%', cursor: 'pointer' }} />
                                <Modal
                                  width="80%"
                                  title="请选择下划线样式"
                                  getContainer={document.getElementById("workspace")}
                                  visible={visibleDecoration}
                                  closable={false}
                                  onCancel={handleCancelDecoration}
                                  footer={[
                                    <Button type="primary" onClick={handleCancelDecoration}>
                                      关闭
                                   </Button>
                                  ]}
                                >
                                  <div className="background-list">
                                    {[2, 10].map((item, index) => {
                                      return (
                                        <img key={index} onClick={e => selectBorder(item, 'decorationType')} src={require(`@/assets/templateImg/decoration${item}.png`)} />
                                      )
                                    })}
                                  </div>
                                </Modal>
                              </div>
                            </div>

                            <div className="property-item" style={{ width: '100%', float: 'left', marginRight: '5%' }}>
                              <div className="editor">
                                <div className="color-property basic-color-property">
                                  <span>下划线颜色</span>
                                  <ColorPicker onFiledChange={onFiledChange} item={{ default: data.borderColor, type: 'borderColor' }} />
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </Panel>
            </Collapse>
          </div>
        </div>

        <div className="property-item" style={{ width: '100%', float: 'left', marginRight: '5%' }}>
          <div className="editor">
            <Button size="large" type="primary" onClick={e => submit(data)}>确定应用</Button>
          </div>
        </div>
      </Panel>
    </Collapse >
  )
}
export default AutoBeautify;
