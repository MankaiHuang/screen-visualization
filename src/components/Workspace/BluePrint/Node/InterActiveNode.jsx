import React, { useState, useEffect } from "react";
import { RegisterNode, setAnchorPointsState } from 'gg-editor';

const InterActiveNode = (props) => {
  return (
    <RegisterNode
      name="interActive"
      config={{
        draw: (cfg, group) => {
          let eventName = null
          switch (cfg.elementType) {
            case 'tab':
            case 'tab1': {
              eventName = '当Tab切换时'
            }; break;
            case 'pagination': {
              eventName = '当切换页面时'
            }; break;
            case 'datePicker': {
              eventName = '当选中时间时'
            }; break;
            case 'dropDown': {
              eventName = '当选择选项时'
            }; break;
          }

          const shape = group.addShape('rect', {
            draggable: true,
            attrs: {
              x: 0,
              y: 0,
              width: 150,
              height: 360,
              fill: "#262C33", // 填充色
              shadowColor: '#000',
              shadowBlur: 10,
              radius: 0,
              cursor: 'move'
            },
          });
          // 顶部图标
          group.addShape('image', {
            draggable: true,
            attrs: {
              textAlign: 'left',
              y: 0,
              x: 10,
              width: 20,
              height: 20,
              img: cfg.icon,
              cursor: 'move'
            },
          });
          // 顶部标题
          group.addShape('text', {
            draggable: true,
            attrs: {
              textAlign: 'left',
              y: 20,
              x: 30,
              text: cfg.label,
              fill: '#fff',
              fontSize: 16,
              cursor: 'move'
            },
          });
          // 事件
          group.addShape('text', {
            draggable: true,
            attrs: {
              textAlign: 'left',
              y: 45,
              x: 10,
              text: '事件',
              fill: '#6D7A85',
              fontSize: 14,
              cursor: 'move'
            },
          });
          // 里面的那层
          group.addShape('rect', {
            draggable: true,
            attrs: {
              x: 0,
              y: 50,
              width: 150,
              height: 310,
              fill: '#1D2126', // 填充色
              lineWidth: 0,
              cursor: 'move'
            },
          });
          // 当数据接口请求完成时
          group.addShape('text', {
            draggable: true,
            attrs: {
              textAlign: 'left',
              y: 75,
              x: 10,
              text: '当数据接口请求完成时',
              fill: '#c2d7eb',
              cursor: 'move'
            },
          });
          // eventName
          group.addShape('text', {
            draggable: true,
            attrs: {
              textAlign: 'left',
              y: 105,
              x: 10,
              text: eventName,
              fill: '#c2d7eb',
              cursor: 'move'
            },
          });
          // 动作的边
          group.addShape('rect', {
            draggable: true,
            attrs: {
              x: 0,
              y: 115,
              width: 150,
              height: 30,
              fill: '#262C33', // 填充色
              cursor: 'move'
            },
          });
          // 动作
          group.addShape('text', {
            draggable: true,
            attrs: {
              textAlign: 'left',
              y: 138,
              x: 10,
              text: '动作',
              fill: '#6D7A85',
              fontSize: 14,
              cursor: 'move'
            },
          });

          // 请求数据接口
          group.addShape('text', {
            draggable: true,
            attrs: {
              textAlign: 'left',
              y: 170,
              x: 10,
              text: '请求数据接口',
              fill: '#c2d7eb',
              cursor: 'move'
            },
          });
          // 导入数据接口
          group.addShape('text', {
            draggable: true,
            attrs: {
              textAlign: 'left',
              y: 200,
              x: 10,
              text: '导入数据接口',
              fill: '#c2d7eb',
              cursor: 'move'
            },
          });
          // 更新组件配置
          group.addShape('text', {
            draggable: true,
            attrs: {
              textAlign: 'left',
              y: 230,
              x: 10,
              text: '更新组件配置',
              fill: '#c2d7eb',
              cursor: 'move'
            },
          });
          // 显示
          group.addShape('text', {
            draggable: true,
            attrs: {
              textAlign: 'left',
              y: 260,
              x: 10,
              text: '显示',
              fill: '#c2d7eb',
              cursor: 'move'
            },
          });
          // 隐藏
          group.addShape('text', {
            draggable: true,
            attrs: {
              textAlign: 'left',
              y: 290,
              x: 10,
              text: '隐藏',
              fill: '#c2d7eb',
              cursor: 'move'
            },
          });
          // 切换显隐状态
          group.addShape('text', {
            draggable: true,
            attrs: {
              textAlign: 'left',
              y: 320,
              x: 10,
              text: '切换显隐状态',
              fill: '#c2d7eb',
              cursor: 'move'
            },
          });
          // 移动
          group.addShape('text', {
            draggable: true,
            attrs: {
              textAlign: 'left',
              y: 350,
              x: 10,
              text: '移动',
              fill: '#c2d7eb',
              cursor: 'move'
            },
          });
          return shape;
        },
        setState (name, value, item) {
          const group = item.getContainer();
          const shape = group.get('children')[0]; // 顺序根据 draw 时确定
          if (name === 'selected') {
            if (value) {
              props.onSelectNode(item._cfg.id) // 点击组件
              shape.attr('stroke', '#F78236 ');
              shape.attr('lineWidth', 3)
            } else {
              shape.attr('stroke', '');
            }
          }
          setAnchorPointsState.call(
            this,
            name,
            value,
            item,
            (item, anchorPoint) => {
              const { width, height } = item.getKeyShape().getBBox();

              const [x, y] = anchorPoint;
              return {
                x: width * x,
                y: height * y,
                r: 5, // 连接点的半径
                lineWidth: 3,
                fill: 'transparent',
                stroke: '#F78236',
                cursor: 'pointer',
              };


            },

          );
        },
        getAnchorPoints () {
          return [
            [1, 0.18],
            [1, 0.27],
            [0, 0.45],
            [0, 0.45 + 1 * 0.084],
            [0, 0.45 + 2 * 0.084],
            [0, 0.45 + 3 * 0.084],
            [0, 0.45 + 4 * 0.084],
            [0, 0.45 + 5 * 0.084],
            [0, 0.45 + 6 * 0.084],
          ];
        },
      }
      }
      extend="rect" />

  )
}


export default InterActiveNode;
