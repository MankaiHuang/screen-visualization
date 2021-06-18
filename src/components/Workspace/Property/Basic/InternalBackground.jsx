import { Modal, Button, } from 'antd';
import { useState } from 'react';


import './index.less';


const InternalBackground = props => {
  const [visible, setVisible] = useState(true);
  function selectBackground (e) {
    props.submitBackground(e.target.src)
    handleCancel()
  }

  function handleCancel () {
    setVisible(false)
    props.closeBackgroundModal()
  };
  return (
    <Modal
      width="80%"
      title="请选择图片"
      getContainer={document.getElementById("workspace")}
      visible={visible}
      closable={false}
      onCancel={handleCancel}
      footer={[
        <Button type="primary" onClick={handleCancel}>
          关闭
          </Button>
      ]}
    >
      <div className="background-list">
        {[...Array(19)].map((item, index) => {
          return (
            <img onClick={selectBackground} src={require(`@/assets/background/background-${index + 1}.png`)} />
          )
        })}
      </div>
    </Modal>
  )
}
export default InternalBackground;
