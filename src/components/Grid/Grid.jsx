import React, { useState } from 'react';
import { connect } from 'dva';
import { router } from 'umi';

import ImageViewer from './imageViewer';
import './index.less';


const Grid = props => {
    const [modalData, setModalData] = useState({ showModal: false, modalId: '' }) // 设置弹窗id以及是否展示，id为空则为新建
    const [data, setData] = useState({
        previewVisible: false,
        insertBtn: true,
        previewImage: '',
        fileList: props.templateList
    })
    const createBlankScreen = async () => {
        // 新建空白模板
        props.setLoading(true)
        props.setLoading(false)
        router.push({
            pathname: '/workspace',
            query: { templateName: '123' }
        });
    }
    const copyScreen = async (id) => {
        // 根据id copy模板
        props.setLoading(true)
        const params = copyData.data
        const componentList = JSON.parse(JSON.stringify(params.componentList))
        params.componentList = []
        componentList.map(item => {
            params.componentList.push({ extend: item.extend })
        })
        params.name = `${params.name}_copy`
        params.extend.title = `${params.name}_copy`
        params.extend.description = params.description
        delete params.id
        delete params.createTime
        params.type = props.type
        props.setLoading(false)
        props.initData()

    }
    const deleteSelectedTemplate = async (id) => {
        // 删除模板
        data.fileList.splice(searchIndex(id), 1)
        props.initData()
    }
    const openModal = (id = '') => {
        setModalData({
            showModal: true,
            id,
        })
    }
    const close = (values = '', id = '') => {
        if (values !== '') {
            addTemplate(values)
        }
        setModalData({
            showModal: false,
            id,
        })
    }
    function addTemplate (values) {
        data.fileList.unshift({ id: values.id, name: values.name, preview: values.preview, description: values.extend && values.extend.description, _public:values._public})
    }
    function searchIndex (id) {
        return data.fileList.findIndex(item => {
            return item.id === id
        })
    }
    return (
        <div className="screen">
           <ImageViewer files={data.fileList} isPrivate={props.isPrivate} isSystemTemplate={props.isSystemTemplate}
                copyScreen={copyScreen} createBlankScreen={createBlankScreen} deleteSelectedTemplate={deleteSelectedTemplate} openModal={openModal} />

        </div>
    );
}
export default Grid;