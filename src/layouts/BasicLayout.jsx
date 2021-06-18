/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import { Icon, Result, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';
import './BasicLayout.less';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

const BasicLayout = props => {
  const {
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  const userRole = localStorage.getItem('userRole')||'user';
  const changeBackground = () => {
    // 根据鼠标移动改变图片
    let startingPoint = null
    const snowContainer = document.getElementById('snow-container')
    const header = document.getElementById('index-header')
    const headerEnterListener = new WeakMap() // WeakMap类型 不计入垃圾回收机制
    headerEnterListener.set(header, (e) => {
      startingPoint = e.clientX
      header.classList.add('moving')
    })
    header.addEventListener('mouseenter', headerEnterListener.get(header), false)

    const headerOutListener = new WeakMap() // WeakMap类型 不计入垃圾回收机制
    headerOutListener.set(header, (e) => {
      header.classList.remove('moving')
      header.style.setProperty('--percentage', 1)
      snowContainer.style.visibility = 'inherit'
    })
    header.addEventListener('mouseout', headerOutListener.get(header), false)

    const headerMoveListener = new WeakMap() // WeakMap类型 不计入垃圾回收机制
    headerMoveListener.set(header, (e) => {
      const percentage = (e.clientX - startingPoint) / window.outerWidth + 1
      if (percentage < 0.5) {
        snowContainer.style.visibility = 'hidden'
      } else {
        snowContainer.style.visibility = 'inherit'
      }
      header.style.setProperty('--percentage', percentage)
    })
    header.addEventListener('mousemove', headerMoveListener.get(header), false)

  }
  useEffect(() => {
    changeBackground()
  }, [])

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  return (
    <React.Fragment>
      <div className="index-header" id="index-header">
        <div className="snow-container" id="snow-container">
          <div className="snow middleground" />
          <div className="snow middleground layered" />
          <div className="snow background" />
          <div className="snow background layered" />
        </div>
        <div className="view">
          <img src={require('@/assets/indexBackground/bilibili-winter-view-1.webp')} className="morning" alt="" />
          <img src={require('@/assets/indexBackground/bilibili-winter-view-2.webp')} className="afternoon" alt="" />
          <video autoPlay loop muted className="evening">
            <source src={require('@/assets/indexBackground/bilibili-winter-view-3.webm')} type="video/webm" />
          </video>
          <img src={require('@/assets/indexBackground/bilibili-winter-view-3-snow.png')} className="window-cover" alt="" />
        </div>
        <div className="tree">
          <img src={require("@/assets/indexBackground/bilibili-winter-tree-1.webp")} className="morning" alt="" />
          <img src={require("@/assets/indexBackground/bilibili-winter-tree-2.webp")} className="afternoon" alt="" />
          <img src={require("@/assets/indexBackground/bilibili-winter-tree-3.webp")} className="evening" alt="" />
        </div>
      </div>

      <ProLayout
        className="Index-Menu"
        disableMobile
        menuItemRender={(menuItemProps, defaultDom) => {
          // console.log(userRole)
          if (menuItemProps.authority) {
            if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path || !menuItemProps.authority.includes(userRole)) {
              return null;
            }
          }
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        formatMessage={formatMessage}
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
      >
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
    </React.Fragment>

  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
