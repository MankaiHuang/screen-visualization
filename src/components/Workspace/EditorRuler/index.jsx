import { useState, useEffect, useImperativeHandle } from 'react';
import Ruler from "@scena/ruler";
import styles from './index.less';


let rulerHor = null
let rulerVer = null
const EditorRuler = React.forwardRef((props, ref) => {
  const { zoom } = props
  useEffect(() => {
    rulerHor = new Ruler(document.getElementById('rulerHor'), {
      type: "horizontal",
      zoom: zoom / 100,
      backgroundColor: '#091C2E',
      textColor: '#B1CAE2',
      lineColor: '#495E6E',
      unit: 100,
    });
    rulerVer = new Ruler(document.getElementById('rulerVer'), {
      type: "vertical",
      zoom: zoom / 100,
      backgroundColor: '#091C2E',
      textColor: '#B1CAE2',
      lineColor: '#495E6E',
      unit: 100,
    });

  }, []);
  const rulerScroll = (left = null, top = null) => {
    // 改变标尺并滚动标尺
    !left && (left = Number(document.getElementById('work-frame').style.left.split('px')[0]))
    !top && (top = Number(document.getElementById('work-frame').style.top.split('px')[0]))
    rulerHor.scroll((-left + 30) / rulerHor.zoom) // 归零
    rulerVer.scroll((-top + 30) / rulerVer.zoom)
  }
  const changeRulerZoom = () => {
    rulerHor.zoom = zoom / 100
    rulerVer.zoom = zoom / 100
    rulerHor.unit = Math.round(100 / zoom * 50)
    rulerVer.unit = Math.round(100 / zoom * 50)
    rulerScroll()
  }
  const changeRulerMoveZoom = (horZoom, verZoom) => {
    rulerHor.zoom *= horZoom
    rulerVer.zoom *= verZoom
  }
  const changeRulerLength = (width, height) => {
    document.getElementById('ruler-top').style.width = `${width}px`;
    document.getElementById('ruler-iframe').style.height = `${height}px`;
  }
  useImperativeHandle(ref, () => ({
    // 通过ref转发子组件方法
    changeRulerZoom,
    changeRulerLength,
    changeRulerMoveZoom,
    rulerScroll,

  }));
  return (
    <React.Fragment>
      <div className={styles.rulerTop} id="ruler-top">
        <div className={styles.rulerBox} />
        <div id="rulerHor" />
      </div>
      <div className={styles.rulerIframe} id="ruler-iframe">
        <div id="rulerVer" />
      </div>
    </React.Fragment>

  );
})

export default EditorRuler;
