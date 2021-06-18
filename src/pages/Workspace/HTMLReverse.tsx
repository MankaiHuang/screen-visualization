import React, { useState } from 'react';
import { Modal, message, Button } from 'antd';
import './ShareModal.less'

interface Props {
  closeHTMLReverseodal: Function;
  submitHTMLReverse: Function;
}
const HtmlReverse: React.FC<Props> = ({ closeHTMLReverseodal, submitHTMLReverse }) => {
  const [visible, setVisible] = useState<Boolean>(true);
  const handleCancel = () => {
    closeHTMLReverseodal()
    setVisible(false)
  };
  const onChange = (e: any) => {
    const reader = new FileReader();// 新建一个FileReader
    reader.readAsText(e.target.files[0], "UTF-8");// 读取文件
    reader.onload = evt => { // 读取完文件之后会回来这里
      // const fileString = evt.target.result.replace(/\ +/g, "").replace(/[\r\n]/g, ""); // 读取文件内容 去掉回车换行
      const fileString = evt?.target?.result.replace(/[\r\n]/g, "")// 读取文件内容 去掉回车换行
      const allTemplateListReg = /(?<=allTemplateList:).*?}}\]\]/;
      const basicConfigReg = /(?<=basicConfig:).*?(?=, {16}loading: true)/
      //const basicConfigReg = /(?<=basicConfig:).*?(?=loading: true)/;
      const result = {
        templateList: [],
        basicConfig: []
      }
      try {
        //console.log(fileString.match(allTemplateListReg)[0])
        result.templateList = JSON.parse(fileString.match(allTemplateListReg)[0])
        result.basicConfig = JSON.parse(fileString.match(basicConfigReg)[0])
        submitHTMLReverse(result)
        handleCancel()
        setVisible(false)
      } catch (err) {
        message.error('文件解析失败！请确保文件未经过任何手动修改');
      }
    }
  }

  return (
    <Modal
      title='HTML逆向转换为可编辑组件'
      visible={visible}
      closable={false}
      getContainer={document.getElementById('workspace')}
      centered
      onCancel={handleCancel}
      footer={[
        <Button type="primary" onClick={handleCancel}>
          关闭
          </Button>
      ]}
    >
      <div className="share-modal">
        <p>请上传已下载的HTML文件，即可逆向恢复为可拖拽编辑的工程！</p>
        <input type="file" className="input-file" onChange={e => onChange(e)} />
      </div>
    </Modal >
  )
}

export default HtmlReverse;