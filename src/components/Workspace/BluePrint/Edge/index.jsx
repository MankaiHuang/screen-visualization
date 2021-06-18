import React, { useState, useEffect } from "react";
import { RegisterEdge } from 'gg-editor';

const CustomEdge = (props) => {
  return (
    <RegisterEdge
      name="runningEdge"
      config={{
        afterDraw (cfg, group) {
          // get the first shape in the group, it is the edge's path here=
          const shape = group.get('children')[0];
          // the start position of the edge's path
          const startPoint = shape.getPoint(0);
          // add red circle shape
          const circle = group.addShape('circle', {
            attrs: {
              x: startPoint.x,
              y: startPoint.y,
              fill: '#F78236',
              r: 4,
            },
            name: 'circle-shape',
          });

          // edge上circle动画
          circle.animate(
            (ratio) => {
              // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
              // get the position on the edge according to the ratio
              const tmpPoint = shape.getPoint(ratio);
              // returns the modified configurations here, x and y here
              return {
                x: tmpPoint.x,
                y: tmpPoint.y,
              };
            },
            {
              repeat: true, // Whether executes the animation repeatly
              duration: 3000, // the duration for executing once
            },
          );
        },
        setState (name, value, item) {
          const shape = item.get('keyShape');
          if (item._cfg.states[0] === 'selected' || name === 'active') {
            if (value || item._cfg.states[0] === 'selected') {
              if (item._cfg.states[0] === 'selected') {
                shape.attr('stroke', '#F78236'); // 点击高亮的颜色
              } else if (value) {
                shape.attr('stroke', '#0941B3'); // 鼠标移入的颜色
              }
              shape.attr('lineWidth', 3);
            } else {
              shape.attr('stroke', '#c2d7eb');
              shape.attr('lineWidth', 1);
            }
          } else {
            shape.attr('stroke', '#c2d7eb');
            shape.attr('lineWidth', 1);
          }
        },
      }
      }
      extend="cubic-horizontal" />

  )
}


export default CustomEdge;
