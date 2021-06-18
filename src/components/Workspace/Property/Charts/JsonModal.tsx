import React, { useState, useEffect, useRef } from 'react';
import { Modal, message, Tabs } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import Excel from './Excel.jsx';

const { TabPane } = Tabs;

interface IJsonData {
    text: string;
    default: string;
}
interface IProps {
    jsonData: IJsonData;
    submitJson: Function;
    closeModal: Function;
    onPropertyChange: Function;
    property: object;
}

const JsonModal: React.FC<IProps> = ({ jsonData, submitJson, closeModal, onPropertyChange, property }) => {
    const [visible, setVisible] = useState<boolean>(true);
    const [index, setIndex] = useState<string>('1')
    const excelRef = useRef<any>(null); // Excel的ref
    const [dataIsJson, setDataIsJson] = useState<boolean>(false) // 进来的数据是json 则保存时判断格式是否正确
    const checkJsonIsCorrect = (value: any) => {
        // 检测json格式是否正确
        if (Object.prototype.toString.call(value) === '[object Array]' || !dataIsJson) return true
        try {
            JSON.parse(value)
            return true
        } catch (err) {
            message.error('JSON格式错误!');
            return false
        }
    }
    const handleOk = () => {
        if (index === '1') {
            if (checkJsonIsCorrect(jsonData.default)) {
                submitJson(jsonData)
                closeModal()
                setVisible(false)
            }
        } else if (index === '2') {
            excelRef.current.submit() // 通过ref执行子组件方法
        }

    };
    const handleCancel = e => {
        closeModal()
        setVisible(false)
    };
    const onChange = e => {
        Object.assign(jsonData, { default: e.getValue() })
    }
    const onTabsChange = e => {
        setIndex(e)
    }

    useEffect(() => {
        try {
            JSON.parse(jsonData.default)
            setDataIsJson(true)
        }
        catch (err) {
        }
    }, [])
    return (
        <Modal
            width="80%"
            title={jsonData.text}
            getContainer={document.getElementById("workspace")}
            visible={visible}
            centered
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Tabs defaultActiveKey={index} type="card" onChange={e => onTabsChange(e)}>
                <TabPane tab="代码模式" key="1">
                    <CodeMirror
                        value={jsonData.default}
                        onChange={e => { onChange(e) }}
                        options={{
                            theme: 'ayu-dark',
                            smartIndent: true,  // 是否智能缩进
                            keyMap: 'sublime',
                            lineNumbers: true,
                            mode: 'JavaScript',
                            autofocus: true,
                            lineWrapping: true,
                            foldGutter: true,
                            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                        }} />
                </TabPane>
                <TabPane tab="Excel模式" key="2">
                    <Excel ref={excelRef} onPropertyChange={onPropertyChange} property={property} jsonData={jsonData} closeExcel={handleCancel} />
                </TabPane>

            </Tabs>
        </Modal>
    )
}

export default JsonModal;