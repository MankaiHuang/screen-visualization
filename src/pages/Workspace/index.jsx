import { useState, useEffect, useRef } from 'react';
import { Layout, message, Modal, Spin, } from 'antd';
import ChartProperty from '@/components/Workspace/Property/Charts';
import BasicProperty from '@/components/Workspace/Property/Basic';
import MoveProperty from '@/components/Workspace/Property/Move';
import Layer from '@/components/Workspace/Layer';
import EditorRuler from '@/components/Workspace/EditorRuler';
import HeaderTools from '@/components/Workspace/HeaderTools';
import BottomTools from '@/components/Workspace/BottomTools';
import { ExclamationCircleOutlined, } from '@ant-design/icons';
import { objectUrlEval, debounce } from '@/utils/utils'
import BluePrint from './BluePrint.jsx';
import Share from './ShareModal.tsx';
import HtmlReverse from './HTMLReverse.tsx';
import { initProxyPack } from '@/services/dataSource.js'

import './index.less';


const { confirm } = Modal;

const iframeIp =
  process.env.NODE_ENV == 'development' ? 'http://127.0.0.1:5500' : window.location.origin;
const { Header, Content, Sider } = Layout;
const width = 1920
const height = 1080 // 初始化宽高

let basicWidth = 0
let basicHeight = 0
let isMove = true;
function Workspace() {
  const [property, setProperty] = useState({}); // 属性区的属性
  const [basicProperty, setBasicProperty] = useState({}); // 属性区的基础属性
  const [current, setCurrent] = useState({}); // 当前元素
  const [layer, setLayer] = useState([]); // 图层
  const [nowId, setNowId] = useState(); // 当前元素
  const [nowGroupId, setNowGroupId] = useState(); // 当前选中的组id
  const [zoom, setZoom] = useState(69.8); // 当前大屏的高
  const [shareModal, setShareModal] = useState(false); // 分享modal开关
  const [htmlReverseModal, setHtmlReverseModal] = useState(false); // html逆向工程modal开关
  const [linkKeyMatchStatus, setLinkKeyMatchStatus] = useState(false); // 联动菜单是否映射成功
  const [SSEServer, setSSEServer] = useState(null)
  const [spinning, setSpinning] = useState(false) // 是否显示Spin
  const [spinText, setSpinText] = useState('加载中') // 加载文案
  const [dataOrigin, setDataOrigin] = useState([]) // 系统配置api
  const [exportBluePrint, setExportBluePrint] = useState([]) // 导出到蓝湖编辑器数据
  const [isShowBluePrint, setIsShowBluePrint] = useState(false) // 是否展示蓝图编辑器
  const iframeRef = useRef(null);
  const rulerRef = useRef(null);
  const id = window.location.hash.split('?')[1].split('=')[1] // 根据url截取的id

  function sendMsg(command) {
    effectFrame({
      command
    });
  }
  function confirmModal(title, onOk) {
    // 确定框
    confirm({
      title,
      getContainer: document.getElementById("workspace"),
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      okButtonProps: {
        ghost: true
      },
      maskClosable: true,
      mask: true,
      cancelText: '取消',
      cancelButtonProps: {
        ghost: true
      },
      onOk() {
        setTimeout(async () => {
          onOk()
        }, 100);
      },
      onCancel() { },
    });
  }

  function share() {
    setShareModal(true)
  }
  function onClickHtmlReverse() {
    setHtmlReverseModal(true)
  }
  function submitShare(shareData) {
    effectFrame({
      command: 'share',
      property: shareData
    });
  }
  function closeShareModal() {
    setShareModal(false)
  }
  function submitHTMLReverse(url) {
    effectFrame({
      command: 'htmlReverse',
      property: url
    });
  }

  function openBluePrint() {
    setIsShowBluePrint(true)
  }
  function closeBluePrint() {
    setIsShowBluePrint(false)
  }
  function closeHTMLReverseodal() {
    setHtmlReverseModal(false)
  }
 
  async function initProxyPackFunc (id){
    // 进来重新请求pack接口 替换header里面的数据 避免切换用户数据为旧数据
    const { data } = await initProxyPack({ id })
    return data.header
  }
  async function initTemplate() {
    // 根据url传来的参数选择模板
    const res ={"msg":"查询成功","code":200,"data":{"id":"6b62be22860ae9e2fc06dab73d67a3ea","createTime":"2021-06-18 16:13:23","updateTime":null,"name":"空白模板","preview":null,"previewId":null,"backgroundId":null,"extend":{"description":""},"type":0,"_public":0,"source":1,"componentList":[]}}
    const { componentList, extend, backgroundId, previewId, preview } = res.data
    setSSEServer(extend.SSEServer)
    for(const item of componentList){
      if(item.extend.property.dataBindType.default === 'system'){
        const proxyHeader = await initProxyPackFunc(item.extend.property.dataOrigin.default) // 获取最新的header
        item.extend.property.dataOriginConfig.body.header = proxyHeader 
        }
        if (item.extend.type === 'GIS') {
          let user = window.localStorage.getItem('currentUser');
          try {
            user = JSON.parse(user)
            item.extend.property.option.site = user.site;
          } catch (error) { }
        }
    }
   
    const allTemplateList = {
      templateList: componentList,
      ...extend
    }
    allTemplateList.width ? '' : allTemplateList.width = width // 有就赋值 没有就初始化
    allTemplateList.height ? '' : allTemplateList.height = height
    !allTemplateList.window && (allTemplateList.window = [0])
    allTemplateList.backgroundId = backgroundId // 保存模板时需要此id 因此一起传给iframe
    allTemplateList.background ? '' : allTemplateList.background = '#0D1D31' // 初始化颜色
    allTemplateList.previewId = previewId
    setBasicProperty({ ...extend, ...{ preview } })
    basicWidth = allTemplateList.width
    basicHeight = allTemplateList.height
    effectFrame({
      command: 'init',
      templateList: allTemplateList
    });
    fullScreen()// 初始化缩放
  }
  // react每次新增图标时保持一份属性名, vue那边删除复制时给react放数据保持组件数量和标题一致
  window.receiveMessage = async function (event) {
    if (event && event.origin === iframeIp) {
      // 属性发生变化
      if (event.data.command) {
        const { command, type, data } = event.data;
        // 监听到变化
        switch (command) {
          case 'setLayerNowId': {
            setNowId([data.elementId]);
          }; break;
          case 'delete': {
            // 删除组件 删除layer中指定的id
            const tempLayer = [...layer];
            tempLayer.splice(
              tempLayer.findIndex(item => item.elementId === data.elementId),
              1,
            );
            const tempLayerLength = tempLayer.length;
            if (tempLayerLength > 0) {
              // 删除了组件要把当前的id换成上一个id避免id丢失导致页面没有选中的情况
              setNowId([tempLayer[tempLayerLength - 1].elementId]);
            } else {
              setNowId([]);
            }
          }; break;
          case 'move':
          case 'update': {
            if (event.data.type === 'basic') {
              setBasicProperty({ ...Object.assign(basicProperty, data) });
              basicWidth = data.width
              basicHeight = data.height
              setSSEServer(data.SSEServer)
              zoomChange(zoom); // 修改缩放
            } else {
              const tempData = Object.assign(property, data);
              setProperty(tempData);
              setNowId([data.elementId]);
              setCurrent({ type: 'chart', elementId: data.elementId });
              // 更新图层指定elementId的title
              const tempLayer = [...layer];
              const tempLayerIndex = tempLayer.findIndex(item => item.elementId === tempData.elementId)
              tempLayerIndex !== -1 && (tempLayer[tempLayerIndex].title = tempData.title)
            }
          }; break;
          case 'layerClick': {
            setProperty(data);
            setNowId([data.elementId]);
            setCurrent({ type: 'chart', elementId: data.elementId });
          }; break;
          case 'layerClickMulity': {
            // 多选
            setNowId(data)
          }; break;
          case 'blur': {
            setCurrent({ type: 'blur' });
            setNowId([])
            setNowGroupId(null)
          }; break;
          case 'save': {
            data.id = id
            try {
              setSpinning(false)
              message.success('保存成功！');
            } catch (err) {
              setSpinning(false)
              message.error(err);
            }
          }; break;
          case 'toast': {
            if (type === 'willDelete') {
              confirmModal(data, async () => {
                await sendMsg('delete')
                message.success('删除成功！');
              })
            } else if (type === 'willDeleteMultiple') {
              confirmModal(data, async () => {
                await sendMsg('deleteMultiple')
                message.success('删除成功！');
              })
            } else {
              message[type](data);
            }
          }; break;
          case 'multiplyMove': {
            setCurrent({ type: 'move' });
          }; break;
          case 'ctrlChangeZoom': {
            // ctrl 滑轮缩放
            iframeRef.current.style.width = `${basicProperty.width * (data)}px`;
            iframeRef.current.style.height = `${basicProperty.height * (data)}px`;
            setZoom(data * 100);
          }; break;
          case 'group': {
            setLayer(data);
          }; break;
          case 'linkKeyNotMatch': {
            setLinkKeyMatchStatus(data)
          }; break;
          // case 'changeWindow': {
          //   // 改变窗口
          //   setNowWindowIndex(data)
          // }; break;
          case 'loading': {
            // iframe传来打开关闭加载信息
            setSpinning(data.loading)
            setSpinText(data.loadingText || '正在加载中')
          }; break;
          case 'updateNowGroupId': {
            setNowGroupId(data)
          }; break;
          case 'exportBluePrint': {
            setExportBluePrint(data)
            openBluePrint()
          }
        }
      }
    }
  };

  useEffect(() => {
    // 判断iframe是否加载完毕 加载完毕发送初始化模板指令
    const iframe = document.getElementById('work-frame');
    if (iframe.attachEvent) {
      iframe.attachEvent('onload', function () {
        initTemplate();
      });
    } else {
      iframe.onload = function () {
        initTemplate();
      };
    }
    // 离开页面的监听
    window.addEventListener("beforeunload", function (e) {
      (e || window.event).returnValue = '页面正在进行操作,确定离开此页吗？';
    });
    return () => window.removeEventListener("beforeunload", function (e) {
      (e || window.event).returnValue = '页面正在进行操作,确定离开此页吗？';
    });
  }, []);

  useEffect(() => {
    rulerRef.current.changeRulerZoom() // 改变标尺的缩放
    const ele = document.getElementById('workspace-content')
    const listener = new WeakMap() // WeakMap类型 不计入垃圾回收机制
    listener.set(ele, scrollFunc)
    ele.addEventListener('mousewheel', listener.get(ele), false)
    function scrollFunc(e) {
      debounce(scrollChangeZoom, 100)({ wheelDelta: e.wheelDelta })
      e.preventDefault()
    }
  }, [zoom])

  function scrollChangeZoom({ wheelDelta }) {
    if (wheelDelta > 0) {
      zoomChange(zoom + 5 > 200 ? 200 : zoom + 5)
    } else {
      zoomChange(zoom - 5 < 10 ? 10 : zoom - 5)
    }
  }
  /**
   * 对子组件进行影响
   * @param {*} data
   */
  function effectFrame(data = { msg: null }) {
    try {
      const workFrame = document.getElementById('work-frame');
      workFrame.contentWindow.postMessage(data, iframeIp);
    } catch { }
  }
  function fullScreen() {
    // 点击右下角全屏按钮
    document.getElementById('work-frame').style.left = '60px'
    document.getElementById('work-frame').style.top = '60px'
    zoomChange(127000 / (basicProperty.width || basicWidth))
  }
  function zoomChange(value) {
    // 让iframe 的宽高也改变 作用为当显示不全时显示滚动条
    const changeWidth = (basicProperty.width || basicWidth) * (value / 100)
    const changeHeight = (basicProperty.height || basicHeight) * (value / 100)
    const nowLeft = getElementIdProperty('work-frame', 'left')
    const nowTop = getElementIdProperty('work-frame', 'left')
    rulerRef.current.changeRulerLength(changeWidth + nowLeft, changeHeight + nowTop) // 改变标尺的长度
    iframeRef.current && (iframeRef.current.style.width = `${changeWidth}px`);
    iframeRef.current && (iframeRef.current.style.height = `${changeHeight}px`);
    setZoom(value);
    effectFrame({
      command: 'zoomChange',
      property: value,
    });
  }
  function onPropertyChange(fields, type, command) {
    if (type === 'basic' && (command === 'update' || command === 'upload')) {
      const tempBasicProperty = JSON.parse(JSON.stringify(basicProperty))
      objectUrlEval(tempBasicProperty, fields.path, true, fields.value) // 根据路径修改特定值
      setBasicProperty(tempBasicProperty);
      basicWidth = tempBasicProperty.width
      basicHeight = tempBasicProperty.height
    } else if (command === 'layerClick') {
      setNowId(fields.selectKeys) // 回写 让子组件刷新
    } else if (command === 'layerClickGroup') {
      setNowId([]) // 点击组 设置选中的为空
      setNowGroupId(fields.groupId)
    }
    else {
      setNowId(property.elementId);
      // 属性回写 防止菜单栏一直处于初始化的值
      if (command === 'update' || command === 'updateApiBind' || command === 'upload') {
        // update时属性回写
        const tempProperty = JSON.parse(JSON.stringify(property))
        if (command === 'upload') {
          // uoload参数方式不同 单独处理
          objectUrlEval(tempProperty, fields.path, true, fields.data.value) // 根据路径修改特定值
        } else {
          if (fields.type === 'excel') {
            objectUrlEval(tempProperty, 'excelData', true, fields.value) // 根据路径修改特定值
          }
          objectUrlEval(tempProperty, fields.path, true, fields.value) // 根据路径修改特定值
        }
        setProperty(tempProperty);
      }
    }
    debounce(effectFrame, 300)({
      command,
      type,
      property: fields,
    })
  }
  function onChangeSingle(data, command) {
    effectFrame({
      command,
      property: data,
    });
  }
  function getElementIdProperty(elementId, name) {
    // 根据元素id 获取对应style中的值
    return Number(document.getElementById(elementId).style[name].split('px')[0])
  }
  function cannelSelect() {
    // 取消选中
    setCurrent({ type: 'blur' });
    setNowId([])
    setNowGroupId(null)
    sendMsg('blur')
  }
  function iframeMove(e) {
    // 拖拽画布移动
    const posix = { x: e.clientX, y: e.clientY }
    isMove = true
    const left = getElementIdProperty('work-frame', 'left')
    const top = getElementIdProperty('work-frame', 'top')
    e.currentTarget.onmousemove = ev => {
      if (isMove && window.document.activeElement.tagName !== "IFRAME" && !ev?.target?.className.split(' ').includes('ant-slider')) { // 拖拽进度条和iframe都不需要移动
        requestAnimationFrame(() => {
          let endLeft = left + (ev.clientX - posix.x);
          let endTop = top + (ev.clientY - posix.y)
          if (endLeft <= 30) { // 到达边界时
            endLeft = 30
          }
          if (endTop <= 30) {
            endTop = 30
          }
          const nowLeft = getElementIdProperty('work-frame', 'left')
          const nowTop = getElementIdProperty('work-frame', 'top')
          const nowWidth = getElementIdProperty('work-frame', 'width')
          const nowHeight = getElementIdProperty('work-frame', 'height')
          const oldWidth = getElementIdProperty('ruler-top', 'width')
          const oldHeight = getElementIdProperty('ruler-iframe', 'height')
          rulerRef.current.changeRulerLength(nowWidth + nowLeft, nowHeight + nowTop) // 移动编辑器 标尺自动增大
          const rulerHorZoom = Math.ceil(oldWidth > nowWidth + nowLeft ? (nowWidth + nowLeft) / oldWidth : oldWidth / (nowWidth + nowLeft)) // 移动的长度和之前的长度占比
          const rulerVerZoom = Math.ceil(oldHeight > nowHeight + nowTop ? (nowHeight + nowTop) / oldHeight : oldHeight / (nowHeight + nowTop))
          rulerRef.current.changeRulerMoveZoom(rulerHorZoom, rulerVerZoom) // 移动改变两根标尺的缩放 // 保证增大了标尺长度 刻度间距不变
          rulerRef.current.rulerScroll(endLeft, endTop) // 让编辑器的位置保持在 0 0
          document.getElementById('work-frame').style.left = `${endLeft}px`
          document.getElementById('work-frame').style.top = `${endTop}px`
        })
      } else {
        isMove = false;
      }
    }
    e.target.onmouseup = () => {
      isMove = false
    }
  }

  const iframeUrl =
    process.env.NODE_ENV == 'development'
      ? 'http://127.0.0.1:5500/public/iframe/preview.html'
      : './iframe/preview.html';
  return (
    <Spin tip={spinText} spinning={spinning} size="large" wrapperClassName="spin" delay={100}>
      <Layout className="workspace" id="workspace">
        <Header className="workspace-header">
          <HeaderTools share={share} effectFrame={effectFrame} onClickHtmlReverse={onClickHtmlReverse} />
        </Header>

        <Layout className="workspace-main">
          <Sider className="workspace-layer">
            <Layer layer={layer} nowId={nowId} bluePrintIdList={exportBluePrint.exportIdList} nowGroupId={nowGroupId} onPropertyChange={onPropertyChange} />
            {/* <ElementList dataList={components.map(item=>item.name)} /> */}
          </Sider>
          <Content id="workspace-content" className="workspace-content" onMouseDown={iframeMove} onClick={cannelSelect}>
            <EditorRuler zoom={zoom} style={{ width: '100%', height: '100%' }} ref={rulerRef} />
            <iframe
              id="work-frame"
              className="workspace-iframe"
              src={iframeUrl}
              scrolling="auto"
              frameBorder="0"
              allow="microphone;camera;midi;encrypted-media;"
              ref={iframeRef} />
            <BottomTools zoomChange={zoomChange} zoom={zoom} fullScreen={fullScreen} sendMsg={sendMsg} confirmModal={confirmModal} />
          </Content>
          <Sider className="workspace-property">
            {/* 属性区 */}
            {current.type === 'chart' && (
              <ChartProperty
                property={property}
                dataOrigin={dataOrigin}
                onPropertyChange={onPropertyChange}
                onChangeSingle={onChangeSingle}
                setSpinning={setSpinning}
                setSpinText={setSpinText}
                SSEServer={SSEServer}
                layer={layer}
                linkKeyMatchStatus={linkKeyMatchStatus}
                debugApi={e => { sendMsg('debug') }}
              />
            )}
            {current.type === 'blur' && JSON.stringify(basicProperty) !== '{}' && (
              <BasicProperty property={basicProperty} layer={layer} onPropertyChange={onPropertyChange} onChangeSingle={onChangeSingle} id={id}
                setSpinning={setSpinning}
                setSpinText={setSpinText}
              />
            )}
            {current.type === 'move' && (
              <MoveProperty onPropertyChange={onPropertyChange} />
            )}
          </Sider>
        </Layout>
        {shareModal && (<Share submitShare={submitShare} closeShareModal={closeShareModal} id={id} title={basicProperty.title} />)}
        {htmlReverseModal && (<HtmlReverse submitHTMLReverse={submitHTMLReverse} closeHTMLReverseodal={closeHTMLReverseodal} />)}
        {isShowBluePrint && <BluePrint closeBluePrint={closeBluePrint} onPropertyChange={onPropertyChange} exportBluePrint={exportBluePrint} />}
      </Layout>
    </Spin>
  );
}

export default Workspace;
