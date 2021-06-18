import {
  Input,
  InputNumber,
  Button,
  Tabs,
  Switch,
  Select,
  message,
  Collapse,
  Upload,
  Image
} from 'antd';
import { PlusOutlined, UploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { objectUrlEval, inputUploadImg } from '@/utils/utils'
import XLSX from 'xlsx';
import JsonModal from './JsonModal.tsx';
import Debugger from './Debugger.jsx';
import ColorPicker from './ColorPicker.tsx';
import menuConfig from './menuConfig.js';
import Interactive from './Interactive.jsx';
import InputShare from './InputShare.jsx';
import AddGLTFModal from './AddGLTFModal.tsx';
import { fixdescription, fixType, fixEditor } from './translate.js';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/ayu-dark.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/selection/active-line';

const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;
const { Dragger } = Upload;

const ChartProperty = props => {
  const [fields, setFields] = useState(JSON.parse(JSON.stringify(menuConfig)));
  const [currentTab, setCurrentTab] = useState(`${props.property.elementId}baseConfig`);
  const [isShowJsonModal, setIsShowJsonModal] = useState(false);
  const [isShowDebugger, setIsShowDebugger] = useState(false);
  const [jsonData, setJsonData] = useState({});
  const [nowDataBindType, setNowDataBindType] = useState(props.property.dataBindType.default)
  const [isOpenAdvanced, setIsOpenAdvanced] = useState(props.property.isOpenAdvanced) // echarts 简易配置
  const [mapVisible, setMapVisible] = useState(false); // 增加模型modal

  let tempFields = JSON.parse(JSON.stringify(menuConfig))

  const onFiledChange = (e, item, type) => {
    if (type === 'switch' || type === 'array' || type === 'color') {
      objectUrlEval(props.property, item.name, true, e)
    } else if (type === 'text') {
      objectUrlEval(props.property, item.name, true, e.target.value)
    }
    else if (type === 'select' || type === 'collapse') {
      objectUrlEval(props.property, `${item.name}.default`, true, e)
      if (item.name === 'dataBindType') {
        setNowDataBindType(e) // 改变绑定方式
        setTimeout(() => {
          changeDataBindType() // 延时6秒 因为 updateTemplate进行防抖5s 
        }, 600);
      }
    } else if (type === 'number') {
      if (isNaN(e)) {
        objectUrlEval(props.property, item.name, true, 0)
      }
      objectUrlEval(props.property, item.name, true, e)
    }
    props.onPropertyChange({ path: item.name, value: objectUrlEval(props.property, item.name, false) }, item.type, 'update');
  };
  const onOpenAdvanced = (e) => {
    setIsOpenAdvanced(e)
    props.onPropertyChange({ path: 'isOpenAdvanced', value: e }, props.property.type, 'update');
  }
  const deleteBackground = (e) => {
    // 删除背景图片
    props.onPropertyChange({ path: 'background', data: { value: null, id: null } }, props.property.type, 'upload');
    // setBackground(null)
    e.stopPropagation() // 阻止冒泡 防止弹出上传框
  }

  const downLoadExcel = () => {
    try {
      const { type, componentsType } = props.property
      if (componentsType === 'charts') {
        window.open(require(`@/assets/excel/charts.xlsx`))
      } else {
        window.open(require(`@/assets/excel/${type}.xlsx`))
      }
    } catch (err) {
      message.error('暂无可下载的excel!');
    }
  }
  const uploadExcel = e => {
    const { files } = e.target
    // 获取文件名称
    const { name } = files[0]
    const { componentsType, type, secondType } = props.property
    const is3dCity = secondType === 'city'
    // 获取文件后缀
    const suffix = name.substr(name.lastIndexOf("."));

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // 判断文件类型是否正确
        if (suffix != ".xls" && suffix != ".xlsx") {
          message.error("选择Excel格式的文件导入！");
          return false;
        }
        const { result } = event.target
        // 读取文件
        const workbook = XLSX.read(result, { type: 'binary' });
        let data = []
        // 循环文件中的每个表
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 将获取到表中的数据转化为json格式
            if (is3dCity) {
              data = data.concat(XLSX.utils.sheet_to_csv(workbook.Sheets[sheet]));
            } else {
              data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));

            }
          }
        }
        let optionData = null
        if (props.property.componentsType === 'charts') {
          optionData = [{ data }]
        } else if (is3dCity) {
          optionData = data[0]
        } else {
          optionData = data
        }
        props.onPropertyChange({ path: 'option.data', value: optionData, type: 'excel' }, props.property.type, 'update');


      } catch (e) {
        message.error('文件类型不正确！');
      }

    }
    reader.readAsBinaryString(files[0]);
  }
  function customRequest(option) {
    const formData = new FormData();
    formData.append("files[]", option.file);
    const reader = new FileReader();
    reader.readAsDataURL(option.file);
    reader.onloadend = function(e) {
      console.log(e.target.result);// 打印图片的base64
      props.onPropertyChange({ path: 'background', data: { value: e.target.result, id:e.target.result} }, props.property.type, 'upload') 
    };
  }
  // const uploadCustomBackground = e => {
  //   inputUploadImg(e, props.setSpinning, props.setSpinText, '正在上传背景图',
  //     () => { props.onPropertyChange({ path: 'background', data: { value: e.file.response.data.url, id: e.file.response.data.id } }, props.property.type, 'upload') },
  //     () => { message.error(e.file.response.msg) })
  // }
  async function buttonClick (name) {
    switch (name) {
      case 'debug':
        setIsShowDebugger(true)
        break;
      case 'addModal':
        showModal()
      default:
        break;
    }
  }
  function isHaveField (fieldName) {
    // 判断fieldsData中是否有fieldName的值
    return tempFields[1].opts.findIndex(item => {
      return item.name === fieldName;
    });
  }
  function changeFileds (key, value) {
    // 先把不需要的过滤掉
    // if (!filterData(key)) {
    // 修改fields函数, 根据key 去修改指定的value 如果存在此key则修改 不存在 新增
    const currentIndex = isHaveField(`option.${key}`);
    if (currentIndex == undefined || currentIndex == -1) {
      tempFields[1].opts.push({
        name: `option.${key}`,
        default:
          Object.prototype.toString.call(value) === '[object Array]'
            ? JSON.stringify(value, null, '\t')
            : value,
        type: fixType(key, value),
        text: fixdescription(key),
        description: fixdescription(key),
        editor: fixEditor(key, value),
      });
    } else {
      tempFields[1].opts[currentIndex].default =
        Object.prototype.toString.call(value) === '[object Array]'
          ? JSON.stringify(value, null, '\t')
          : value;
    }
    // }
  }
  function directReturn (key) {
    // 如果是以下key 直接返回不再进行遍历
    const listKey = key.split('.');
    if (
      (listKey.length === 3 && listKey[2] === 'data') ||
      listKey[2] === 'links' ||
      (listKey[0] === 'radar' && listKey[2] === 'indicator')
    ) {
      return true;
    }
    if (key.substring(0, 6) === 'select') { // select开头的直接输出
      return true
    }
    const filterKey = ['series.data', 'radar.indicator', 'series.links',];
    return filterKey.includes(key);
  }
  function getEchartsAllProperty (option, preKey = '') {
    // 获取图表所有属性
    // 调用此函数根据图标的option自动生成fileds中的样式配置列表,避免每个图表重复编写
    // 此函数需要搭配fixdescription,fixType,fixEditor等函数使用,根据统一配置参数生成指定的类型
    if (option == null) {
      return;
    }
    const keyValue = Object.entries(option).sort()
    for (const [key, value] of keyValue) {
      const tempKey = preKey ? `${preKey}.${key}` : key;
      if (directReturn(tempKey)) {
        //  直接进行渲染不再单独循环出每一项
        changeFileds(tempKey, value);
      } else if (Object.prototype.toString.call(value) == '[object Object]') {
        if (preKey !== '') {
          key = `${preKey}.${key}`;
        }
        getEchartsAllProperty(value, key);
      } else if (Object.prototype.toString.call(value) == '[object Array]') {
        const firstArray = value[0];
        if (preKey !== '') {
          key = `${preKey}.${key}`;
        }
        key === 'series' ? getEchartsAllProperty(value, key) : changeFileds(key, value) // series 特殊处理 继续递归
      } else {
        if (preKey !== '') {
          key = `${preKey}.${key}`;
        }
        changeFileds(key, value);
      }
    }
  }
  function notGgroupKey (key) {
    // 不划分到折叠面板的key,统一放在基础配置中
    switch (key) {
      case 'title': return true; break;
      case 'background': return true; break;
      case 'color': return true; break;
      case 'backgroundColor': return true; break;
      case 'animationEasingUpdate': return true; break;
      case 'calculable': return true; break;
      default: return false;
    }
  }
  function notChartsGroup () {
    // 非charts组件 对颜色,字号进行分类
    tempFields[1].option = {};
    tempFields[1].opts.map(item => {
      if (item.name.substring(item.name.length - 5).toLowerCase() === 'color') {
        // 颜色类
        if (!tempFields[1].option['颜色']) {
          tempFields[1].option['颜色'] = [];
        }
        tempFields[1].option['颜色'].push(item);
      } else if (item.name.substring(item.name.length - 8).toLowerCase() === 'fontsize') {
        if (!tempFields[1].option['字号']) {
          tempFields[1].option['字号'] = [];
        }
        tempFields[1].option['字号'].push(item);
      } else if (item.name !== 'option.data') {
        if (!tempFields[1].option['其它']) {
          tempFields[1].option['其它'] = [];
        }
        tempFields[1].option['其它'].push(item);
      }
    });
  }

  function dataGroup () {
    // 对fileds数据进行分组 适配折叠面板
    tempFields[1].option = {};
    tempFields[1].opts.map(item => {
      const key = item.name.split('.')[1];
      if (!notGgroupKey(key)) {
        if (!tempFields[1].option[key]) {
          tempFields[1].option[key] = [];
        }
        tempFields[1].option[key].push(item);
      } else {
        if (!tempFields[1].option['基础配置']) {
          tempFields[1].option['基础配置'] = [];
        }
        tempFields[1].option['基础配置'].push(item);
      }
    });
  }
  function getNotEchartAllProperty (option) {
    // 非echart组件组装菜单属性
    if (option != null) {
      const keyValue = Object.entries(option).sort()
      for (const [key, value] of keyValue) {
        changeFileds(key, value);
      }
    }
  }
  function changeDataBindType () {
    // 改变数据绑定方式
    const dataBindType = props.property.dataBindType && props.property.dataBindType.default
    if (dataBindType === 'json') {
      // 选择了静态json 初始化数据为默认数据
      const index = fields[2].opts.findIndex((item) => {
        return item.name == 'staticJson'
      })
      const dataIndex = fields[1].opts.findIndex((item) => {
        return item.name == 'option.data'
      })
      let defaultData = null
      let editor = null
      let type = null
      if (index !== -1) {
        if (dataIndex !== -1) {
          editor = fields[1].opts[dataIndex].editor
          type = fields[1].opts[dataIndex].type
          defaultData = JSON.parse(fields[1].opts[dataIndex].default)
        }
        // fields[2].opts[index].default = null
        fields[2].opts[index].editor = editor
        fields[2].opts[index].type = type
        fields[2].opts[index].default = defaultData
        props.onPropertyChange({ path: 'option.data', value: defaultData }, props.property.type, 'update') // 将数据重置为默认数据

      }
    }
    else {
      const responseDataIndex = fields[1].opts.findIndex((item) => {
        return item.name == 'option.responseData'
      })
      const paramsIndex = fields[1].opts.findIndex((item) => {
        return item.name == 'option.params'
      })
      responseDataIndex !== -1 && (fields[2].opts[responseDataIndex].default = props.property.responseData || {});
      paramsIndex !== -1 && (fields[2].opts[paramsIndex].default = props.property.params || {});
    }
  }
  useEffect(() => {
    tempFields = JSON.parse(JSON.stringify(menuConfig))
    // 避免切换组件 导致接口配置页数据还是上一个组件的数据
    if (props.property.componentsType === 'charts' || props.property.componentsType === 'L7') {
      // 图表的属性获取
      getEchartsAllProperty(props.property.option);
      dataGroup();
    } else {
      // 非图表属性获取
      getNotEchartAllProperty(props.property.option);
      notChartsGroup()
    }
    if (props.property.option.data === undefined) {
      // 没有data属性 则去掉数据配置
      delete tempFields[2]
    }

    setFields(tempFields);
    setIsOpenAdvanced(props.property.isOpenAdvanced) // 切换组件 要替换为最新组件的属性
    // setNowProperty(props.property) // 切换组件 要替换为最新组件的属性
    setNowDataBindType(props.property.dataBindType.default)

  }, [props.property.elementId]); // 根据id 不同改变
  function tabsOnChange (e) {
    if (e.substr(-10) === 'dataConfig') {
      // 改变staticJson
      const dataDefault = props.property.option.data
      const index = fields[2].opts.findIndex((item) => {
        return item.name == 'staticJson'
      })
      index !== -1 && (fields[2].opts[index].default = dataDefault)
      props.property.staticJson = null // 不置为空会使用上一个的旧数据


    }
    setFields(fields)
    setCurrentTab(e);
  }
  function showJsonEdit (e, item) {
    let value = objectUrlEval(props.property, item.name, false); // 防止用户手动清空造成数据变成默认
    if (value == undefined) {
      value = item.default;
    }
    item.default = value;
    Object.prototype.toString.call(item.default) === '[object Array]' ||
      Object.prototype.toString.call(item.default) === '[object Object]'
      ? (item.default = JSON.stringify(item.default, null, '\t'))
      : item.default;
    setJsonData(item);
    setIsShowJsonModal(true);
  }
  function closeModal () {
    setIsShowJsonModal(false);
  }
  function closeDebugger () {
    setIsShowDebugger(false);
  }
  function openCodeMode () {
    // 打开代码模式
    const tempProperty = JSON.parse(JSON.stringify(props.property.option))
    const optionData = JSON.parse(JSON.stringify(tempProperty.data)) // 备份data
    delete tempProperty.data
    const editData = {
      text: '图表代码',
      type: 'codeMode',
      data: optionData,
      default: JSON.stringify(tempProperty, null, '\t')
    }
    setJsonData(editData)
    setIsShowJsonModal(true);
  }
  function submitJson (item) {
    if (item.type === 'codeMode') {
      // 代码模式编辑完成之后的结果
      const result = JSON.parse(item.default)
      result.data = item.data
      props.onPropertyChange({ path: 'option', value: result }, props.property.type, 'update');

    } else {
      let data = null
      try {
        data = JSON.parse(item.default)
      } catch {
        data = item.default
      }
      if (item.name === 'staticJson') {
        const dataIndex = fields[1].opts.findIndex((p) => {
          return p.name == 'option.data'
        })
        const staticJsonIndex = fields[2].opts.findIndex((p) => {
          return p.name == 'staticJson'
        })
        staticJsonIndex !== -1 && (fields[2].opts[staticJsonIndex].default = data)
        const dataItem = fields[1].opts[dataIndex]
        props.property.staticJson = data// 替换staticJson的值
        onFiledChange(data, dataItem, dataItem.type);
      } else {
        onFiledChange(data, item, item.type);
      }

    }

  }
  // 处理字段
  function formatEditor (opts) {
    // 渲染的组件
    // props.property.staticJson = props.property.option.data || props.property.option.series
    return opts.map(item => {
      let component = null;
      // let value = props.property[item.name]; // 防止用户手动清空造成数据变成默认

      let value = objectUrlEval(props.property, item.name, false) // 防止用户手动清空造成数据变成默认
      if (value == undefined || value === '{}') {
        value = item.default;
      }
      if (item.name === 'dataOrigin') {
        value.option = props.dataOrigin // 因为数据是从接口中获取的 因此这里单独设置
      }
      const staticType = Object.prototype.toString.call(value)
      if (item.name === 'staticJson' && staticType !== '[object Array]' && staticType !== '[object Object]') {
        // 静态json 不是数组或对象
        if (staticType === '[object String]') {
          try {
            const tempValue = JSON.parse(value) // 可以格式化不改变
            if (Object.prototype.toString.call(tempValue) === '[object Number]') { // 因为number 可以格式化 要变
              item.type = 'text'
            }
          } catch (err) {
            item.type = 'text'
          }
        }
      }
      if (item.type !== 'select' && item.type !== 'selectMult') {
        // select数据不需要格式化
        Object.prototype.toString.call(value) === '[object Array]' ||
          Object.prototype.toString.call(value) === '[object Object]'
          ? (value = JSON.stringify(value, null, '\t'))
          : value; // 如果是Array格式化
      }
      switch (`${item.editor}-${item.type}`) {
        case 'input-text':
          component = <Input prefix={`${item.text}：`} value={String(value).substring(0, 100)} onChange={e => onFiledChange(e, item, 'text')} />;
          break;
        case 'input-number':
          component = (<div className="prefix">
            <span className="ant-input-prefix">{item.text}：</span>
            <InputNumber value={value} onChange={e => onFiledChange(e, item, 'number')} />
          </div>);
          break;
        case 'input-array':
          component = (
            <div onClick={e => showJsonEdit(e, item)} style={{ cursor: 'pointer' }}>
              <div className="json-title">{item.text}</div>
              <CodeMirror
                value={value && String(value).substring(0, 200)}
                onChange={e => { e => onFiledChange(e, item, 'array') }}
                options={{
                  theme: 'ayu-dark',
                  smartIndent: true,  // 是否智能缩进
                  keyMap: 'sublime',
                  lineNumbers: true,
                  mode: 'JavaScript',
                  lineWrapping: true,
                  // readOnly: true,
                  foldGutter: true,
                  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                }}
              />
            </div>
          );
          break;
        case 'text-text':
          component = (
            <Input.TextArea
              prefix={`${item.text}：`}
              rows={item.row || 4}
              value={value}
              onChange={e => onFiledChange(e, item, 'text')}
            />
          );
          break;
        case 'switch-switch':
          component = (
            <div className="switch-div">
              <span>{item.text}</span>
              <Switch
                defaultChecked={value}
                rows={item.row || 4}
                onChange={e => onFiledChange(e, item, 'switch')}
              />
            </div>

          );
          break;
        case 'button-button':
          component = <Button type="primary" onClick={e => buttonClick(item.name)} style={{ width: '40%' }}>{item.text}</Button>;
          break;
        case 'img-upload':
          component = (
            <Collapse ghost bordered={false} expandIconPosition="right" defaultActiveKey={['1']}>
              <Panel header={item.text} key="1">
                <Dragger
                  style={{ width: '100%' }}
                  name="file"
                  withCredentials
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  customRequest={customRequest}
                >
                  <div>
                    {value ? (<div className="box">
                      <Image preview={false} src={value || 'error'} fallback={require('@/assets/common/imgError.png')} />
                      <div className="box2">
                        <h3>点击重新上传背景图</h3>
                        <p onClick={deleteBackground}>删除背景图</p>
                      </div>
                    </div>) : (<div>
                      <PlusOutlined style={{ color: 'rgba(80, 98, 116, 1)' }} />
                      <p className="ant-upload-text">点击或拖拽上传背景图</p>
                    </div>)}
                  </div>
                </Dragger>
              </Panel>
            </Collapse>
          );
          break;
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
                {value.option && value.option.map(option => {
                  return (
                    <Option key={option.value} value={option.value} label={option.label} >
                      {option.label}
                    </Option>
                  );
                })}
              </Select>
            </div>
          );
          break;
        case 'select-selectMult':
          component = (
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              defaultValue={value.default}
              optionLabelProp="label"
              onChange={e => onFiledChange(e, item, 'selectMult')}
            >
              {value.option.map(option => {
                return (
                  <Option key={option.value} value={option.value} label={option.label} >
                    {option.label}
                  </Option>
                );
              })}
            </Select>
          );
          break;
        case 'input-color': {
          component = (
            // <Collapse ghost bordered={false} expandIconPosition="right" defaultActiveKey={['1']}>
            //   <Panel header="颜色" key="1">
            <div className="color-property">
              <span>{item.text}</span>
              <ColorPicker style={{ width: '30%' }} onFiledChange={onFiledChange} item={item} />
            </div>
            //   </Panel>
            // </Collapse>
          )
        }; break;
        case 'interactive-interactive': {
          component = (
            <Interactive item={item} layer={props.layer} onPropertyChange={props.onPropertyChange} property={props.property} linkKeyMatchStatus={props.linkKeyMatchStatus} />
          )
        }; break;
        case 'excel-upload': {
          component = (
            <div className="excel-upload">
              <a href="JavaScript:;" className="excel-upload-file">
                <input type="file" onChange={uploadExcel} /><UploadOutlined />
                <span>点击上传Excel文件</span>
              </a>
              <span className="download" onClick={downLoadExcel}>下载示例excel</span>
              <a href="https://www.yuque.com/docs/share/62b9efd4-2af1-4738-aa99-14128e429188?# 《3D城市组件介绍》" target="_blank">
                <QuestionCircleOutlined />
              </a>
            </div>
          )
        }; break;
        case 'input-share': {
          component = (
            !props.property.shareApiId && (
              <InputShare item={item} layer={props.layer} onPropertyChange={props.onPropertyChange} property={props.property} />)
          )
        }
      }
      return { ...item, component };
    });
  }
  function renderPanel (file) {
    // echarts 高级折叠面板式配置
    if (file && file.option) {
      const key = Object.keys(file.option)
      key.sort((a, b) => a === '基础配置' ? -1 : 0) // 让基础配置置顶
      return key.map(key => {
        if (key === 'data' || key === 'staticJson') return // 不显示series属性
        return (
          <Panel header={fixdescription(key)} key={key} >
            {formatEditor(file.option[key]).map(item => {
              return (
                <div key={item.name} className="property-item" style={{ width: item.type === 'number' ? '100%' : '100%' }}>
                  {/* <div className="title">{item.text}</div> */}
                  <div className="editor">{item.component}</div>
                </div>
              );
            })}
          </Panel>
        );
      });
    }
  }
  function initSimpleFile (file) {
    const tempFile = JSON.parse(JSON.stringify(file))
    const simpleList = ['option.color', 'option.legend.show', 'dataZoom.', 'option.xAxis.show', 'option.yAxis.show', 'option.series.label.emphasis.show', 'option.series.gridSize',
      'option.series.barWidth', 'option.series.label.normal.show', 'option.series.smooth', 'option.series.smooth', 'option.series.type', 'option.geoJSON']
    return tempFile.filter(item => {
      const name = item.name.split('.')
      if (name[1] === 'series') {
        name.splice(2, 1)
      }
      return simpleList.includes(name.join('.'))
    })
  }

  function onChangeSeries (e) {
    // series tabs改变
    props.property.option.nowSeriesIndex = e
    props.onPropertyChange({ path: 'option.nowSeriesIndex', value: e }, props.property.type, 'update')
  }
  function onEditSeries (targetKey, action) {
    if (action === 'add') {
      const willAddData = JSON.parse(JSON.stringify(props.property.option.data[0]))
      willAddData.name = `随机series${props.property.option.data.length}`
      willAddData.data.map(item => {
        item.value = Math.ceil(item.value * Math.random())
      })
      props.property.option.data.push(willAddData)
    } else {
      props.property.option.data.splice(targetKey, 1)
    }
    getEchartsAllProperty(props.property.option)
    props.onPropertyChange({ path: 'option.data', value: props.property.option.data }, props.property.type, 'update')
  }

  async function showModal () {
    // 为地图注册click事件获取鼠标点击出的经纬度坐标
    setMapVisible(true)
  };


  function handleCancelMap () {
    setMapVisible(false)
  };

  function renderSimple (file) {
    // 简易版配置
    const simpleFile = initSimpleFile(file.opts) // 初始化简易配置file
    return (<React.Fragment>
      {formatEditor(simpleFile).map(item => {
        if (item.name.split('.')[1] !== 'series') {
          return (
            <div key={item.name} className="property-item" style={{ width: item.type === 'number' ? '45%' : '100%' }}>
              <div className="editor">{item.component}</div>
            </div>
          );
        }
      })
      }
      <Tabs defaultActiveKey="0" type="editable-card" onChange={e => { onChangeSeries(e) }} onEdit={onEditSeries}>
        {props.property.option.data.map((singleSeries, seriesIndex) => {
          return (
            <TabPane key={seriesIndex} tab={`series系列${seriesIndex}`} closable={seriesIndex !== 0} >
              {formatEditor(simpleFile).map(item => {
                if (item.name.split('.')[1] === 'series' && item.name.split('.')[2] == seriesIndex) {
                  return (
                    <div key={item.name} className="property-item" style={{ width: item.type === 'number' ? '45%' : '100%' }}>
                      <div className="editor">{item.component}</div>
                    </div>
                  )
                }
              })}
            </TabPane>
          )
        })}
      </Tabs>
    </React.Fragment>)

  }
  function renderDataConfig (file) {
    if (file && file.opts) {
      return formatEditor(file.opts).map(item => {
        if (item.component && item.upType.includes(nowDataBindType)) {
          return (
            <div key={item.name} className="property-item">
              <div className="editor">{item.component}</div>
            </div>
          )
        }
      })
    }
  }
  function renderMenu (file) {
    // 根据echarts图表或非图表渲染不同的menu
    switch (file.name) {
      case 'baseConfig': {
        return formatEditor(file.opts).map(item => {
          if (item.name === 'option.data') return // 组件不显示data
          return (
            <div key={item.name} className="property-item" style={{ width: item.type === 'number' ? '45%' : '100%' }}>
              {/* <div className="title">{item.text}</div> */}
              <div className="editor">{item.component}</div>
            </div>
          );
        });
      }; break;
      case 'styleConfig': {
        if (props.property.componentsType === 'charts' && isOpenAdvanced) {
          return (<Collapse defaultActiveKey="基础配置" bordered={false} expandIconPosition="right" className="style-collapse">
            {renderPanel(file)}
            <div key="isOpenAdvanced" className="property-item" style={{ width: '100%' }}>
              <div className="editor">
                <div className="switch-div">
                  <span>是否开启高级配置</span>
                  <Switch
                    defaultChecked={isOpenAdvanced}
                    rows={4}
                    onChange={e => onOpenAdvanced(e)}
                  />
                </div>
              </div>
            </div>
            <div key="codeMode" className="property-item" style={{ width: '100%' }}>
              <div className="editor">
                <p className="codeMode" onClick={openCodeMode}>打开代码模式</p>
              </div>
            </div>
          </Collapse>)
        }
        if (props.property.componentsType === 'charts' && !isOpenAdvanced) {
          return (
            <div style={{ width: '100%' }}>
              {renderSimple(file)}
              <div key="isOpenAdvanced" className="property-item" style={{ width: '100%' }}>
                <div className="editor">
                  <div className="switch-div">
                    <span>是否开启高级配置</span>
                    <Switch
                      defaultChecked={isOpenAdvanced}
                      rows={4}
                      onChange={e => onOpenAdvanced(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        }
        return (
          <Collapse defaultActiveKey="基础配置" bordered={false} expandIconPosition="right" className="style-collapse">
            {renderPanel(file)}
          </Collapse>
        )


      }; break;
      case 'dataConfig': {
        return renderDataConfig(file)
      }; break;
      case 'mapLayer': {
        if (file.bindType.includes(props.property.type)) {
          return formatEditor(file.opts).map(item => {
            return (
              <div key={item.name} className="property-item" style={{ width: item.type === 'number' ? '45%' : '100%' }}>
                {/* <div className="title">{item.text}</div> */}
                <div className="editor">{item.component}</div>
              </div>
            );
          });
        }
        return null;
      }; break;
      case 'interactiveConfig': {
        if (props.property.componentsType === 'pagination') {
          return formatEditor(file.opts).map(item => {
            return (
              <div key={item.name} className="property-item" style={{ width: item.type === 'number' ? '45%' : '100%' }}>
                {/* <div className="title">{item.text}</div> */}
                <div className="editor">{item.component}</div>
              </div>
            );
          });
        }
        return null;

      }; break;
    }



  }
  return (
    <div className="basic-property">
      <Tabs defaultActiveKey={currentTab} key={props.property.elementId} onChange={e => tabsOnChange(e)} type="card" >
        {fields.map(file => {
          if (file.opts.length > 0) {
            if (file.name === 'interactiveConfig' && props.property.componentsType !== 'pagination') return;
            if (file.name === 'mapLayer' && !file.bindType.includes(props.property.type)) return;
            return (
              <TabPane tab={
                <div className="tabs-header-help">
                  <span>{file.value}</span>
                  {file.helpUrl && (<a href={file.helpUrl} target="_blank">
                    <QuestionCircleOutlined />
                  </a>)}
                </div>} key={props.property.elementId + file.name} className="basic-property-content">
                {renderMenu(file)}
              </TabPane>
            );
          }
        })}
      </Tabs>
      {isShowJsonModal && (
        <JsonModal jsonData={jsonData} closeModal={closeModal} submitJson={submitJson} onPropertyChange={props.onPropertyChange} property={props.property} objectUrlEval={objectUrlEval} />
      )}
      {isShowDebugger && (
        <Debugger props={props} onPropertyChange={props.onPropertyChange} onChangeSingle={props.onChangeSingle} closeDebugger={closeDebugger} />
      )}
      {mapVisible && <AddGLTFModal address={props.property.address} handleCancelMap={handleCancelMap} onChangeSingle={props.onChangeSingle} />}
    </div>
  );
};

export default ChartProperty;
