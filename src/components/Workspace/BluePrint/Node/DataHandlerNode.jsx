import React, { useState, useEffect } from "react";
import { RegisterNode, setAnchorPointsState } from 'gg-editor';

const DataHandlerNode = (props) => {
  return (
    <RegisterNode
      name="dataHandler"
      config={{
        draw: (cfg, group) => {
          const shape = group.addShape('rect', {
            draggable: true,
            attrs: {
              x: 0,
              y: 0,
              width: 140,
              height: 70,
              fill: "#139B00", // 填充色
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
              x: 5,
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
          // 里面的那层
          group.addShape('rect', {
            draggable: true,
            attrs: {
              x: 0,
              y: 30,
              width: 140,
              height: 40,
              fill: '#0E7700', // 填充色
              radius: 0,
              cursor: 'move'
            },
          });
          // 处理方法
          group.addShape('text', {
            draggable: true,
            attrs: {
              textAlign: 'left',
              y: 55,
              x: 20,
              text: '处理方法',
              fill: '#fff',
              cursor: 'move',
            },
          });
          return shape;
        },
        setState (name, value, item) {
          const group = item.getContainer();
          const shape = group.get('children')[0]; // 顺序根据 draw 时确定
          if (name === 'selected') {
            if (value) {
              props.onSelectNode(item._cfg.id) // 回传选中的id
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
                stroke: '#29BECE',
                cursor: 'pointer',
              };
            },

          );
        },
        getAnchorPoints () {
          return [
            [1, 0.65],
            [0, 0.65],
          ];
        },
      }
      }
      extend="rect" />

  )
}


export default DataHandlerNode;
