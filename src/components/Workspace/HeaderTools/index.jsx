import { Tooltip, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import { router } from 'umi';
import logo from '@/assets/logo.svg';
import TopDrawer from '@/components/Workspace/TopDrawer/index.tsx';
// import Sketch from '@/components/Sketch2json/index.jsx';


import styles from './index.less';


function HeaderTools (props) {
  const { effectFrame, share, onClickHtmlReverse } = props
  // function sketch2Template (myProperty, componentsType, type) {
  //   const baseConfig = getBaseConfig();
  //   const bakWidth = myProperty.width
  //   const bakHeight = myProperty.height
  //   const bakTop = myProperty.top
  //   const bakLeft = myProperty.left
  //   const bakRotate = myProperty.rotate
  //   const bakZindex = myProperty.zIndex
  //   const bakBackgroundColor = myProperty.backgroundColor
  //   Object.assign(myProperty, ...baseConfig);
  //   myProperty.width = bakWidth
  //   myProperty.height = bakHeight
  //   myProperty.top = bakTop
  //   myProperty.left = bakLeft
  //   myProperty.rotate = bakRotate
  //   myProperty.zIndex = bakZindex
  //   myProperty.backgroundColor = bakBackgroundColor
  //   effectFrame({
  //     command: 'append',
  //     type,
  //     componentsType,
  //     property: myProperty,
  //   });
  // }
  const sendMsg = (msg) => {
    effectFrame({
      command: msg,
    });
  }
  const openBluePrintByClick = () => {
    sendMsg('openBluePrint') // 通知iframe传送最新的nodeData再打开 防止nodeData不匹配
  }

  function back2List () {
    // 返回首页
    router.goBack()
  }
  return (
    <Row>
      <Col span={3}>
        <div className={styles.logo}>
          <a href="/screen">
            <span>大屏可视化</span>
          </a>

        </div>
      </Col>
      <Col span={2} className="menu-list" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <div onClick={e => { sendMsg('undo') }}>
          <img src={require(`@/assets/icon/undo.png`)} />
          <span>撤销</span>
        </div>
        <div onClick={e => { sendMsg('redo') }}>
          <img src={require(`@/assets/icon/redo.png`)} />
          <span>重做</span>
        </div>
      </Col>
      {/* <Col span={2}>
              <Sketch onSelect={sketch2Template} />
            </Col> */}
      <Col span={11}>
        <TopDrawer effectFrame={effectFrame} />
      </Col>
      <Col span={8} className="menu-list" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <Tooltip title={<a className="tooltip-text" href="https://www.yuque.com/docs/share/7c6a6e67-fcd5-4e42-8642-91d8dce87b30?# 《如何使用Tab列表控制组件显隐》" target="_blak">使用说明</a>} color="geekblue">
          <div onClick={openBluePrintByClick}>
            <img src={require(`@/assets/icon/bluePrint.png`)} />
            <span>蓝图</span>
          </div>
        </Tooltip>
        <Tooltip title={<a className="tooltip-text" href="https://www.yuque.com/docs/share/f6b3b0b7-1b53-4ebb-a3e1-0cddc51f7da8?# 《下载》" target="_blak">使用说明</a>} color="geekblue">
          <div onClick={share}>
            <img src={require(`@/assets/icon/download.png`)} />
            <span>下载</span>
          </div>
        </Tooltip>

        <div onClick={e => sendMsg('preview')}>
          <img src={require(`@/assets/icon/preview.png`)} />
          <span>预览</span>
        </div>
        <div onClick={e => sendMsg('save')}>
          <img src={require(`@/assets/icon/save.png`)} />
          <span>保存</span>
        </div>
       
        <Tooltip title={<a className="tooltip-text" href="https://www.yuque.com/docs/share/e8fb0d00-1069-40e2-9b86-794e9f0516e3?# 《逆向工程》" target="_blak">使用说明</a>} color="geekblue">
          <div onClick={onClickHtmlReverse}>
            <img src={require(`@/assets/icon/htmlReverse.png`)} />
            <span>逆向工程</span>
          </div>
        </Tooltip>
        <div onClick={back2List}>
          <img src={require(`@/assets/icon/exit.png`)} />
          <span>退出</span>
        </div>
      </Col>
    </Row>
  );
}

export default HeaderTools;
