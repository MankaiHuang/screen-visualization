/*
 * @Descripttion:
 * @Author: cbz
 * @Date: 2020-06-02 14:09:18
 * @LastEditors: cbz
 * @LastEditTime: 2021-03-18 16:45:34
 */
// name必须唯一 循环是作为key使用
const allComponents = {
    charts: {
        label: '图表',
        opts: [{
                label: '饼图',
                type: 'pie',
                value: [
                    { type: 'pie', name: '饼图' },
                    { type: 'circlePie', name: '环形饼图' },
                    { type: 'circleRadiusPie', name: '圆角环形饼图' },
                    { type: 'percentPie', name: '百分比饼图' },
                    { type: 'percent2Pie', name: '百分比透明' },
                    { type: 'percent3Pie', name: '百分比高亮' },
                    { type: 'rosePie', name: '玫瑰饼图' },
                    { type: 'roseHalfPie', name: '玫瑰半边饼图' },
                    { type: 'rotateColorful', name: '旋转多彩图' },
                ],
            },
            {
                label: '柱状图',
                type: 'bar',
                value: [
                    { type: 'bgBar', name: '带背景色柱状图' },
                    { type: 'bar', name: '普通柱状图' },
                    { type: 'stackBar', name: '堆叠柱状图' },
                    { type: 'singleBar', name: '渐变色柱状图' },
                    { type: 'mulityHorBar', name: '多根条形图' },
                    { type: 'singleHorBar', name: '单根条形图' },
                    { type: 'stackHorBar', name: '堆叠条形图' },
                ],
            },
            {
                label: '折线图表',
                type: 'line',
                value: [
                    { type: 'basicLine', name: '基础折线图' },
                    { type: 'line', name: '平滑折线图' },
                    { type: 'stackLine', name: '堆叠面积图' },
                    { type: 'notSmoothLine', name: '渐变折线图' },
                    { type: 'dataZoomLine', name: '时间轴折线图' },
                    { type: 'lineAndBar', name: '折柱混合图' },
                ],
            },
            {
                label: '词云',
                type: 'textCloud',
                value: [{ type: 'textCloud', name: '词云' }, { type: 'textCloud1', name: '乱序词云' }],
            },
            {
                label: '地图',
                type: 'echartsMap',
                value: [{ type: 'area', name: '区域图表' }, { type: 'runInMap', name: '下钻地图' }, { type: 'cityMap', name: '城市地图' }, { type: 'areaPoint', name: '地图线图' }],
            },
            {
                label: '其它图表',
                type: 'other',
                value: [{ type: 'dot', name: '离散点图' },
                    { type: 'dashBoard', name: '仪表盘' }, { type: 'funnel', name: '漏斗分析图' }
                ],
            },


        ],
    },
    L7: {
        label: '3D',
        opts: [{
                label: '3D城市',
                type: 'city',
                value: [{ type: 'flyLine', name: '飞线图' }, { type: 'lineCity', name: '线轨迹图' },
                    { type: 'lightCity', name: '点亮城市' }, { type: 'heatCity', name: '经典热力图' }, { type: 'heatGridCity', name: '网格热力图' },
                    { type: 'columnCity', name: '3d柱状图' },
                    { type: 'pointerCity', name: '海量点地图' }, { type: 'popCity', name: '动态气泡图' }
                ],
            },

            {
                label: '3D地球',
                type: 'earth',
                value: [{ type: 'basicEarth', name: '基础地球' }, { type: 'lineEarth', name: '飞线地球' }, { type: 'scatterEarth', name: '散点地球' }, { type: 'lineAndScatterEarth', name: '线点结合地球' }, ],
            },
            // {
            //   label: '3D球形地图',
            //   type: 'cesiumEarth',
            //   value: [{ type: 'cesium', name: 'cesium' }, { type: 'smartCity', name: '智慧城市' }],
            // },
            {
                label: 'three应用',
                type: 'three',
                value: [{ type: 'spaceTime', name: '穿越时空' }],
            },
            {
                label: '波浪粒子',
                type: 'wave',
                value: [{ type: 'wave', name: '波浪粒子' }],
            },

        ],
    },
    list: {
        label: '列表',
        opts: [{
            label: '列表',
            type: 'list',
            value: [{ type: 'list', name: '列表' }, { type: 'listStatus', name: '带图列表' }, { type: 'listAndDetails', name: '详情列表' }, { type: 'listAnimation', name: '列表轮播' },
                { type: 'listNoHeader', name: '无表头轮播' }, { type: 'sigleList', name: '单行列表' }, { type: 'noIndexList', name: '无序列表' },
                { type: 'noAnimation', name: '无动画列表' }, { type: 'capsuleList', name: '胶囊列表' }, { type: 'topList', name: '排行列表' },
                { type: 'checkList', name: '审核列表' }, { type: 'cardList', name: '卡片列表' }, { type: 'listAndDetailsAnimation', name: '列表详情轮播' }, { type: 'listAndImg', name: '列表图片轮播' }, { type: 'flowList', name: '流程列表' },
                { type: 'staffMix', name: '人员占比图' }, { type: 'flashCloud', name: '闪动云' }, { type: 'sinaRank', name: '司南排名图' }, { type: 'dynamicList', name: '动态列表' },
                { type: 'pyramid', name: '金字塔' }, //  { type: 'table', name: '表格' }
            ],
        }, ],
    },
    pagination: {
        label: '联动',
        opts: [{
                label: 'Tab分页',
                type: 'tabs',
                value: [{ type: 'tab', name: 'Tab分页' }, { type: 'tab1', name: 'Tab分页1' }],
            },
            {
                label: '分页',
                type: 'pagination',
                value: [{ type: 'pagination', name: '分页' }],
            },
            {
                label: '时间选择器',
                type: 'datePicker',
                value: [{ type: 'datePicker', name: '时间选择器' }, ],
            }, {
                label: '下拉菜单',
                type: 'dropDown',
                value: [{ type: 'dropDown', name: '下拉菜单' }, ],
            },
        ],
    },
    element: {
        label: '常用组件',
        opts: [{
                label: '常用组件',
                type: 'element',
                value: [{ type: 'empty', name: '空组件' }, { type: 'text', name: '文字' }, { type: 'iframe', name: '内置iframe' },
                    { type: 'weather', name: '实时天气' },
                    { type: 'number', name: '数字' }, { type: 'bubble', name: '动态气泡' },
                    { type: 'tag', name: '标签' },
                    { type: 'avatar', name: '头像' },
                    { type: 'image', name: '图片' },
                    { type: 'video', name: '视频' },
                    { type: 'icon', name: 'icon图标' },
                    { type: 'dashBoardImg', name: '仪表盘' },
                    { type: 'rotateEarth', name: '旋转地球' },
                ],
            },
            {
                label: '大屏页面',
                type: 'screen',
                value: [{ type: 'dataContainer', name: '内容库列表' }],
            },
            {
                label: '卡片',
                type: 'card',
                value: [{ type: 'basicCard', name: '基础卡片' }, { type: 'imgCard', name: '带图卡片' }],
            },
            {
                label: '步骤条',
                type: 'step',
                value: [{ type: 'progress', name: '流程图' }, { type: 'steps', name: '垂直步骤条' }, { type: 'stepsHor', name: '水平步骤条' }],
            },
        ],
    },
    border: {
        label: '边框',
        opts: [{
            label: '边框',
            type: 'border',
            value: [{ type: 'border1', name: '边框1' }, { type: 'border2', name: '边框2' }, { type: 'border3', name: '边框3' }, { type: 'border4', name: '边框4' }, { type: 'border5', name: '边框5' }, { type: 'border6', name: '边框6' }, { type: 'border7', name: '边框7' }, { type: 'border8', name: '边框8' }, { type: 'border9', name: '边框9' }, { type: 'border10', name: '边框10' }, { type: 'border11', name: '边框11' }, { type: 'border12', name: '边框12' }, { type: 'border13', name: '边框13' },
                { type: 'border14', name: '边框14' }, { type: 'border15', name: '边框15' }, { type: 'border16', name: '边框16' }, { type: 'border17', name: '边框17' }, { type: 'border18', name: '边框18' }, { type: 'border19', name: '边框19' }, { type: 'border20', name: '边框20' }
            ],
        }, ],
    },
    decoration: {
        label: '装饰',
        opts: [{
            label: '装饰',
            type: 'decoration',
            value: [{ type: 'decoration1', name: '装饰1' }, { type: 'decoration2', name: '装饰2' }, { type: 'decoration3', name: '装饰3' }, { type: 'decoration4', name: '装饰4' }, { type: 'decoration5', name: '装饰5' }, { type: 'decoration6', name: '装饰6' }, { type: 'decoration7', name: '装饰7' }, { type: 'decoration8', name: '装饰8' }, { type: 'decoration9', name: '装饰9' }, { type: 'decoration10', name: '装饰10' }, { type: 'decoration11', name: '装饰11' },
                { type: 'decoration12', name: '装饰12' }, { type: 'decoration13', name: '装饰13' }, { type: 'decoration14', name: '装饰14' }, { type: 'decoration15', name: '装饰15' }, { type: 'decoration16', name: '装饰16' }, { type: 'decoration17', name: '装饰17' }, { type: 'decoration18', name: '装饰18' }
            ],
        }, ],
    },
    // private: {
    //     label: '页面组件',
    //     type: 'private',
    //     opts: [],
    // },

};
export default allComponents;