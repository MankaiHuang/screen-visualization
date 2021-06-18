import React, { useState, useEffect } from 'react';
import { Modal, Input, message } from 'antd';
import noImage from '@/assets/noImage.png';
import request from '@/utils/request';
import './AddGLTFModal.less';

interface IProps {
  address: string;
  onChangeSingle: Function;
  handleCancelMap: Function;
}
interface IGltfConfig {
  scale: number;
  height: number;
  rotateX: number;
  rotateY: number
}
const gltfList = [{
  name: '东方明珠',
  value: 'OrientalPearl'
}, {
  name: '雪屋',
  value: 'snowHouse'
}, {
  name: '上海外滩',
  value: 'shanghai'
}, {
  name: '2',
  value: '2'
}, {
  name: '3',
  value: '3'
}, {
  name: '5',
  value: '5'
}]
const AddGLTFModal: React.FC<IProps> = ({ address, onChangeSingle, handleCancelMap }) => {
  const [mapVisible, setMapVisible] = useState<boolean>(true); // 增加模型modal
  const [selectGltf, setSelectGltf] = useState<any>(null)
  const [lnglat, setLnglat] = useState<Array<Number>>([]);
  const [config, setConfig] = useState<IGltfConfig>({ scale: 1, height: 0, rotateX: 90, rotateY: 0 })

  useEffect(() => {
    const asyncFun = async () => {
      // 为地图注册click事件获取鼠标点击出的经纬度坐标
      const data = await request(`https://restapi.amap.com/v3/geocode/geo?key=502123a4f08bd95be55b49ae6eabd728&address=${address || '上海外滩'}`, {
        method: 'get',
        prefix: '',
        credentials: false // 带上cookie会请求不成功
      })
      const center = data.geocodes[0].location.split(',')
      setTimeout(() => {
        const map = new window.AMap.Map('map', {
          zoom: 17,
          pitch: 70.41138037735848,
          center,
        })// 高德地图
        let marker = null
        map.on('click', function (e) {
          setLnglat([e.lnglat.getLng(), e.lnglat.getLat()])
          if (marker) {
            marker.setMap(null);
            marker = null;
          }
          marker = new AMap.Marker({
            icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
            position: [e.lnglat.getLng(), e.lnglat.getLat()],
            offset: new AMap.Pixel(-13, -30),
          });
          marker.setMap(map);
        });
      }, 100);
    }
    asyncFun()

  }, [])
  function handleOkMap() {
    if (selectGltf === null) {
      message.error('请选择要添加的模型');

    } else if (lnglat.length === 0) {
      message.error('请选择要添加的位置');
    } else {
      const data = {
        lnglat,
        selectGltf,
        config
      }
      onChangeSingle(data, 'selectLnglat');
      setMapVisible(false)
      handleCancelMap()
    }

  };
  function onSelectGitf(value: string) {
    // 选择要增加的模型
    setSelectGltf(value)
  }

  function onChangeModelConfig(e: any, name: string) {
    setConfig({ ...config, ...{ [name]: e.target.value } })
  }
  return (
    <Modal
      visible={mapVisible}
      style={{ width: '1000px' }}
      bodyStyle={{ width: '1000px', padding: 0 }}
      wrapClassName="mapModal"
      getContainer={document.getElementById('basic-property')}
      onOk={handleOkMap}
      onCancel={handleCancelMap}
    >
      <span className="title">选择要增加的模型</span>
      <Input prefix="模型放大倍数：" defaultValue={1} onChange={e => onChangeModelConfig(e, 'scale')} />
      <Input prefix="模型高度：" defaultValue={0} onChange={e => onChangeModelConfig(e, 'height')} />
      <Input prefix="X轴旋转角度" defaultValue={90} onChange={e => onChangeModelConfig(e, 'rotateX')} />
      <Input prefix="Z轴旋转角度" defaultValue={0} onChange={e => onChangeModelConfig(e, 'rotateZ')} />
      <div className="gltf-list">
        {gltfList.map(item => {
          return (
            <div key={item.value} onClick={e => onSelectGitf(item.value)} className={item.value === selectGltf ? 'active' : ''}>
              <img src={noImage} alt='' />
              <span>{item.name}</span>
            </div>
          )
        })}
      </div>
      <div id="map" style={{ width: '998px', height: '600px' }} />
    </Modal>
  )
}

export default AddGLTFModal;