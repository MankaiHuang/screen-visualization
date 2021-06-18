import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { SketchPicker } from 'react-color'
import './ColorPicker.less'

interface IProps {
  item: { default: string }; // 具体颜色
  onFiledChange: Function
}
const ColorPicker: React.FC<IProps> = ({ item, onFiledChange }) => {
  const [visible, setVisible] = useState(false);
  const [selectColor, setSelectColor] = useState(item.default);
  useEffect(()=>{
    //console.log(item)
  })
  const handleClick = () => {
    setVisible(!visible)
  };

  const handleClose = () => {
    setVisible(false)
  };

  const handleChange = (e: any) => {
    let colorStr = e.hex
    if (e.rgb.a !== 1) {
      colorStr = `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, ${e.rgb.a})`
    }
    setSelectColor(colorStr)
    onFiledChange(colorStr, item, 'color')
  };
  return (
    <div className="colorPicker">
      <div className="color-show">
        <div className="color" onClick={handleClick} style={{ backgroundColor: selectColor }} />
        <Input value={selectColor} onClick={handleClick} />
      </div>
      {visible ? <div className="popover">
        <div className="cover" onClick={handleClose} />
        <SketchPicker color={selectColor} onChange={e => handleChange(e)} presetColors={['TRANSPARENT', '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']} />
      </div> : null}
    </div>

  )
}

export default ColorPicker;