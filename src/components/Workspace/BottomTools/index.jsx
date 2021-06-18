import { Menu, Button, Tooltip, Row, Col, Slider, InputNumber, } from 'antd';
import React, { useState, useEffect } from 'react';

import { ExpandOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import styles from './index.less';


function BottomTools (props) {
  const { zoomChange, zoom, fullScreen, sendMsg, confirmModal } = props

  function delWindow () {
    confirmModal('确定删除当前桌面吗? 删除会失去此桌面全部内容', () => sendMsg('delWindow'))
  }
  return (
    <div className={styles['workspace-bottom-tools']} >
      <Row className={styles['workspace-zoom']} gutter={10}>
        <Col span={5}>
          <span>面板缩放百分比</span>
        </Col>
        <Col span={8}>
          <Slider
            min={10}
            max={200}
            onChange={e => {
              zoomChange(e);
            }}
            value={typeof zoom === 'number' ? Math.round(zoom) : 0}
          />
        </Col>
        <Col span={5}>
          <InputNumber
            min={10}
            max={200}
            onChange={e => {
              zoomChange(e);
            }}
            style={{ margin: '0 16px', width: 'auto' }}
            value={Math.round(zoom)}
          />
        </Col>
        <Col span={2}>
          <Tooltip title="自适应编辑区尺寸" color="geekblue">
            <ExpandOutlined className={styles.expandIcon} onClick={fullScreen} />
          </Tooltip>
        </Col>
        <Col span={2}>
          <Tooltip title="增加编辑区窗口" color="geekblue">
            <PlusOutlined className={styles.expandIcon} onClick={e => sendMsg('addWindow')} />
          </Tooltip>
        </Col>
        <Col span={2}>
          <Tooltip title="删除编辑区窗口" color="geekblue">
            <DeleteOutlined className={styles.expandIcon} onClick={delWindow} />
          </Tooltip>
        </Col>
      </Row>
    </div>
  );
}

export default BottomTools;
