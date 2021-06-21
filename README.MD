### 简介
一款通过拖拽组件方式快速生成大屏页面的工具，组件可以自定义样式，颜色，背景色，入出场动画，数据等。
数据支持静态数据，Excel 上传生成数据，API 接口拉取，SSE 接口拉取。

### 文档
[官方操作文档地址](https://www.yuque.com/docs/share/e4c9ecdc-4c34-418b-a0c2-d6024463b971?#)

### 效果图
![image](https://user-images.githubusercontent.com/31394482/122701508-fb13f200-d27f-11eb-9dcd-22df5870b68b.png)
![image](https://user-images.githubusercontent.com/31394482/122700043-20ebc780-d27d-11eb-9828-60d1cefd2139.png)
![image](https://user-images.githubusercontent.com/31394482/122700421-d3238f00-d27d-11eb-84cc-1d4bce6e4b35.png)
![image](https://user-images.githubusercontent.com/31394482/122700041-20ebc780-d27d-11eb-94d9-a73762a33897.png)
![image](https://user-images.githubusercontent.com/31394482/122700234-758f4280-d27d-11eb-9848-6982a007ccb6.png)
![image](https://user-images.githubusercontent.com/31394482/122700436-d9197000-d27d-11eb-8989-67f776a61f46.png)
![image](https://user-images.githubusercontent.com/31394482/122700458-e8002280-d27d-11eb-8fcb-9b718589b946.png)
![image](https://user-images.githubusercontent.com/31394482/122700480-f1898a80-d27d-11eb-87fe-3291051d7a7f.png)
![image](https://user-images.githubusercontent.com/31394482/122700497-f9e1c580-d27d-11eb-8efa-c76153b51083.png)
![image](https://user-images.githubusercontent.com/31394482/122700517-00703d00-d27e-11eb-9e94-4b2b54cf088d.png)

### 功能简介
1. 支持 Echarts 饼图、折线图、柱状图、词云，地图、漏斗图、离散分析图、仪表盘等组件。
2. 支持二十中列表样式，并可自定义列表样式，支持颜色、字体、字号、字间距等属性设置。
3. 支持 3D 地图组件，如飞线图，网络热力图，气泡图、海量点图、点亮城市、3D 柱状图，轨迹图等。地图数据可以通过 excel 导入一键生成。
4. 支持联动组件，如 Tab 切换、分页、时间选择器、下拉菜单等。可通过蓝图添加交互逻辑。
5. 支持图片、实时天气、卡片、图标、气泡、视频、头像等无分类组件。
6. 支持二十多种内置边框。
7. 通过将组件导出到蓝图编辑器内，对组件进行一些事件，动作的连线添加交互并添加一点点代码即可完成复杂的组件之间的交互逻辑。[详情文档](https://www.yuque.com/docs/share/7c6a6e67-fcd5-4e42-8642-91d8dce87b30?#)
8. 编辑完成的组件可通过下载按钮一键生成 html 文件，点击即可打开（js 静态资源需引入外网地址或本地资源地址）。[文档](https://www.yuque.com/docs/share/cca41589-1543-4c66-88ba-6b8036ec64b3?#)
9. 支持组件编组、取消编组操作，同一组的组件支持一起拖拽移动，支持一键上下左右居中对齐。
10. 支持一键换肤功能，用户可使用内置色盘或自行上传图片分析图片主色调获取色盘，并可一键对画布中所有组件进行上色，保持风格一致。[文档](https://www.yuque.com/docs/share/a329009c-4178-437b-b3e2-281f7971020f?#)
11. 支持一键美化功能，可一键对画布内组件添加边框和 title。[文档](https://www.yuque.com/docs/share/19051cdd-17c1-4db8-8f18-585f797c69a3?#)
12. 支持逆向操作，可将用户下载的 html 页面重新还原为可编辑的项目。[文档](https://www.yuque.com/docs/share/e8fb0d00-1069-40e2-9b86-794e9f0516e3?# )
13. 支持多工作区操作，可设置多个页面进行左右切换（类似轮播图）。
14. 下载的大屏页面支持任何分辨率查看，会根据分辨率不同切换显示逻辑，在保整页面不变形的情况下尽可能显示更多内容。[文档](https://www.yuque.com/docs/share/f6b3b0b7-1b53-4ebb-a3e1-0cddc51f7da8?# )



### 如何运行

yarn 安装依赖（npm 可能会出现问题）
yarn dev (npm start) 启动项目

 **！！！！！注意！！！！！**
 **在 public/iframe/preview.html 开启服务开启的地址并查看地址（建议使用 live server），获取地址后将找到/src/pages/Workspace/index.js 下的 iframeIp和iframeUrl，并修改地址。**
 
```javascript
const iframeIp = process.env.NODE_ENV == 'development' ? 'http://127.0.0.1:5500' : window.location.origin;
const iframeUrl = process.env.NODE_ENV == 'development' ? 'http://127.0.0.1:5500/public/iframe/preview.html' : './iframe/preview.html';
```
