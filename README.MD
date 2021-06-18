### 简介
一款通过拖拽组件方式快速生成大屏页面的工具


### 运行命令

yarn 安装依赖
在 public/iframe/preview.html 开启服务, 开启的地址,建议使用 live server 开启,要替换到指定位置 默认为http://127.0.0.1:5500
const iframeIp =
  process.env.NODE_ENV == 'development' ? 'http://127.0.0.1:5500' : window.location.origin;
yarn dev

### 打包命令

yarn build
