import { Input, InputNumber, Button, Upload, message, Select, Collapse, Tabs, Image } from 'antd';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { inputUploadImg } from '@/utils/utils'
import { baseUrl,severUrl } from '@/utils/request'
import ColorThief from '../../../../../node_modules/colorthief/dist/color-thief.mjs'
import AutoLayout from './AutoLayout'
import AutoBeautify from './AutoBeautify'
import InternalBackground from './InternalBackground'
import ColorPicker from '../Charts/ColorPicker.tsx';

import './index.less';

// 动态属性表头,为方便扩展
const { Option } = Select;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Dragger } = Upload;
const validateMessages = {
  required: '${label} 不能为空!',
};
const colorList = [
  { label: '天蓝', value: ["#294F83", "#3C67A0", "#7EA6D8", "#BBDDFB", "#ACCEF3", "#CAE9Fb", "#58D5FF"] },
  { label: '科技蓝', value: ["#85A5FF", "#597EF7", "#2F54EB", "#1D39C4", "#10239E", "#061178", "#030852"] },
  { label: '炫酷绿', value: ["#5CDBD3", "#36CFC9", "#13C2C2", "#08979C", "#006D75", "#00474F", "#002329"] },
  { label: '炫酷紫', value: ["#B37FEB", "#9254DE", "#722ED1", "#531DAB", "#391085", "#22075E", "#120338"] },
  { label: '新特性', value: ["#63b2ee", "#76da91", "#f8cb7f", "#f89588", "#7cd6cf", "#9192ab", "#7898e1", "#efa666", "#eddd86", "#9987ce", "#63b2ee", "#76da91"] },
  { label: '清新', value: ["#00a8e1", "#99cc00", "#e30039", "#fcd300", "#800080", "#00994e", "#ff6600", "#808000", "#db00c2", "#08080", "#0000ff", "#c8cc00"] },
  { label: '怀旧', value: ["#3b6291", "#943c39", "#779043", "#624c7c", "#388498", "#bf7334", "#3f6899", "#9c403d", "#7d9847", "#75083", "#3b8ba1", "#c97937"] },
  { label: '商务', value: ["#194f97", "#555555", "#bd6b08", "#00686b", "#c82d31", "#625ba1", "#898989", "#9c9800", "#007f54", "#195c5", "#103667", "#f19272"] },
  { label: '明亮', value: ["#0e72cc", "#6ca30f", "#f59311", "#fa4343", "#16afcc", "#85c021", "#d12a6a", "#0e72cc", "#6ca30f", "#59311", "#fa4343", "#16afcc"] },
  { label: '雅致', value: ["#3682be", "#45a776", "#f05326", "#eed777", "#334f65", "#b3974e", "#38cb7d", "#ddae33", "#844bb3", "#3c555", "#5f6694", "#df3881"] },
  { label: '柔和', value: ["#5b9bd5", "#ed7d31", "#70ad47", "#ffc000", "#4472c4", "#91d024", "#b235e6", "#02ae75"] },
  { label: '淡雅', value: ["#95a2ff", "#fa8080", "#ffc076", "#fae768", "#87e885", "#3cb9fc", "#73abf5"] },
  { label: '经典', value: ["#002c53", "#ffa510", "#0c84c6", "#ffbd66", "#f74d4d", "#2455a4", "#41b7ac"] },
  { label: '艳丽', value: ["#fa2c7b", "#ff38e0", "#ffa235", "#04c5f3", "#0066fe", "#8932a5", "#c90444"] },
  { label: '科技', value: ["#05f8d6", "#0082fc", "#fdd845", "#22ed7c", "#09b0d3", "#1d27c9", "#f9e264"] },
  { label: '炫彩', value: ["#e75840", "#a565ef", "#628cee", "#eb9358", "#d05c7c", "#bb60b2", "#433e7c"] },
  { label: '简洁', value: ["#929fff", "#9de0ff", "#ffa897", "#af87fe", "#7dc3fe", "#bb60b2", "#433e7c",] },
  { label: '冷色', value: ["#45c8dc", "#854cff", "#5f45ff", "#47aee3", "#d5d6d8", "#96d7f9", "#f9e264"] },
  { label: '暖色', value: ["#9489fa", "#f06464", "#f7af59", "#f0da49", "#71c16f", "#2aaaef", "#5690dd"] },
]
const BasicProperty = props => {
  const [fields, setFields] = useState([
    {
      name: 'title',
      text: '标题',
      default: props.property.title,
      editor: 'input',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      text: '简介',
      default: props.property.description,
      editor: 'text',
      type: 'text',
      required: true,
    },
    {
      name: 'width',
      text: '宽度',
      default: props.property.width,
      min: 0,
      max: 99999,
      editor: 'input',
      type: 'number',
      required: true,
    },
    {
      name: 'height',
      text: '高度',
      default: props.property.height,
      min: 0,
      max: 99999,
      editor: 'input',
      type: 'number',
      required: true,
    },
    {
      name: 'SSEServer',
      text: 'SSE地址',
      default: props.property.SSEServer,
      editor: 'input',
      type: 'text',
      required: true,
    },
    {
      name: 'waterMask',
      text: '水印名',
      default: props.property.waterMask || '',
      editor: 'input',
      type: 'text',
      required: true,
    },
    {
      name: 'blur',
      text: '背景图虚化度',
      default: props.property.blur || 0,
      editor: 'input',
      type: 'text',
      required: true,
    }, {
      name: 'zoomMode',
      text: '页面缩放方式',
      description: '页面缩放方式',
      default: {
        default: 'YOY',
        option: [
          { label: '同比缩放', value: 'YOY' },
          { label: '自适应缩放', value: 'adaptive' },
        ],
      },
      editor: 'select',
      type: 'select',
      required: false,
    }, {
      name: 'changeColor',
      text: '智能主题',
      default: {
        default: [],
        option: colorList
      },
      editor: 'collapse',
      type: 'collapse',
      helpUrl: 'https://www.yuque.com/docs/share/a329009c-4178-437b-b3e2-281f7971020f?# 《主题》',
      required: true,
    }, {
      name: 'autoBeautify',
      text: '一键美化',
      default: '',
      editor: 'autoBeautify',
      type: 'autoBeautify',
      required: true,
    },
    {
      name: 'background',
      text: '背景设置',
      default: props.property.background || '#0D1D31',
      editor: 'img',
      type: 'upload',
      required: false,
    },


    //  {
    //   name: 'autoLayout',
    //   text: '快速布局',
    //   default: false,
    //   editor: 'button',
    //   type: 'button',
    //   required: false,
    // },
  ]);
  const [customColor, setCustomColor] = useState(null)
  const [background, setBackground] = useState(props.property.background)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentIndexCustom, setCurrentIndexCustom] = useState(0)
  const [customImageUrl, setCustomImageUrl] = useState(null)
  const [autoLayoutVisible, setAutoLayoutVisible] = useState(false)
  const [backgroundVisible, setBackgroundVisible] = useState(false)
  const [selectBg, setSelectBg] = useState('internal');
  const [selectTheme, setSelectTheme] = useState('systemTheme');
  useEffect(() => {
    if (!props.property.changeColor) {
      props.property.changeColor = {
        default: '',
        option: colorList
      }
    }
    if (!props.property.zoomMode) {
      setTimeout(() => {
        props.onPropertyChange && props.onPropertyChange({
          path: 'zoomMode', value: {
            default: 'YOY',
            option: [
              { label: '同比缩放', value: 'YOY' },
              { label: '自适应缩放', value: 'adaptive' },
            ]
          }
        }, 'basic', 'update');
      }, 500) // 延迟500毫秒 防止防抖导致放弃更新
    }
  }, [])
  function getBase64 (img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  const onFiledChange = (e, item, type) => {
    // 限制范围
    if (type === 'switch' || type === 'array' || type === 'color' || type === 'number') {
      props.property[item.name] = e
    } else if (type === 'text') {
      props.property[item.name] = e.target.value;
    } else if (type === 'select' || type === 'collapse') {
      try {
        document.getElementById(e).style.border = `1px solid ${e[0]}`
        document.getElementById(`${e}p`).style.color = e[0]
      }
      catch (err) { }
      if (!props.property[item.name]) {
        props.property[item.name] = item.default
      }
      props.property[item.name].default = e;
    }
    // 基础页属性要进行回写
    if (item.name === 'changeColor') {
      props.onPropertyChange && props.onPropertyChange(props.property[item.name].default, props.property.type, 'changeColor');
    } else {
      props.onPropertyChange && props.onPropertyChange({ path: item.name, value: props.property[item.name] }, 'basic', 'update');
    }
    if (item.name === 'background') { // 背景图设置为颜色 让内置背景和自定义背景显示为null
      setBackground(props.property[item.name])
    }
    // setBasicProperty(basicProperty)
  };

  function beforeUpload (file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    return isJpgOrPng;
  }


  const deleteBackground = (e) => {
    // 删除背景图片
    props.onPropertyChange({ path: 'background', data: { value: null, id: null }, value: null }, 'basic', 'upload'); // 删除 vue页面图片
    setBackground(null)
    e.stopPropagation() // 阻止冒泡 防止弹出上传框
  }
  const rgb2hsl = (r, g, b) => {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b); const min = Math.min(r, g, b);
    let h; let s; const l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [Math.floor(h * 100), `${Math.round(s * 100)}%`, `${Math.round(l * 100)}%`];
  }
  const analysisColor = (imageUrl) => {
    const colorThief = new ColorThief();
    const img = document.createElement('img')
    img.src = imageUrl
    img.addEventListener('load', function () {
      const color = colorThief.getPalette(img);
      const colorList = []
      color.map(item => {
        const hsl = rgb2hsl(item[0], item[1], item[2])
        colorList.push({ hsl, color: `rgb(${item})` })
      })
      const tempColorList = []
      for (let i = 0; i < 3; i++) {
        const tempColor = {
          label: i == 0 ? '色相' : (i == 1 ? '饱和度' : '亮度'),
          value: []
        }
        colorList.sort((a, b) => {
          if (i === 1 || i === 2) {
            a.hsl[i] = a.hsl[i].split('%')[0]
            b.hsl[i] = b.hsl[i].split('%')[0]
          }
          return b.hsl[i] - a.hsl[i]
        })
        colorList.map(item => {
          tempColor.value.push(item.color)
        })
        tempColorList.push(tempColor)
      }
      setCustomColor(tempColorList)
    });
  }


  function buttonClick (name) {
    switch (name) {
      case 'autoLayout': setAutoLayoutVisible(true); break;
    }
  }
  function onChangeBg (e) {
    setSelectBg(e)
  }
  function onChangeTheme (e) {
    setSelectTheme(e)
  }
/**
	获取file，通过FileReader获取图片的 base64
*/ 
function customRequest(option,type) {
  const formData = new FormData();
  formData.append("files[]", option.file);
  const reader = new FileReader();
  reader.readAsDataURL(option.file);
  reader.onloadend = function(e) {
    console.log(e.target.result);// 打印图片的base64
    if (e && e.target && e.target.result) {
      option.onSuccess();
      if (type === 'customBackground') {
        setBackground(e.target.result);
        props.onPropertyChange({ path: 'background', data: { value: e.target.result, id: '1' }, value: e.target.result }, 'basic', 'upload');
      } else if (type === 'customThemeBackground') {
          analysisColor(e.target.result)
          setCustomImageUrl(e.target.result)
      }
    }
  };
}
  /**
   * 通过图片url 获取图片file对象
   * @param url
   * @param fileName 文件名称(一定要带后缀)
   * @param callback 回调函数
   * @returns {*}
   */
  function getImageFileFromUrl (url, fileName, callback) {
    let blob = null;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Accept', 'image/jpeg');
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.status == 200) {
        blob = xhr.response;
        const imgFile = new File([blob], fileName, { type: 'image/jpeg' });
        callback.call(this, imgFile);
      }
    };
    xhr.send();
  }

  const uploadBackground = (e, type) => {
    // 上传自定义背景图
    const successCallback = () => {
      if (type === 'customBackground') {
        const resultUrl = e.file.response.data.extend.background
        setBackground(resultUrl);
        props.onPropertyChange({ path: 'background', data: { value: e.file.response.data.extend.background, id: e.file.response.data.backgroundId }, value: resultUrl }, 'basic', 'upload');
      } else if (type === 'customThemeBackground') {
        getBase64(e.file.originFileObj, imageUrl =>{
           analysisColor(imageUrl)
           setCustomImageUrl(imageUrl)
          }
        );
      }
    }
    inputUploadImg(e, props.setSpinning, props.setSpinText, type === 'customBackground' ? '正在上传背景图' : '正在上传图片',
      successCallback,
      () => { message.error('上传失败') })
  };
  function submitBackground (url) {
    // 上传内置内置背景图
    props.setSpinning(true)
    props.setSpinText('正在上传背景图')
    getImageFileFromUrl(url, 'backgroundImg.png', async (file) => {
      // const { data } = await uploadImg(form)
      // if (data) {
      //   setBackground(url)
      // }
      props.onPropertyChange({ path: 'background', data: { value: url, id: '123' }, value: url }, 'basic', 'upload');
      setBackground(url)
      props.setSpinning(false)

    })
    // 将背景图上传到服务器中
  }
  function openBackgroundModal () {
    setBackgroundVisible(true)
  }
  function closeBackgroundModal () {
    setBackgroundVisible(false)
  }
  function closeAutoLayout () {
    setAutoLayoutVisible(false)
  }
  // 处理字段
  function formatEditor () {
    return fields.map(item => {
      // 渲染的组件
      let component = null;
      let value = props.property[item.name]; // 防止用户手动清空造成数据变成默认
      if (value == undefined || value === '{}') {
        value = item.default;
      }
      // const value = props.property[item.name] || data[item.name] || item.default;

      switch (`${item.editor}-${item.type}`) {
        case 'input-text':
          component = <Input prefix={`${item.text}：`} value={value} onChange={e => onFiledChange(e, item, 'text')} />;
          break;
        case 'input-number':
          component = (
            <div className="prefix">
              <span className="ant-input-prefix">{item.text}：</span>
              <InputNumber value={value} onChange={e => onFiledChange(e, item, 'number')} />
            </div>);
          break;
        case 'text-text':
          component = (
            <Input.TextArea
              rows={item.row || 4}
              value={value}
              onChange={e => onFiledChange(e, item, 'text')}
            />
          );
          break;
        case 'button-button':
          component = <Button size="large" type="primary" onClick={() => buttonClick(item.name)}>{item.text}</Button>;
          break;
        case 'img-upload':
          component = (
            <Collapse ghost bordered={false} expandIconPosition="right" defaultActiveKey={['1']}>
              <Panel header={item.text} key="1">
                <Tabs defaultActiveKey={selectBg} onChange={onChangeBg}>
                  <TabPane tab="内置背景" key="internal" className="box">
                    <Image preview={false} src={(background && background.substring(0, 1) !== '#') ? background : require('@/assets/common/imgError.png')} />
                    <div className="box2" onClick={openBackgroundModal}>
                      <h3>点击选择内置背景图</h3>
                      <p onClick={e => deleteBackground(e)}>删除背景图</p>
                    </div>
                    {backgroundVisible && (<InternalBackground submitBackground={submitBackground} closeBackgroundModal={closeBackgroundModal} />)}
                  </TabPane>
                  <TabPane tab="自定义背景" key="custom">
                    <Dragger
                      name="file"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      withCredentials
                      customRequest={(e)=>customRequest(e,'customBackground')}
                      beforeUpload={beforeUpload}
                    
                    >

                      {background && background.substring(0, 1) !== '#' ? (<div className="box">
                        <Image preview={false} src={background && background.substring() || 'error'} fallback={require('@/assets/common/imgError.png')} />
                        <div className="box2">
                          <h3>点击重新上传自定义背景图</h3>
                          <p onClick={deleteBackground}>删除背景图</p>
                        </div>
                      </div>) : (<div>
                        <PlusOutlined style={{ color: 'rgba(80, 98, 116, 1)' }} />
                        <p className="ant-upload-text">点击或拖拽上传背景图</p>
                      </div>)}
                    </Dragger>
                  </TabPane>
                  <TabPane tab="纯色背景" key="color" >
                    <div className="color-property basic-color-property">
                      <span>{item.text}</span>
                      <ColorPicker style={{ width: '30%' }} onFiledChange={onFiledChange} item={item} />
                    </div>
                  </TabPane>

                </Tabs>

              </Panel>
            </Collapse>
          );
          break;
        case 'collapse-collapse':
          component = (
            <Collapse ghost bordered={false} expandIconPosition="right">
              <Panel header={
                <div className="collapse-header-help">
                  <span>{item.text}</span>
                  {item.helpUrl && (<a href={item.helpUrl} target="_blank">
                    <QuestionCircleOutlined />
                  </a>)}
                </div>
              } key="1">
                <Tabs defaultActiveKey={selectTheme} centered onChange={onChangeTheme}>
                  <TabPane tab="系统主题" key="systemTheme" >
                    {value.option.map((option, index) => {
                      return (
                        <div className="colorList" key={option.value} onClick={() => onFiledChange(option.value, item, 'collapse', setCurrentIndex(index))}>
                          <ul id={option.value} className={index !== currentIndex ? 'notActive' : null}>
                            <li id={`${option.value}p`} className={index !== currentIndex ? 'notActive' : null}>{option.label}</li>
                            {option.value.map((item, ind) => {
                              return (ind < 7 && (<li key={item} style={{ backgroundColor: item, width: '30px', height: '30px' }} />))
                            })}
                          </ul>

                        </div>
                      );
                    })}
                  </TabPane>
                  <TabPane tab="自定义主题" key="customTheme" >
                  <Dragger
                      name="file"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      withCredentials
                      customRequest={(e)=>customRequest(e,'customThemeBackground')}
                      beforeUpload={beforeUpload}
                    
                    >
                      <div>
                        {customImageUrl ? <Image preview={false} src={customImageUrl || 'error'} fallback={require('@/assets/common/imgError.png')} /> : (<div>
                          <PlusOutlined style={{ color: 'rgba(80, 98, 116, 1)' }} />
                          <p className="ant-upload-text">点击或拖拽上传风格图</p>
                        </div>)}
                      </div>
                    </Dragger>
                    {customColor && customColor.map((colorList, index) => {
                      return (
                        <div className="colorList" key={colorList.value} onClick={() => onFiledChange(colorList.value, item, 'collapse', setCurrentIndexCustom(index))}>
                          <ul id={colorList.value} className={index !== currentIndexCustom ? 'notActive' : null}>
                            <li id={`${colorList.value}p`} className={index !== currentIndexCustom ? 'notActive' : null}>{colorList.label}</li>
                            {colorList.value && colorList.value.map((item, ind) => {
                              return (ind < 7 && (<li key={item} style={{ backgroundColor: item, width: '30px', height: '30px' }} />))
                            })}
                          </ul>
                        </div>
                      )
                    })
                    }
                  </TabPane>
                </Tabs>

              </Panel>
            </Collapse >
          ); break;
        case 'autoBeautify-autoBeautify': {
          component = (
            <AutoBeautify onPropertyChange={props.onPropertyChange} data={props.property?.autoBeautify} />
          )
        }; break;
        case 'input-color': {
          component = (
            <ColorPicker onFiledChange={onFiledChange} item={item} />
          )
        }; break;
        case 'select-select':
          component = (
            <div className="prefix">
              <span className="ant-input-prefix">{item.text}</span>
              <Select
                style={{ width: '100%' }}
                defaultValue={value.default}
                optionLabelProp="label"
                onChange={e => onFiledChange(e, item, 'select')}
              >
                {value.option.map(option => {
                  return (
                    <Option key={option.label} value={option.value} label={option.label}>
                      {option.label}
                    </Option>
                  );
                })}
              </Select>
            </div>)
          break;
      }
      return { ...item, component };
    });
  }
  return (
    <div className="basic-property" id="basic-property">
      {formatEditor().map(item => {
        return (
          <div key={item.name} className="property-item" style={{ width: item.type === 'number' ? '45%' : '100%', marginRight: '5%' }}>
            {/* <div className="title">{item.text}</div> */}
            <div className="editor">{item.component}</div>
          </div>
        );
      })}
      {autoLayoutVisible && (<AutoLayout layer={props.layer} onChangeSingle={props.onChangeSingle} closeAutoLayout={closeAutoLayout} />)}
    </div >
  );
};

export default BasicProperty;
