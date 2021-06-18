import { Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import { } from '@ant-design/icons';

import './index.less';
import menuConfig from '@/components/Workspace/Property/Charts/menuConfig.js';
import { ITemplateList } from '@/interface/index.tsx';
import SelectMap from '@/components/Workspace/SelectMap/index.tsx';
import elementList from './elementList.js';
import allComponents from './allComponents.js';

const { SubMenu } = Menu;

interface IProps {
  effectFrame: Function;
}
interface ISelectProperty {
  width: number;
  height: number;
  option: object;
}
interface IClickComponent {
  type: string;
  typeName: string;
  secondType: string;
}

const TopDrawer: React.FC<IProps> = ({ effectFrame }) => {
  const [privateList, setPrivateList] = useState<ITemplateList>([])
  const [isVisibleAi, setIsVisibleAi] = useState<Boolean>(false)
  const [isVisibleMap, setIsVisibleMap] = useState<Boolean>(false)
  const [clickComponent, setClickComponent] = useState<IClickComponent>({ type: '', secondType: '', typeName: '' }) // 点击选择的组件类型
  useEffect(() => {
    async function fetchData() {
   
      setPrivateList([])
     
    }
    fetchData();
  }, [])

  async function insertElement(type: string, key: string, secondType: string, optionData: ITemplateList, typeName: string = '') {
    // type 是具体类型 key是组件分类名
    if (type === 'smartCity') {
      setIsVisibleMap(true)
      setClickComponent({
        type,
        secondType,
        typeName,
      })
    }
    else {
      let option: ITemplateList;
      option = elementList[type]
      afterSelect(option, key, type, secondType, typeName)
    }

  }
  function afterSelect(option: ITemplateList, componentsType: string, type: string, secondType: string, typeName: string) {
    // 选择组件之后的处理
    const baseConfig = getBaseConfig();
    let selectProperty: ISelectProperty = { width: 0, height: 0, option: [] };
    if (componentsType === 'private') {
      const originBasic: ITemplateList['extend'] = option.extend;
      // originBasic = option.extend
      originBasic.preview = option.preview // 图层需要preview作为组件图片显示
      const tempOption = { templateList: [], baseConfig: option.extend, data: option.extend.data }
      option.componentList.map(item => {
        // 重新生成id
        // item.extend.property.elementId = guid()
        tempOption.templateList.push(item.extend)
      })
      selectProperty.option = tempOption;
      Object.assign(selectProperty, ...baseConfig);
      selectProperty = { ...selectProperty, ...originBasic }
    } else {
      selectProperty.option = option;
      Object.assign(selectProperty, ...baseConfig);
      selectProperty.width = fixWidth(type); // 初始化宽高 解决首次新增拖拽超出限制的问题
      selectProperty.height = fixHeight(type);
    }

    effectFrame({
      command: 'append',
      type,
      componentsType,
      secondType,
      typeName,
      property: selectProperty,
    });
  }
  function getBaseConfig() {
    const baseConfig: Array<Object> = [];
    menuConfig[0].opts.map(item => {
      baseConfig.push({ [item.name]: item.default });
    });
    menuConfig[2].opts.map(item => {
      baseConfig.push({ [item.name]: item.default });
    });
    return baseConfig;
  }

  function fixWidth(type: string): number {
    switch (type) {
      case 'bubble':
        return 300;
      case 'icon':
        return 50;
      case 'avatar':
        return 300;
      case 'tag':
        return 100;
      case 'text':
        return 150;
      case 'table':
        return 700;
      case 'imgCard':
        return 400;
      case 'listAnimation':
        return 1800;
      case 'listAndDetailsAnimation':
        return 1700;
      default:
        return 400;
    }
  }
  function fixHeight(type: string): number {
    switch (type) {
      case 'bubble':
        return 300;
      case 'icon':
        return 50;
      case 'avatar':
        return 300;
      case 'tag':
        return 100;
      case 'text':
        return 100;
      case 'table':
        return 311;
      case 'imgCard':
        return 600;
      case 'listAnimation':
        return 850;
      case 'listAndDetailsAnimation':
        return 900;
      default:
        return 300;
    }
  }
  function closeAiChart() {
    setIsVisibleAi(false)
  }
  function closeMap() {
    setIsVisibleMap(false)
  }
  function renderMenu() {
    return (
      <React.Fragment>
        <Menu mode="horizontal" className="topMenu" theme="dark" >
          {Object.keys(allComponents).map(key => {
            // key 为所有组件的类型
            const { opts } = allComponents[key];
            return (
              <SubMenu
                className="menu-list"
                key={key}
                title={allComponents[key].label}
                icon={<img src={require(`@/assets/icon/${key}.png`)} alt="img" />}
              >
                {opts.map((item) => {
                  return (
                    <Menu.ItemGroup key={item.label} title={item.label} className="listMenu" >
                      {renderDrawerContent(item.value, key, item.type)}
                    </Menu.ItemGroup>
                  );
                })}
              </SubMenu>
            );
          })}
        </Menu>
        {isVisibleMap && (<SelectMap closeMap={closeMap} option={elementList[clickComponent.type]} clickComponent={clickComponent} afterSelect={afterSelect} />)}
      </React.Fragment>

    );
  }
  function renderDrawerContent(componentsList: Array<{ type: string; name: string; preview: string }>, key: string, secondType: string) {
    // 渲染下拉的组件
    return componentsList.map((item, index) => {
      const { type, name, preview } = item
      return (
        <Menu.Item
          key={name + index}
          onClick={e => insertElement(type, key, secondType, null, name, secondType)}
          className="subMenuItemTemplate"
        >
          {key !== 'private' ? (<img className="templateImg" src={require(`@/assets/templateImg/${type}.png`)} alt="图片" />) : (<img className="templateImg" src={preview} alt="图片" />)}
          <p> {name}</p>
        </Menu.Item>
      );
    });
  }
  return renderMenu();
}

export default TopDrawer;
