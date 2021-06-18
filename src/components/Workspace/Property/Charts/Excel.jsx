import React, { useState, useEffect, useImperativeHandle } from 'react';
import { } from 'antd';
import Spreadsheet from "x-data-spreadsheet";
import zhCN from 'x-data-spreadsheet/dist/locale/zh-cn';
import { objectUrlEval } from '@/utils/utils'

Spreadsheet.locale('zh-cn', zhCN);
let s = null // excel 对象
let header = []
let rows = []
const Excel = React.forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    // 通过ref转发子组件submit方法
    submit,
  }));
  const [cellData, setCellData] = useState([]);
  const { property, onPropertyChange, closeExcel, jsonData } = props
  const isStaticJson = jsonData.name === 'staticJson'
  const excelData2MyData = (excelData) => {
    // excel数据转换成组件需要的数据
    const myData = []
    header.length > 0 && delete excelData.rows['0'] // 删除表头
    Object.values(excelData.rows).map((item, arrayIndex) => {
      if (!item.cells) return;
      Object.values(item.cells).map((value, index) => {
        let key = null
        if (property.componentsType === 'charts' && isStaticJson) {
          if (!value.key) {
            const headerKey = header[index].split('.')
            try {
              const upKey = excelData.rows[arrayIndex].cells[0].key.split('.')
              headerKey.splice(1, 0, Number(upKey[2]) + 1)
              key = `${upKey[0]}.${headerKey.join('.')}`
            } catch (err) {
              console.log(err)
            }
          } else {
            key = value.key
          }
        } else {
          key = value.key ? value.key : `${arrayIndex}.${header[index]}`
        }
        myData.push({ key, value: value.text })
      })
    })
    myData2Option(myData)
  }
  function myData2Option (myData) {
    // myData 转换为option需要的data格式
    try {
      const option = {}
      myData.map((item, index) => {
        let optionData = null
        if (isStaticJson) {
          optionData = property.option.data
        } else {
          optionData = objectUrlEval(property, jsonData.name, false)
        }
        if (!objectUrlEval(optionData, item.key, false) == undefined) { // 不存在则新增
          if (property.componentsType === 'charts' && isStaticJson) {
            optionData[0].data.push(JSON.parse(JSON.stringify(optionData[0].data[0])))
          } else {
            optionData.push(JSON.parse(JSON.stringify(optionData[0])))
          }
        }
        objectUrlEval(optionData, item.key, true, item.value)

      })
    }
    catch (err) { console.log(err) }
  }

  function submit () {
    excelData2MyData(s.getData()[0])
    if (isStaticJson) {
      onPropertyChange({ path: 'option.data', value: property.option.data }, property.type, 'update') // staticJson 对应option.data  因此要单独处理
      setTimeout(() => {
        onPropertyChange({ path: 'staticJson', value: property.option.data }, property.type, 'update') // staticJson 修改 因为有防抖 因此延迟500毫秒执行
      }, 500);
    } else {
      onPropertyChange({ path: jsonData.name, value: objectUrlEval(property, jsonData.name, false) }, property.type, 'update')
    }
    closeExcel()
  }
  const initData = (rows, header, data, arrayIndex = 0, upKey = null) => {
    if (Object.prototype.toString.call(data) === '[object Object]') {
      data = [data]
    }
    data.map((item, index) => {
      rows.push({ cells: {} })
      if (Object.prototype.toString.call(item) === '[object Object]') {
        Object.entries(item).map(subItem => {
          let nowKey = null
          let nowIndexKey = null
          if (upKey) {
            nowKey = `${upKey}.${subItem[0]}`
            nowIndexKey = `${arrayIndex}.${upKey}.${index}.${subItem[0]}`
          } else {
            nowKey = subItem[0]
            nowIndexKey = `${index}.${subItem[0]}`
          }
          if (Object.prototype.toString.call(subItem[1]) === '[object Object]') {
            initData(rows, header, subItem[1], 0, nowKey)
          } else if (Object.prototype.toString.call(subItem[1]) === '[object Array]') {
            initData(rows, header, subItem[1], arrayIndex++, nowKey)
          }
          else {
            if (!header.includes(nowKey)) {
              header.push(nowKey)
            }
            rows[rows.length - 1].cells[nowKey] = { text: subItem[1], key: nowIndexKey }
          }
        })
      } else {
        rows[index].cells[0] = { text: item, key: String(index) }
      }

    })
  }
  const fixData = (rows, header) => {
    rows.map(item => {
      Object.entries(item.cells).map((keyValue, index) => {
        const findIndex = header.findIndex(a => { return a === keyValue[0] }) // 找到key所在的位置替换
        item.cells[String(findIndex)] = keyValue[1] // 因为excel只能读取key为字符串的序号 因此在这里转换
        delete item.cells[keyValue[0]]
      })
    })
  }
  useEffect(() => {
    s = new Spreadsheet(document.getElementById('excel'), {
      showToolbar: false, showContextmenu: false, col: {
        len: 26,
        width: 200,
        indexWidth: 60,
        minWidth: 60,
      }, style: {
        font: {
          size: 12,
        },
      },
    })
    const arrayIndex = 0
    rows = []
    header = []
    initData(rows, header, JSON.parse(jsonData.default), arrayIndex)
    header = [...new Set(header)] // 去重
    if (header.length > 0) {
      fixData(rows, header)
      rows.unshift({ cells: {} }) // 将header加入到第一项
      header.map((item, index) => {
        rows[0].cells[index] = {
          text: item
        }
      })
    }
    const excelData = []
    excelData.push({
      name: 'sheet1',
      rows
    })
    s.loadData(excelData)
    s.on('cell-edited', (text, ri, ci) => {
      setCellData([cellData.push({ text, ri, ci })])
    })

  }, [])
  return (
    <div>
      <div id="excel" />
    </div>

  )
})

export default Excel;