import React, { useState } from 'react';
import { Modal, Input, Switch } from 'antd';
import './ShareModal.less'

interface Props {
  closeShareModal: Function;
  submitShare: Function;
  title: string;
}
type customList = {
  url: string,
  title: string,
  isAutoApi: Boolean
}
const ShareModal: React.FC<Props> = ({ closeShareModal, submitShare, title }) => {
  const [visible, setVisible] = useState<Boolean>(true);
  const [customList, setCustomList] = useState<customList>({ url: 'https://moctest.sobeylingyun.com', title: title || '可视化预览 ', isAutoApi: false })
  const [isCustomUrl, setIsCustomUrl] = useState<Boolean>(false) // 是否自定义静态资源地址
  const handleCancel = () => {
    closeShareModal()
    setVisible(false)
  };
  const handleOk = () => {
    if (!isCustomUrl) {
      customList.url = window.location.origin
    }
    submitShare(customList)
    handleCancel()
    setVisible(false)
  };
  const onChange = (e: any, type: string) => {
    setCustomList({ ...customList, [type]: e.target.value })
  }
  const onChangeSwitch = (e: any, type: string) => {
    if (type === 'customUrl') {
      setIsCustomUrl(e)
    } else {
      setCustomList({ ...customList, isAutoApi: e })
    }
  }
  return (
    <Modal
      title='下载'
      visible={visible}
      closable={false}
      getContainer={document.getElementById('workspace')}
      centered
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <div className="share-modal">
        <Input prefix="页面标题" defaultValue={customList.title} onChange={e => onChange(e, 'title')} />
        <span>API地址根据部署环境自动获取<Switch onChange={e => onChangeSwitch(e, 'autoApi')} /></span>
        <span>自定义静态资源  <Switch onChange={e => onChangeSwitch(e, 'customUrl')} /></span>
        {/* {!isCustomUrl && <span>分享地址：http://172.16.128.31:9237/screen/iframe/productPreview.html?id={props.id}</span>} */}
        {isCustomUrl && (<Input prefix="静态资源地址" defaultValue={customList.url} onChange={e => onChange(e, 'url')} />)}


      </div>
    </Modal >
  )
}

export default ShareModal;
