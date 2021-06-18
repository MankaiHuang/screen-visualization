/*
 * @Descripttion: 
 * @Author: cbz
 * @Date: 2021-01-14 14:11:23
 * @LastEditors: cbz
 * @LastEditTime: 2021-01-29 16:12:50
 */
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Spin, message } from 'antd';
import request from '@/utils/request';
import { BorderOutlined, createFromIconfontCN } from '@ant-design/icons';
import { gcj02towgs84 } from '@/utils/utils'

import styles from './index.less';

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_2341091_3f8ddrd2lzi.js'
  ],
});

interface IProps {
  closeMap: any;
  afterSelect: any;
  option: any;
  clickComponent: {
    type: string,
    secondType: string,
    typeName: string
  }

}
let mouseTool: any = null
const SelectMap: React.FC<IProps> = (props) => {
  const { closeMap, afterSelect, option, clickComponent } = props
  const rectangle = useRef(null)
  const [lnglatRange, setLnglatRange] = useState([]) // 当前选择的左上角和右下角坐标
  const [zoom, setZoom] = useState(0) // 当前地图缩放
  const [center, setCenter] = useState([]) // 当前地图中心
  const [drawType, setDrawType] = useState<string>('move') // 是否绘制矩形
  const [loading, setLoading] = useState<boolean>(false) // 获取3dBuildings数据loading
  useEffect(() => {
    const asyncFun = async () => {
      // 为地图注册click事件获取鼠标点击出的经纬度坐标
      const data = await request(`https://restapi.amap.com/v3/geocode/geo?key=502123a4f08bd95be55b49ae6eabd728&address=上海外滩`, {
        method: 'get',
        prefix: '',
        credentials: false // 带上cookie会请求不成功
      })
      const center = data.geocodes[0].location.split(',')
      const map = new window.AMap.Map('map', {
        zoom: 15,
        pitch: 70.41138037735848,
        center,
      })// 高德地图
      // 通过插件方式引入 AMap.MouseTool 工具
      map.plugin(["AMap.MouseTool"], async () => {
        // 在地图中添加MouseTool插件
        mouseTool = new AMap.MouseTool(map)
        mouseTool.on('draw', async (e) => {
          if (rectangle.current) {
            map.remove(rectangle.current);
          }
          map.setFitView(e.obj); // 地图适应框框
          if (map.getZoom() < 14) {
            map.setZoom(14) // 14级以下没有高程数据
          }
          rectangle.current = e.obj
          const startLnglat = gcj02towgs84(e.obj.getPath()[0].lng, e.obj.getPath()[0].lat); // 0 左上角 gcj02坐标 高德坐标转wgs84坐标
          const endLnglat = gcj02towgs84(e.obj.getPath()[2].lng, e.obj.getPath()[2].lat); // 2 右下角
          setLnglatRange([startLnglat, endLnglat])
          setZoom(map.getZoom())
          setCenter(map.getCenter())
        })
      });

      map.plugin(["AMap.Autocomplete", "AMap.PlaceSearch"], () => {
        // 输入提示
        const autoOptions = {
          input: "tipinput"
        };
        const auto = new AMap.Autocomplete(autoOptions);
        const placeSearch = new AMap.PlaceSearch({
          map
        });  // 构造地点查询类
        AMap.event.addListener(auto, "select", select);// 注册监听，当选中某条记录时会触发
        function select(e) {
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name);  // 关键字查询查询
        }
      });


    }
    asyncFun()

  }, [])
  function drawRectangle() {
    mouseTool.rectangle({
      strokeColor: 'red',
      strokeOpacity: 0.5,
      strokeWeight: 6,
      fillColor: 'blue',
      fillOpacity: 0.5,
      // strokeStyle还支持 solid
      strokeStyle: 'solid',
      // strokeDasharray: [30,10],
    })
  }

  async function handleOkMap() {
    if (zoom === 0 || lnglatRange.length === 0) {
      message.error('请选择区域');
      return;
    }
    setLoading(true)
    try {
      const { data } = await request(`http://127.0.0.1:8890/getData?lnglatRange=${encodeURI(lnglatRange)}&zoom=${zoom}`, {
        method: 'get',
        prefix: '',
        timeout: 1000000000,
        credentials: false // 带上cookie会请求不成功
      })
      option.customConfig = {
        tiles: data.tiles,
        geojson: data.geojson,
        shp: data.shp,
        center: [center.lng, center.lat],
        zoom
      }
      afterSelect(option, 'L7', clickComponent.type, clickComponent.secondType, clickComponent.typeName)
      handleCancelMap()
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  };
  function handleCancelMap() {
    closeMap()
  }
  function closeDraw() {
    // 关闭绘制
    mouseTool.close(true)
  }
  function onClickRect(type: string) {
    setDrawType(type)
    switch (type) {
      case 'rect': drawRectangle(); break;
      case 'move': closeDraw(); break;
      default: break;
    }
  }
  return (
    <Modal
      visible
      style={{ width: '1500px' }}
      bodyStyle={{ width: '1000px', padding: 0 }}
      wrapClassName="mapModal"
      getContainer={document.getElementById('basic-property')}
      onOk={handleOkMap}
      onCancel={closeMap}
      confirmLoading={loading}
    >
      <Spin tip="正在获取3d地图数据..." spinning={loading} className="mapSpin">
        <div id="map" style={{ width: '1000px', height: '600px' }} />
        <div className={styles.tipInput} >
          <Input placeholder="请输入查询地址：" id="tipinput" />
          <div className={styles['icon-groups']}>
            <BorderOutlined className={[styles.drewRectIcon, drawType === 'rect' ? styles.active : '']} onClick={e => onClickRect('rect')} />
            <IconFont type="icon-move" className={[styles.drewRectIcon, drawType === 'move' ? styles.active : '']} onClick={e => onClickRect('move')} />
          </div>

        </div>
      </Spin>
    </Modal>

  )
}

export default SelectMap;