// 基于G6实现的蓝图编辑器 用于解决组件之间的深度定制交互问题
/*
element 连接点index对应功能:
sourceAnchor    功能
0               当数据接口请求完成时
1               请求数据接口
2               导入数据接口
3               更新组件配置
4               显示
5               隐藏
6               切换显隐状态
7               移动


interActive 连接点index对应功能:
sourceAnchor    功能
0               当数据接口请求完成时
1               当Tab切换时
2               请求数据接口
3               导入数据接口
4               更新组件配置
5               显示
6               隐藏
7               切换显隐状态
8               移动


judge 连接点index对应功能:
sourceAnchor    功能
0               满足
1               不满足
2               判断

dataHandler 连接点index对应功能:
sourceAnchor    功能
0               处理方法
1               接入
     
*/
import React, { useState, useEffect } from 'react';
import { Modal, Divider, Tooltip, Drawer, message } from 'antd';
import GGEditor, { Flow, Item, ItemPanel, Command, constants } from 'gg-editor';
import { createFromIconfontCN } from '@ant-design/icons';
import JudgeNode from '@/components/Workspace/BluePrint/Node/JudgeNode.jsx'
import ElementNode from '@/components/Workspace/BluePrint/Node/ElementNode.jsx'
import InterActiveNode from '@/components/Workspace/BluePrint/Node/InterActiveNode.jsx'
import DataHandlerNode from '@/components/Workspace/BluePrint/Node/DataHandlerNode.jsx'
import DetailPanel from '@/components/Workspace/BluePrint/DetailPanel'
import CustomEdge from '@/components/Workspace/BluePrint/Edge'
import upperFirst from 'lodash/upperFirst';
import { getGuid } from '@/utils/utils';
import styles from './BluePrint.less';

const { EditorCommand } = constants;
let graph = null
const IconFont = createFromIconfontCN({
  scriptUrl: 'https://at.alicdn.com/t/font_1518433_oa5sw7ezue.js',
});
const FLOW_COMMAND_LIST = [
  EditorCommand.Undo,
  EditorCommand.Redo,
  '|',
  EditorCommand.Copy,
  EditorCommand.Paste,
  EditorCommand.Remove,
  '|',
  EditorCommand.ZoomIn,
  EditorCommand.ZoomOut,
];
const branchModel = [{
  type: 'judge',
  label: '判断分支',
  icon: require('@/assets/bluePrint/judge.png'),
  img: require('@/assets/bluePrint/judgeMenu.png'),
  customFunction: 'return data.value==1'
}, {
  type: 'dataHandler',
  label: '串行数据处理',
  icon: require('@/assets/bluePrint/dataHandler.png'),
  img: require('@/assets/bluePrint/dataHandlerMenu.png'),
  customFunction: 'return data.value==1'
}]
let allNodeConfig = {
  judge: [],
  interActive: [],
  component: [],
  dataHandler: [],
} // 所有node数据

const elementAnchor = ['requestCompleted', 'requestData', 'importData', 'updateTemplate', 'show', 'hidden', 'changeVisible', 'move'];
const interActiveAnchor = ['requestCompleted', 'tabChange', 'requestData', 'importData', 'updateTemplate', 'show', 'hidden', 'changeVisible', 'move']
const judgeAnchor = ['judgeTrue', 'judgeFalse', 'enter']
const dataHandlerAnchor = ['leave', 'enter']
const BluePrint = (props) => {
  const [nodeData, setNodeData] = useState({
    nodes: [],
    edges: [],
  })
  const [detailsPanelVisible, setDetailsPanelVisible] = useState(false)
  const [nowJudge, setNowJudge] = useState({}) // 当前选中的judge数据
  const [menuModel, setMenuModel] = useState([]) // 菜单栏model
  useEffect(() => {
    // 过滤掉nodeData中已经存在的id
    const { exportIdList } = props.exportBluePrint
    const tempMenuModel = [...menuModel]
    exportIdList && exportIdList.forEach(item => {
      tempMenuModel.push({
        id: item.elementId,
        type: item.componentsType === 'pagination' ? 'interActive' : 'element',
        label: item.title || item.typeName || item.type,
        componentsType: item.componentsType,
        elementType: item.type,
        size: [100, 100],
        icon: require(`@/assets/templateImg/${item.type}.png`),
      })
    })
    allNodeConfig = props.exportBluePrint.allNodeConfig // 初始化配置
    setMenuModel(tempMenuModel)
    setNodeData(props.exportBluePrint.nodeData)
  }, [props.exportBluePrint])
  useEffect(() => {
    graph.on('afteritemstatechange', (ev) => {
      // 监听边拖到点上 	调用 graph.setItemState 方法之前触发
      graph.on('node:mouseup', () => {
        // 配合鼠标抬起事件 解决因为edge还在update的时候remove 导致崩溃
        if (ev.item?._cfg?.targetAnchorIndex) {
          const sourceNode = ev.item._cfg.sourceNode._cfg.model
          const { type, componentsType } = sourceNode
          const { sourceAnchorIndex } = ev.item._cfg
          if ((type === 'element' || type === 'interActive') && (componentsType === 'pagination' ? (sourceAnchorIndex !== 0 && sourceAnchorIndex !== 1) : sourceAnchorIndex !== 0)) {
            const nowEdgeId = ev?.item?._cfg?.model?.id
            if (nowEdgeId) {
              graph.removeItem(nowEdgeId)
              message.error('起始点不能为动作');
            }
          }
        } else {
          const targetNode = ev?.item?._cfg?.targetNode?._cfg?.model
          if (!targetNode) return;
          const { targetAnchorIndex } = ev.item._cfg
          if ((targetNode.type === 'element' || targetNode.type === 'interActive') && targetNode.componentsType === 'pagination' ? (targetAnchorIndex === 0 || targetAnchorIndex === 1) : targetAnchorIndex === 0) {
            const nowEdgeId = ev?.item?._cfg?.model?.id
            if (nowEdgeId) {
              graph.removeItem(nowEdgeId) // 删除线
              message.error('终点不能为事件');
            }
          }

        }
      })

    });
  }, [])
  const getActionNameByAnchor = (type, anchor) => {
    // 根据type和anchor获取actionName
    switch (type) {
      case 'element': return elementAnchor[anchor]
      case 'interActive': return interActiveAnchor[anchor]
      case 'judge': return judgeAnchor[anchor]
      case 'dataHandler': return dataHandlerAnchor[anchor]
      default:
        break;
    }
  }
  const findNodeById = (nodes, id) => {
    // 根据id查找node
    const result = nodes.find(item => {
      return item.id === id
    })
    return result
  }
  const findNodeConfigById = (id, type) => {
    // 根据id查找node
    const result = allNodeConfig[type].find(item => {
      return item.id === id
    })
    return result
  }
  const findEdgesById = (edges, id, type = "target") => {
    // 查找taget为id的所有edges type : target source
    const result = edges.map(item => {
      if (item[type] === id) {
        return item
      }
    })
    return result.filter(v => { return v })
  }
  const getStartNodeByEdges = (saveNodeData, edge) => {
    // 根据edge获取当前线条的起点(事件开始)
    const { sourceAnchor, source } = edge
    const sourceNode = findNodeById(saveNodeData.nodes, source)
    if ((sourceNode.type === 'element' || sourceNode.type === 'interActive') && (sourceNode.componentsType === 'pagination' ? (sourceAnchor === 0 || sourceAnchor === 1) : sourceAnchor === 0)) {
      // 起点是事件
      return sourceNode
    }

  }
  const targetNodeIsEnd = (node) => {
    // edge的 target是否为结尾(为element)
    if (node.type === 'element') {
      return true
    }
    return false;
  }
  const uniqueArray = (arr, type) => {
    const hash = {};
    let temp = []
    temp = arr.reduce(function (item, next) {
      hash[next[type]] ? '' : hash[next[type]] = true && item.push(next);
      return item
    }, [])
    return temp
  }
  const getSetNodeProperty = (id, type) => {
    const result = {}
    if (type === 'element' || type === 'interActive') {
      type = 'component'
    }
    const config = findNodeConfigById(id, type)// 获取Node的config
    config && config.property.forEach(property => {
      const { value } = property
      if (property.name === 'customFunction') {
        result[property.name] = `function adapter(data){${value}}`
      } else {
        result[property.name] = value
      }
    })
    return result
  }
  const getChildrenProperty = (saveNodeData, startNode) => {
    // 根据起始node获取所有连接的node
    const find = (node) => {
      const edgeSourceNode = findEdgesById(saveNodeData.edges, node.id, 'source')
      const result = edgeSourceNode.map(item => {
        const start = {
          id: node.id,
          type: node.type,
          property: { ...{}, ...getSetNodeProperty(node.id, node.type) },
        }

        const temp = []
        const nowTargetNode = findNodeById(saveNodeData.nodes, item.target)
        const sourceActionName = getActionNameByAnchor(node.type, item.sourceAnchor) // node出发的action
        if (!start[sourceActionName]) {
          start[sourceActionName] = []
        }
        const isEnd = targetNodeIsEnd(nowTargetNode) // 是否为结束node
        if (!isEnd) {
          const tempResult = find(nowTargetNode)
          if (tempResult.length > 0) {
            if (tempResult.length > 1) {
              const uniqueArr = [] // 相同id 不同事件进行合并
              tempResult.forEach((tep) => {
                const targetArr = uniqueArr.find(v => v.id === tep.id)
                if (targetArr) {
                  for (const i in tep) {
                    if (targetArr[i] && Object.prototype.toString.call(targetArr[i]) === '[object Array]') {
                      if (Object.prototype.toString.call(tep[i]) === '[object Array]') {
                        targetArr[i] = [...targetArr[i], ...tep[i]]
                      } else {
                        targetArr[i].push(tep[i])
                      }
                    }
                    else if (!targetArr[i]) {
                      targetArr[i] = tep[i]
                    }
                  }
                } else {
                  uniqueArr.push(tep)
                }
              })
              start[sourceActionName].push(uniqueArr)
            } else {
              start[sourceActionName].push(tempResult[0])
            }
          }
        } else {
          start[sourceActionName].push({
            id: nowTargetNode.id,
            type: nowTargetNode.type,
            property: { ...{}, ...getSetNodeProperty(nowTargetNode.id, nowTargetNode.type) },
            actionName: getActionNameByAnchor(nowTargetNode.type, item.targetAnchor) // 连接的action
          })
        }
        temp.push(start)
        return temp.flat(Infinity)
      })
      const uniqueArr = [] // 相同id 不同事件进行合并
      result.flat(Infinity).forEach((tep) => {
        const targetArr = uniqueArr.find(v => v.id === tep.id)
        if (targetArr) {
          for (const i in tep) {
            if (targetArr[i] && Object.prototype.toString.call(targetArr[i]) === '[object Array]') {
              if (Object.prototype.toString.call(tep[i]) === '[object Array]') {
                targetArr[i] = [...targetArr[i], ...tep[i]]
              } else {
                targetArr[i].push(tep[i].flat(Infinity))
              }
            } else if (!targetArr[i]) {
              targetArr[i] = tep[i]
            }
          }
        } else {
          uniqueArr.push(tep)
        }
      })
      return uniqueArr
    }
    const data = find(startNode)

    return data
  }

  const analysisNode = (saveNodeData) => {
    // 根据node数据获取用户需要表达的交互逻辑
    // 以事件开始动作结束为一条连接关系
    const result = []
    let startNodeList = []
    saveNodeData.edges.forEach(item => {
      const startNode = getStartNodeByEdges(saveNodeData, item); // 起始node
      startNode && startNodeList.push(startNode)

    })
    startNodeList = uniqueArray(startNodeList, 'id')
    startNodeList.forEach(item => {
      const singleResult = getChildrenProperty(saveNodeData, item) // 以当前起始node获取所有连接的下级
      result.push(singleResult)
    })
    return result.flat(Infinity)
  }
  const handleCancel = () => {
    props.closeBluePrint()
  };
  const handleOk = () => {
    const saveNodeData = graph.save(); // 保存当前蓝图编辑器数据
    // console.log(graph.getNodes());
    const result = analysisNode(saveNodeData)
    props.onPropertyChange({ path: 'bluePrintConfig', value: { analysisData: result, nodeData: saveNodeData, allNodeConfig } }, 'bluePrint', 'bluePrint')
    handleCancel()
  };
  const getNodeProperty = (type, id, name) => {
    /**
     * @name:  初始化node属性
     * @param {type 类型 id:id name:name }
     * @return {*}
     */
    const config = {
      id,
      type,
      name,
    }
    switch (type) {
      case 'judge':
      case 'dataHandler': {
        config.property = [{
          id: getGuid(),
          title: '请输入判断条件',
          name: 'customFunction',
          value: 'return data.value==1',
          type: 'codeMirror',
        }]
      }; break;
      case 'component': {
        config.property = [{
          id: getGuid(),
          title: '请输入移动步长',
          name: 'moveStep',
          actionName: 'move',
          value: 0,
          type: 'number'
        }, {
          id: getGuid(),
          title: '请输入更新组件代码',
          name: 'customFunction',
          actionName: 'updateTemplate',
          value: 'return {legend:{show:false}}',
          type: 'codeMirror'
        }, {
          id: getGuid(),
          title: '请输入请求数据函数',
          name: 'customFunction',
          actionName: 'requestData',
          value: 'return {type: data }',
          type: 'codeMirror'
        }, {
          id: getGuid(),
          title: '请输入导入数据函数',
          name: 'customFunction',
          actionName: 'importData',
          value: 'return data',
          type: 'codeMirror'
        }]
      }; break;
    }
    return config
  }

  const onSelectNode = (id) => {
    // 点击判断条件
    const saveNodeData = graph.save(); // 保存当前蓝图编辑器数据
    const clickNode = findNodeById(saveNodeData.nodes, id)
    let { type } = clickNode
    if (type === 'element' || type === 'interActive') {
      type = 'component'
    }

    const judgeIndex = allNodeConfig[type].findIndex(item => { return item.id === id })
    if (judgeIndex === -1) {
      // 不存在则新增
      const config = getNodeProperty(type, id, clickNode.label)
      setNowJudge(config)
      allNodeConfig[type].push(config)
    } else {
      // 存在则取出来直接用
      const nowProperty = allNodeConfig[type][judgeIndex].property
      if (type === 'component') {
        const nowNodeTargetEdges = findEdgesById(saveNodeData.edges, id)
        nowNodeTargetEdges.forEach(item => {
          const nowNodeActionName = getActionNameByAnchor(clickNode.type, item.targetAnchor)
          allNodeConfig[type][judgeIndex].property = nowProperty.filter(v => { return v.actionName === nowNodeActionName }) // 过滤掉没有选中的actionName属性
        })
      }

      setNowJudge(allNodeConfig[type][judgeIndex])
    }
    setDetailsPanelVisible(true)
  }
  const closeDetailPanel = () => {
    setDetailsPanelVisible(false)
  }


  const onNodePropertyChange = (value, id, type) => {
    nowJudge.property.some(item => {
      if (item.id === id) {
        item.value = value;
        return true
      }
    })
    setNowJudge(nowJudge)
    allNodeConfig[type].some(item => {
      if (item.id === nowJudge.id) {
        item = nowJudge
        return true;
      }
    })
  }
  return (
    <Modal
      width="90%"
      wrapClassName="bluePrintModal"
      visible
      closable={false}
      getContainer={document.getElementById('workspace')}
      centered
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <GGEditor id='GGEditor' >

        <div className={styles.toolbar}>
          {FLOW_COMMAND_LIST.map((name, index) => {
            if (name === '|') {
              return <Divider key={index} type="vertical" />;
            }
            return (
              <Command key={index} name={name} className={styles.command} disabledClassName={styles.commandDisabled}>
                <Tooltip title={upperFirst(name)} color="geekblue">
                  <IconFont type={`icon-${name}`} />
                </Tooltip>
              </Command>
            );
          })}
        </div>

        <ItemPanel className={styles.menu}>
          {menuModel.map((item, index) => {
            return (
              <Item
                key={index}
                className={styles.menuItem}
                model={item}
              >
                <img
                  src={item.icon}
                  className={styles.menuImg}
                  draggable={false}
                />
                <span>{item.label}</span>
              </Item>
            )
          })}

        </ItemPanel>
        <ItemPanel className={styles.itemPanel}>
          {branchModel.map((item, index) => {
            return (
              <Item
                key={index}
                className={styles.item}
                model={item}
              >
                <img
                  src={item.img}
                  className={styles.menuImg}
                  draggable={false}
                />
              </Item>
            )
          })}

        </ItemPanel>
        <Flow className={styles.flow} data={nodeData}
          customModes={(mode, behaviors) => {
            if (mode === 'default') {
              behaviors['drag-node'].enableDelegate = false; // 解决拖拽虚影bug
            }
            return behaviors;
          }}
          graphConfig={{
            defaultEdge: {
              shape: 'runningEdge', // 自定义edge
              style: {
                endArrow: {
                  path: 'M 0,0 L 20,10 L 20,-10 Z', // edge尾部箭头
                  d: 10,
                  fill: '#c2d7eb',
                  stroke: '#001529',
                  opacity: 0.5,
                  lineWidth: 1,
                },
              }
            },

          }
          }
          ref={component => {
            if (component) {
              graph = component.graph
            }
          }} />
        <Drawer
          width="350px"
          placement="right"
          closable={false}
          onClose={closeDetailPanel}
          visible={detailsPanelVisible}
          mask={false}
          className="bluePrint-detailPanel"
          getContainer={document.querySelector('.bluePrintModal .ant-modal-body')}
          bodyStyle={{ backgroundColor: "#292832" }}
        >
          <DetailPanel nowJudge={nowJudge} onNodePropertyChange={onNodePropertyChange} key={nowJudge.id} />
        </Drawer>
        <CustomEdge />
        <JudgeNode onSelectNode={onSelectNode} />
        <ElementNode onSelectNode={onSelectNode} />
        <InterActiveNode onSelectNode={onSelectNode} />
        <DataHandlerNode onSelectNode={onSelectNode} />
      </GGEditor>
    </Modal >
  )
}

export default BluePrint;