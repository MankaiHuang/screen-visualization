import React, { useState } from 'react';
import { connect } from 'dva';
import { CopyOutlined, DeleteOutlined, EyeOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Image, Tooltip, Modal,message } from 'antd';
import './index.less'
import { router } from 'umi';

import { getGuid } from '@/utils/utils';
const isAdmin = localStorage.getItem('userRole') === 'admin' ? true : false;//模板的编辑和删除权限
const { confirm } = Modal;
function ImageView(props) {
  const { handlePreview } = props;
  const [files, setFiles] = useState(props.files || []);
  console.log(files)
  const [visiblePreview, setVisiblePreview] = useState(false)
  function imgClick(item) {
    handlePreview(item)
  }
  function openModal() {
    props.openModal()
  }
  function createBlankScreen() {
    props.createBlankScreen()
  }
  const goEdit = id => {
    if(!id){
      message.error('系统模板不可编辑')
      return;
    }
    router.push({
      pathname: '/workspace',
      query: { templateName: id }
    });
  }
  const copyScreen = id => {
    props.copyScreen(id)
  }
  const getType = () => {
    if (props.isSystemTemplate) {
      return '模板'
    } if (props.isPrivate) {
      return '组件'
    }
    return '大屏'

  }
  const deleteScreen = id => {
    confirm({
      title: `确定删除此${getType()}？此操作不可逆！`,
      getContainer: document.getElementById("workspace"),
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      okButtonProps: {
        ghost: true
      },
      maskClosable: true,
      mask: true,
      cancelText: '取消',
      cancelButtonProps: {
        ghost: true
      },
      onOk() {
        props.deleteSelectedTemplate(id)
      },
      onCancel() { },
    });
  }
  const preview = id => {
    if (process.env.NODE_ENV === 'development') {
      window.open(`http://127.0.0.1:5500/public/iframe/productPreview.html?id=${id}`) // 仅在线上生效
    } else {
      window.open(`${window.location.origin}/screen/iframe/productPreview.html?id=${id}`) // 仅在线上生效

    }
  }
  return (
    <div className='image-viewer'>
      <div className="card-container">
        {!props.isPrivate && (<div className="picture-card add-new">
          <div className="top" onClick={createBlankScreen}>
            <h3>{`新建${getType()}`}</h3>
          </div>
          {/* <div className="bottom" onClick={() => openModal()}>
            <h3>使用模板创建</h3>
          </div> */}
        </div>)}
        {files.map((item) => {
          return (
            <div key={item.id || getGuid()} className="picture-card box">
              <div className="ant-upload-list-item-info">
                <Image src={item.preview || 'error'} key={item.visiblePreview || false} className="ant-upload-list-item-image"
                  preview
                  placeholder={
                    <Image
                      style={{ filter: 'blur(5px)' }}
                      src={item.preview || 'error'}
                    />
                  }
                  fallback={require('@/assets/common/img.png')} />
                <div className="box2">
                  {(!isAdmin && item._public == 0) && <p className="sysBox" onClick={e => goEdit()}>编辑</p>}
                  {(isAdmin || item._public == 1) && <p onClick={e => goEdit(item.id)}>编辑</p>}
                  <h3>{item.description || '暂无描述'}</h3>
                  <div className="screen-tools">
                    <Tooltip placement="bottom" title="复制" color="geekblue">
                      <CopyOutlined onClick={e => copyScreen(item.id)} />
                    </Tooltip>
                    {(isAdmin || item._public == 1) && <Tooltip placement="bottom" title="删除" color="geekblue">
                      <DeleteOutlined onClick={e => deleteScreen(item.id)} />
                    </Tooltip>}
                    <Tooltip placement="bottom" title="预览" color="geekblue">
                      <EyeOutlined onClick={e => preview(item.id)} />
                    </Tooltip>
                  </div>

                </div>
                <div className='img-title'>
                  <span>{item.name}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ImageView;