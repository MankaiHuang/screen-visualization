/*
 * @Descripttion: 
 * @Author: cbz
 * @Date: 2020-08-07 11:50:19
 * @LastEditors: cbz
 * @LastEditTime: 2021-03-26 15:33:58
 */
// 若想使用下拉select 需要将变量命名格式改为:
/*
  selectXXXX:{ // 必须select开头
    default:'xx', // select默认选中的值
    option:[{label:'xx',value:'xx'}] // select下拉的option
  }
  以color结尾的为颜色选择器
  以fontSize结尾的为字号分组
*/
function randomNum() {
    return Math.round(Math.random() * 100);
}
// 获取随机颜色
function getRandomColor() {
    const color = {
        normal: {
            color: `rgb(${[
                Math.round(Math.random() * 256),
                Math.round(Math.random() * 256),
                Math.round(Math.random() * 256)
            ].join(',')})`
        }
    };
    return color;
}
const linePieBarchartsProperty = {
    color: ["#45c8dc", "#854cff", "#5f45ff", "#47aee3", "#d5d6d8", "#96d7f9", "#f9e264"],
    tooltip: {
        trigger: 'item',
    },
    dataZoom: [{
            type: 'slider',
            show: false,
            start: 0,
            end: 100,
            handleSize: 8,
            height: 20,
        },
        {
            type: 'inside',
            start: 0,
            end: 100
        }
    ],
    legend: {
        show: true,
        orient: 'horizontal',
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
        padding: 5,
        itemGap: 10,
        textStyle: {
            color: '#fff',
            fontSize: 16,
            padding: 14,
        },
        icon: 'circle',
    },
    xAxis: {
        show: true,
        axisLine: {
            show: true,
            lineStyle: {
                color: "#BAE3FF",
            }
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: "#BAE3FF",
                fontSize: 16,
            }
        },
        boundaryGap: false,
    },
    yAxis: {
        show: true,
        axisLabel: {
            textStyle: {
                color: '#6A8D93',
                fontSize: 16,
            },
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: '#2e3547',
            },
        },
    },
    series: [{
        animation: true,
        emphasis: {
            focus: 'series'
        },
        itemStyle: {
            normal: {
                opacity: 0.6,
                label: {
                    show: false,
                },
            },
        },

    }],
    data: [{
        "name": "全部",
        "data": [
            { value: 1048, name: '搜索引擎' },
            { value: 735, name: '直接访问' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '联盟广告' },
            { value: 300, name: '视频广告' }
        ]
    }, ]
}

function getSeriesConfig(type) {
    let series = {}
    switch (type) {
        case 'line':
            {
                series = {
                    smooth: true,
                    itemStyle: {
                        normal: {},
                        barBorderRadius: [0, 0, 0, 0]
                    },
                    label: {
                        normal: {
                            show: true,
                            lineHeight: 30,
                            width: 80,
                            height: 30,
                            backgroundColor: 'rgba(0,160,221,0.1)',
                            borderRadius: 200,
                            position: ['-15', '-60'],
                            distance: 1,
                            formatter: [
                                '    {d|●}',
                                ' {a|{c}}     \n',
                                '    {b|}'
                            ].join(','),
                            rich: {
                                d: {
                                    color: '#3CDDCF',
                                },
                                a: {
                                    color: '#fff',
                                    align: 'center',
                                },
                                b: {
                                    width: 1,
                                    height: 30,
                                    borderWidth: 1,
                                    borderColor: '#234e6c',
                                    align: 'left'
                                },
                            }
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 0.08,
                        },
                    },
                }
            };
            break;
        case 'bar':
            {
                series = {
                    barWidth: '25%',
                    itemStyle: {
                        normal: {},
                        barBorderRadius: [0, 0, 0, 0]
                    },
                    label: {
                        normal: {
                            show: true,
                            lineHeight: 30,
                            width: 80,
                            height: 30,
                            backgroundColor: 'rgba(0,160,221,0.1)',
                            borderRadius: 200,
                            position: ['-15', '-60'],
                            distance: 1,
                            formatter: [
                                '    {d|●}',
                                ' {a|{c}}     \n',
                                '    {b|}'
                            ].join(','),
                            rich: {
                                d: {
                                    color: '#3CDDCF',
                                },
                                a: {
                                    color: '#fff',
                                    align: 'center',
                                },
                                b: {
                                    width: 1,
                                    height: 30,
                                    borderWidth: 1,
                                    borderColor: '#234e6c',
                                    align: 'left'
                                },
                            }
                        }
                    },
                }
            };
            break;
        case 'pie':
            {
                series = {
                    radius: ['24%', '45%'],
                    center: ['50%', '50%'],

                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                color: '#ddd',
                            },
                            labelLine: {
                                show: true,
                                color: '#00ffff'
                            }
                        }
                    }

                }
            };
            break;
        case 'wordCloud':
            {
                series = {
                    gridSize: 20,
                    sizeRange: [12, 50],
                    rotationRange: [0, 0],
                    shape: "circle",
                    autoSize: {
                        enable: true,
                        minSize: 18
                    },
                    emphasis: {
                        focus: 'self',
                        textStyle: {
                            shadowBlur: 10,
                            shadowColor: "#333",
                        }
                    }
                }
            };
            break
        case 'map':
            {
                series = {
                    type: 'map',
                    mapType: 'china',
                    selectedMode: 'false', // 是否允许选中多个区域
                    itemStyle: {
                        normal: {
                            opacity: 1
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                        },
                        emphasis: {
                            label: {
                                show: true,
                            }
                        },
                    },
                }
            };
            break;
        case 'cityMap':
            {
                series = {
                    type: 'map',
                    roam: false,
                    mapType: 'myCity', // 自定义扩展图表类型
                    animation: true,
                    zoom: 1.1,
                    selectedMode: 'none',
                    label: {
                        normal: {
                            show: true,
                            color: "#711C16",
                            fontSize: 18,
                            fontWeight: '600',
                            formatter: '{c}\n{b}',
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#711C16',
                            borderWidth: 1.5,
                            areaColor: '#F9E368',
                        },
                        emphasis: {
                            areaColor: '#FFFCDF',
                            borderWidth: 1.5,
                        }
                    },
                    tooltip: {
                        show: false,
                    },
                }
            };
            break;
        case 'runInMap':
            {
                series = {
                    name: '自定义城市',
                    type: 'map',
                    roam: true,
                    mapType: 'myCity', // 自定义扩展图表类型
                    animation: true,
                    itemStyle: {
                        normal: {
                            borderColor: 'rgba(147, 235, 248, 1)',
                            borderWidth: 1,
                            areaColor: {
                                type: 'radial',
                                x: 0,
                                y: 0,
                                r: 8,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(175,238,238, 0)' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(	47,79,79, .2)' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            shadowColor: 'rgba(128, 217, 248, 1)',
                            // shadowColor: 'rgba(255, 255, 255, 1)',
                            shadowOffsetX: -2,
                            shadowOffsetY: 2,
                            shadowBlur: 10
                        },
                        emphasis: {
                            areaColor: '#389BB7',
                            borderWidth: 0
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#fff',
                            formatter: '{c}\n{b}',
                            fontSize: 12,
                        },
                        emphasis: {
                            label: {
                                show: true,
                            }
                        },
                        // 自定义名称映射
                    },
                }
            };
            break;
    }
    return series
}

function fixOption(option, type, name, isShowText) {
    // 根据类型修复样式
    fixPublicOption(option, type, isShowText)
    switch (name) {
        case 'basicLine':
            {
                option.series[0].smooth = false
                delete option.series[0].areaStyle
                delete option.series[0].itemStyle
            };
            break;
        case 'notSmoothLine':
            {
                option.series[0].smooth = false
            };
            break;
        case 'stackLine':
            {
                option.series[0].stack = true
            };
            break;
        case 'dataZoomLine':
            {
                option.series[0].smooth = false
                delete option.series[0].areaStyle
                delete option.series[0].itemStyle
                option.dataZoom[0].show = true
                option.grid.bottom = '100'
            };
            break;
        case 'lineAndBar':
            {
                option.series[0].smooth = false
                delete option.series[0].itemStyle
            };
            break;
        case 'bgBar':
            {
                option.series[0].showBackground = true
                option.series[0].backgroundStyle = {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
                option.data.length = 1
            };
            break;
        case 'mulityHorBar':
            {
                option.series[0].label.normal.show = isShowText
                option.xAxis.show = false
                option.yAxis.type = 'category'
                option.yAxis.data = []
            };
            break;
        case 'stackHorBar':
            {
                option.series[0].label.normal.show = isShowText
                option.xAxis.show = false
                option.yAxis.type = 'category'
                option.yAxis.data = []
                option.series[0].stack = true
            };
            break;
        case 'circlePie':
            {
                option.series[0].radius = ['45%', '60%']
            };
            break;
        case 'circleRadiusPie':
            {
                option.series[0].radius = ['45%', '60%']
                option.series[0].itemStyle.normal.borderRadius = 10
            };
            break;
        case 'stackBar':
            {
                option.series[0].stack = true
            };
            break;
        case 'rosePie':
            {
                option.series[0].roseType = 'radius'
            };
            break;
        case 'roseHalfPie':
            {
                option.series[0].roseType = 'radius'
                option.series[0].radius = ['20%', '80%']
                option.series[0].startAngle = 0
            };
            break;
        case 'percentPie':
            {
                option.series[0].radius = ['40%', '45%']
                option.title = {
                    text: '60%',
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontSize: 60,
                        color: '#fff'
                    }
                },
                option.series[0].label = {
                    normal: {
                        show: false,
                    }
                }
                option.data = [{
                    "name": "访问来源",
                    "data": [{
                            "name": "入职",
                            "value": 75
                        },
                        {
                            "name": "离职",
                            "value": 25
                        }
                    ]
                }]
            };
            break;
        case 'percent2Pie':
            {
                option.series[0].hoverAnimation = false
                option.series[0].legendHoverLink = false
                option.series[0].animationDuration = 3000
                option.series[0].avoidLabelOverlap = false
                option.series[0].clockwise = false // 顺时针true，逆时针false
                option.color = [
                    "rgba(255,255,255,0)",
                    "rgba(1, 187, 240, 0.8)",
                    "rgba(1, 187, 240, 0.4)",
                    "rgba(1, 187, 240, 0.4)"
                ]
                option.center = []
                option.series[0].radius = ['40%', '90%']
                option.series[0].emphasis = {
                    label: {
                        show: false,
                    }
                }
                option.series[0].labelLine = {
                    show: false
                }
                option.data = [{
                    "name": "访问来源",
                    "data": [{
                            "name": "入职",
                            "value": 75
                        },
                        {
                            "name": "离职",
                            "value": 25
                        }
                    ]
                }]
            };
            break;
        case 'percent3Pie':
            {
                option.graphic = {
                    "type": "text",
                    "left": "center",
                    "top": "center",
                    "z": 3,
                    "zlevel": 100,
                    "style": {
                        "text": "微博",
                        "fontSize": 36,
                        "fill": "#EC2673"
                    }
                }

                option.data = [{
                    "name": "访问来源",
                    "data": [{
                            "name": "入职",
                            "value": 75
                        },
                        {
                            "name": "离职",
                            "value": 25
                        }
                    ]
                }]
            };
            break;
        case 'dot':
            {
                option.series[0].symbolSize = 20
            };
            break;
        case 'textCloud':
            {
                option.series[0].rotationRange = [0, 90]
                option.series[0].rotationStep = 90
            };
            break;
        case 'area':
            {
                option.series[0].label.normal.show = isShowText
                delete option.xAxis
                delete option.yAxis
                delete option.dataZoom
                delete option.legend
                option.visualMap = {
                    type: 'continuous',
                    text: ['最大', '最小'],
                    showLabel: true,
                    left: '50',
                    min: 0,
                    max: 100,
                    inRange: {
                        color: ['#edfbfb', '#b7d6f3', '#40a9ed', '#3598c1', '#215096'],
                    },
                    splitNumber: 0,
                }
                option.data = [{
                    name: 'MAP',
                    data: [
                        { name: '北京', value: randomNum() },
                        { name: '天津', value: randomNum() },
                        { name: '河北', value: randomNum() },
                        { name: '山西', value: randomNum() },
                        { name: '内蒙古', value: randomNum() },
                        { name: '辽宁', value: randomNum() },
                        { name: '吉林', value: randomNum() },
                        { name: '黑龙江', value: randomNum() },
                        { name: '上海', value: randomNum() },
                        { name: '江苏', value: randomNum() },
                        { name: '浙江', value: randomNum() },
                        { name: '安徽', value: randomNum() },
                        { name: '福建', value: randomNum() },
                        { name: '江西', value: randomNum() },
                        { name: '山东', value: randomNum() },
                        { name: '河南', value: randomNum() },
                        { name: '湖北', value: randomNum() },
                        { name: '湖南', value: randomNum() },
                        { name: '重庆', value: randomNum() },
                        { name: '四川', value: randomNum() },
                        { name: '贵州', value: randomNum() },
                        { name: '云南', value: randomNum() },
                        { name: '西藏', value: randomNum() },
                        { name: '陕西', value: randomNum() },
                        { name: '甘肃', value: randomNum() },
                        { name: '青海', value: randomNum() },
                        { name: '宁夏', value: randomNum() },
                        { name: '新疆', value: randomNum() },
                        { name: '广东', value: randomNum() },
                        { name: '广西', value: randomNum() },
                        { name: '海南', value: randomNum() },
                        { name: '台湾', value: randomNum() },
                        { name: '南海诸岛', value: randomNum() },
                    ],
                }, ]
            };
            break;
        case 'runInMap':
        case 'cityMap':
            {
                option.series[0].label.normal.show = isShowText
                delete option.xAxis
                delete option.yAxis
                delete option.dataZoom
                delete option.legend
                option.geoJSON = '成都市'
                if (name === 'cityMap') {
                    delete option.color
                    option.geo = {
                        map: 'myCity',
                        type: "map",
                        roam: false,
                        zoom: 1.1,
                        itemStyle: {
                            normal: {
                                shadowColor: '#711C16',
                                shadowOffsetX: 0,
                                shadowOffsetY: 15,
                            },
                        },
                    }
                } else if (name === 'runInMap') {
                    option.visualMap = {
                        show: true,
                        min: 100,
                        max: 50000,
                        text: ['High', 'Low'],
                        inRange: {
                            color: option.color,
                        },
                        realtime: false,
                        calculable: true,
                    }
                }
                option.data = [{
                    name: 'MAP',
                    data: [
                        { name: '金牛区', value: 20057.34 },
                        { name: '青羊区', value: 15477.48 },
                        { name: '成华区', value: 31686.1 },
                        { name: '武侯区', value: 6992.6 },
                        { name: '锦江区', value: 44045.49 },
                        { name: '龙泉驿区', value: 10689.64 },
                        { name: '新都区', value: 27659.78 },
                        { name: '青白江区', value: 45180.97 },
                        { name: '郫都区', value: 35204.26 },
                        { name: '温江区', value: 21900.9 },
                        { name: '双流区', value: 4918.26 },
                        { name: '简阳市', value: 5881.84 },
                        { name: '金堂县', value: 4178.01 },
                        { name: '彭州市', value: 2227.92 },
                        { name: '都江堰市', value: 2180.98 },
                        { name: '崇州市', value: 9172.94 },
                        { name: '大邑县', value: 3368 },
                        { name: '邛崃市', value: 8306.98 },
                        { name: '蒲江县', value: 1226.98 },
                        { name: '新津县', value: 3325.98 },
                    ],
                }, ]
            };
            break;
    }
}

function fixPublicOption(option, type, isShowText) {
    // 修复公共类型的option
    switch (type) {
        case 'line':
            {
                delete option.series[0].barWidth
                option.series[0].label.normal.show = isShowText
                option.grid = {
                    "top": "5%",
                    "left": "10%",
                    "bottom": "10%",
                    "right": "10%"
                }
            };
            break;
        case 'pie':
            {
                delete option.xAxis
                delete option.yAxis
                delete option.dataZoom
                option.data = option.data.slice(0, 1)
                option.series[0].radius = '55%'
            };
            break;
        case 'bar':
            {
                option.xAxis.boundaryGap = true;
                option.series[0].label.normal.show = isShowText
                option.grid = {
                    "top": "5%",
                    "left": "10%",
                    "bottom": "10%",
                    "right": "10%"
                }
            };
            break;
        case 'wordCloud':
            {
                delete option.xAxis
                delete option.yAxis
                delete option.dataZoom
                delete option.legend
                option.data = option.data.slice(0, 1)
            };
            break;

    }
}

function fixSeries(option, name) {
    switch (name) {
        case 'percent3Pie':
            {
                const mySeries = {
                    "radius": [
                        "50%",
                        "75%"
                    ],
                    "startAngle": 0,
                    "avoidLabelOverlap": true,
                    "label": {
                        "normal": {
                            "show": true,
                            "formatter": "{term1|{b}}{term2|{c}}",
                            "fontSize": 26,
                            "padding": [
                                0, -50,
                                50, -60
                            ],
                            "position": "outside",
                            "rich": {
                                "term1": {
                                    "fontSize": 25,
                                    "padding": [
                                        80, -40, -10,
                                        0
                                    ],
                                },
                                "term2": {
                                    "fontSize": 40,
                                }
                            }
                        },
                        "emphasis": {
                            "show": true,
                            "textStyle": {
                                "fontSize": 30,
                                "fontWeight": "bold"
                            }
                        }
                    },
                    "labelLine": {
                        "normal": {
                            "show": true,
                            "smooth": true,
                            "length": 0,
                            "length2": 100
                        }
                    },

                }
                option.series = [{...option.series[0], ...mySeries }]
            };
            break;

    }
}

function getData(option, type, name) {
    switch (type) {
        case 'line':
        case 'bar':
            {
                option.data = [{
                        "name": "手机",
                        "data": [
                            { value: 1048, name: '搜索引擎' },
                            { value: 735, name: '直接访问' },
                            { value: 580, name: '邮件营销' },
                            { value: 484, name: '联盟广告' },
                            { value: 300, name: '视频广告' }
                        ]
                    },
                    {
                        "name": "电脑",
                        "data": [
                            { value: 1324, name: '搜索引擎' },
                            { value: 134, name: '直接访问' },
                            { value: 423, name: '邮件营销' },
                            { value: 773, name: '联盟广告' },
                            { value: 765, name: '视频广告' }
                        ]
                    }
                ]
            }
    }
}

function getLinePieBarchartsProperty(type, name, isGradients = false, isShowText = true) {
    const seriesConfig = getSeriesConfig(type)
    const option = JSON.parse(JSON.stringify(linePieBarchartsProperty))
    option.series = [{...option.series[0], ...seriesConfig }]
    if (type === 'runInMap' || type === 'cityMap') {
        option.series[0].type = 'map'
    } else {
        option.series[0].type = type
    }
    getData(option, type, name)
    fixOption(option, type, name, isShowText)
    fixSeries(option, name)
    if (isGradients) {
        option.series[0].itemStyle.normal.color = {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0,
                color: 'rgba(0,244,255,1)' // 0% 处的颜色
            }, {
                offset: 1,
                color: 'rgba(0,77,167,1)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
        }
    }
    return option
}

const elementList = {
    table: {
        data: [{ "name": "sheet1", "freeze": "A1", "styles": [], "merges": [], "rows": { "0": { "cells": { "0": { "text": "1" }, "1": { "text": "2" }, "2": { "text": "3" }, "3": { "text": "4" }, "4": { "text": "5" } } }, "len": 100 }, "cols": { "len": 26 }, "validations": [], "autofilter": {} }]
    },
    dashBoardImg: {
        selectStyle: {
            default: 'style1',
            option: [
                { label: '蓝色科技风', value: 'style1' },
                { label: '黑绿风', value: 'style2' },
            ],
        },
    },
    rotateEarth: {},
    text: {
        data: '我是显示文字',
        selectPosition: {
            default: 'center',
            option: [{ label: '靠左', value: 'flex-start' }, { label: '居中', value: 'center' }, { label: '靠右', value: 'flex-end' }]
        },
        fontStyle: 'normal',
        fontSize: 20,
        fontWeight: 500,
        color: '#fff',
        selectFontFamily: {
            default: 'Microsoft YaHei',
            option: [{ label: '微软雅黑', value: 'Microsof tYaHei' }, { label: 'FZHZGBJW', value: 'FZHZGBJW' }, { label: '楷体', value: '楷体' }, { label: '黑体', value: '黑体' }]
        },
        isHref: false,
        href: 'http://',
        target: '',
    },
    list: {
        data: [{
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '【遂宁市疫情防控专题天气预报113】 ​',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
        ],
        selectStyle: {
            default: 'style1',
            option: [
                { label: '风格1', value: 'style1' },
                { label: '风格2', value: 'style2' },
                { label: '安吉风格', value: 'anji' },
            ],
        },
        titleColor: '#ffb70a',
        fromColor: '#fff',
        timeColor: '#77B0E3',
        indexColor: '#FFB70A',
        indexBorderColor: '#FFB70A',
        // color: ['#FFB70A', '#fff', '#77B0E3', '#77B0E3'],
        indexFontSize: 20,
        titleFontSize: 20,
        leftFontSize: 16,
        rightFontSize: 16,
        liHeight: 65,
        Animationtime: 8,
    },
    listStatus: {
        selectStyle: {
            default: 'style1',
            option: [{ label: '科技蓝', value: 'style1' }, { label: '暗黑风', value: 'style2' }, { label: '炫酷蓝', value: 'style3' }]
        },
        data: [{
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                status: 0,
                name: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                status: 0,
                name: '川报观察',
                time: '2020-05-20 17:00:07',
            }, {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                status: 0,
                name: '川报观察',
                time: '2020-05-20 17:00:07',
            }, {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                status: 3,
                name: '川报观察',
                time: '2020-05-20 17:00:07',
            }, {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                status: 2,
                name: '川报观察',
                time: '2020-05-20 17:00:07',
            }, {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                status: 1,
                name: '川报观察',
                time: '2020-05-20 17:00:07',
            },
        ],
        titleColor: '#fff',
        nameColor: '#2BA5C8',
        timeColor: '#2BA5C8',
        titleFontSize: 20,
        statusFontSize: 16,
        nameFontSize: 16,
        timeFontSize: 16,
    },
    listAndDetails: {
        data: [{
                title: '爆料标题-2018/1/31  十九届二中全会将于十九届二中全',
                from: '早间新闻',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                details: '2月6日电 谈及2018年春节期间文化活动安排，文化部副部长杨志今今日介绍，各级公共图书馆期间文化活动安排，文化部副部长杨志今'
            },
            {
                title: '爆料标题-2018/1/31  十九届二中全会将于十九届二中全',
                from: '早间新闻',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                details: '2月6日电 谈及2018年春节期间文化活动安排，文化部副部长杨志今今日介绍，各级公共图书馆期间文化活动安排，文化部副部长杨志今'
            }, {
                title: '爆料标题-2018/1/31  十九届二中全会将于十九届二中全',
                from: '早间新闻',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                details: '2月6日电 谈及2018年春节期间文化活动安排，文化部副部长杨志今今日介绍，各级公共图书馆期间文化活动安排，文化部副部长杨志今'
            },
        ],
        titleColor: '#FFB70A',
        fromColor: '#fff',
        authorColor: '#77B0E3',
        timeColor: '#77B0E3',
        detailsColor: '#fff',
        titleFontSize: 30,
        fromFontSize: 20,
        authorFontSize: 20,
        timeFontSize: 20,
        detailsFontSize: 25,
        liHeight: 50,
        // Animationtime: 8,
    },
    noIndexList: {
        data: [{
                "from": "优质创作者",
                "time": "2020-12-02 17:00:07",
                "title": "苹果玩智能汽车，路子比特斯拉还野"
            },
            {
                "from": "最前线",
                "time": "2020-12-01 12:00:07",
                "title": "高通发布5G芯片骁龙 888，小米 OV 齐站台"
            },
            {
                "from": "新浪科技",
                "time": "2020-12-02 13:00:07",
                "title": "造车新势力出海，有这个必要吗？"
            },
            {
                "from": "央视新闻",
                "time": "2020-12-02 13:00:07",
                "title": "嫦娥五号探测器成功在月球正面预选着陆区着陆"
            },
            {
                "from": "新浪财经",
                "time": "2020-12-01 15:00:07",
                "title": "P2P清零未了局：谁来为8000亿坏账买单？"
            },
            {
                "from": "川报观察",
                "time": "2020-05-20 17:00:07",
                "title": "520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市"
            }
        ],
        selectStyle: {
            default: 'style1',
            option: [{ label: '垂直风格', value: 'style1' }, { label: '水平风格', value: 'style2' }]
        },
        titleColor: '#00ffff',
        fromColor: '#77B0E3',
        timeColor: '#77B0E3',
        borderColor: '#00ffff',
        // 增加边框样式选择（未使用）
        selectBorderStyle: {
            default: 'solid',
            option: [{ label: '实线', value: 'solid' }, { label: '虚线', value: 'dashed' }]
        },
        activeTitleColor: '#b4ee44',
        activeFromColor: '#77B0E3',
        activeTimeColor: '#77B0E3',
        activeBgColor: 'rgba(83,255,241,0.4)',
        // color: ['#b4ee44', "#77B0E3", "#77B0E3", '#00ffff'],
        activeFontSize: 26,
        titleFontSize: 20,
        leftFontSize: 16,
        rightFontSize: 16,
        liHeight: 50,
        Animationtime: 8,
    },
    noAnimation: {
        // 没有动画的列表
        maxLength: 6,
        titleFontSize: 21,
        descriptionFontSize: 19,
        countFontSize: 22,
        publishCountFontSize: 20,
        indexColor: '#fff',
        titleColor: '#fff',
        descriptionColor: '#fff',
        countColor: '#3BFFD3',
        publishCountColor: '#fff',
        firstCountColor: '#A6C5FF',
        secondCountColor: '#FF3B97',
        thirdCountColor: '#FFCF3B',
        bgColor: 'rgba(0, 246, 255, 0.2)',
        selectStyle: {
            default: 'style1',
            option: [{ label: '头像风格', value: 'style1' }, { label: '无头像风格', value: 'style2' }]
        },
        data: [{
                title: '阿拉善盟广播电视台',
                description: '微博',
                count: '333',
                publishCount: '8',
                avatar: 'https://moctest.sobeylingyun.com//screen/iframe/image/head.png',
            },
            {
                title: '今日阿拉善​',
                description: '微博',
                count: '333',
                publishCount: '8',
                avatar: 'https://moctest.sobeylingyun.com//screen/iframe/image/head.png',
            },
            {
                title: '额济纳旗广播电视台',
                description: '微博',
                count: '333',
                publishCount: '8',
                avatar: 'https://moctest.sobeylingyun.com//screen/iframe/image/head.png',
            },
            {
                title: '阿拉善发布',
                description: '微博',
                count: '333',
                publishCount: '8',
                avatar: 'https://moctest.sobeylingyun.com//screen/iframe/image/head.png',
            },
            {
                title: '驼乡发布',
                description: '微博',
                count: '333',
                publishCount: '8',
                avatar: 'https://moctest.sobeylingyun.com//screen/iframe/image/head.png',
            },
            {
                title: '内蒙古腾格里',
                description: '微博',
                count: '333',
                publishCount: '8',
                avatar: 'https://moctest.sobeylingyun.com//screen/iframe/image/head.png',
            },
        ],
    },

    listAnimation: {
        header: [{ label: '任务名称', width: '50%' }, { label: '时间', width: '15%' }, { label: '记者', width: '15%' }, { label: '状态', width: '10%' }],
        data: [{
            data0: '在这篇重要文章中，习近平这样强调民法典颁布实施',
            data1: '06/23',
            data2: '张三',
            data3: '已完成'
        }, {
            data0: '在这篇重要文章中，习近平这样强调民法典颁布实施',
            data1: '06/23',
            data2: '张三',
            data3: '已完成'
        }, {
            data0: '在这篇重要文章中，习近平这样强调民法典颁布实施',
            data1: '06/23',
            data2: '张三',
            data3: '已完成'
        }, {
            data0: '在这篇重要文章中，习近平这样强调民法典颁布实施',
            data1: '06/23',
            data2: '张三',
            data3: '已完成'
        }, {
            data0: '在这篇重要文章中，习近平这样强调民法典颁布实施',
            data1: '06/23',
            data2: '张三',
            data3: '已完成'
        }, {
            data0: '在这篇重要文章中，习近平这样强调民法典颁布实施',
            data1: '06/23',
            data2: '张三',
            data3: '已完成'
        }, ],
        selectStyle: {
            default: 'style1',
            option: [{ label: '列表风格', value: 'style1' }, { label: '串联单风格', value: 'style2' }]
        },
        detailsFontColor: '#fff',
        borderColor: '#FFB70A',
        headerBackgroundColor: '#053053',
        headerFontColor: '#fff',
        isHaveHeader: true,
        isHaveIndex: true,
        isHaveActiveImg: true,
        indexIsHaveBorder: false,
        indexIsHaveBg: true,
        isHaveIndexImg: false,
        fontSize: 26,
        activeFontSize: 30,
        Animationtime: 8,
        isHaveBg: false,
        bgColor: 'rgba(76, 86, 120, 0.2)',
        height: '13%'
    },
    listNoHeader: {
        data: [{
            title: '在这篇重要文章中，习近平这样强调民法典颁布实施',
            time: '06/23',
            author: '张三',
        }, {
            title: '在这篇重要文章中，习近平这样强调民法典颁布实施',
            time: '06/23',
            author: '张三',
        }, {
            title: '在这篇重要文章中，习近平这样强调民法典颁布实施',
            time: '06/23',
            author: '张三',
        }, {
            title: '在这篇重要文章中，习近平这样强调民法典颁布实施',
            time: '06/23',
            author: '张三',
        }, {
            title: '在这篇重要文章中，习近平这样强调民法典颁布实施',
            time: '06/23',
            author: '张三',
        }, {
            title: '在这篇重要文章中，习近平这样强调民法典颁布实施',
            time: '06/23',
            author: '张三',
        }],
        fontSize: 26,
        activeFontSize: 30,
        indexColor: '#3EDDFF',
        activeIndexColor: '#fff',
        activeTitleColor: '#fff',
        activeTimeColor: '#3EDDFF',
        activeAuthorColor: '#3EDDFF',
        titleColor: '#fff',
        timeColor: '#3EDDFF',
        authorColor: '#3EDDFF',
        startScroll: 4,
        Animationtime: 8
    },
    topList: {
        indexColor: '#fff',
        titleColor: '#fff',
        countColor: '#fff',
        firstBgColor: '#04A27A',
        secondBgColor: '#0547B1',
        thirdBgColor: '#7605CD',
        fontSize: 26,
        height: 100,
        marginBottom: 10,
        data: [{ title: '时政在线', count: '8.21%' }, { title: '时政在线', count: '8.21%' }, { title: '时政在线', count: '8.21%' }]
    },
    checkList: {
        titleColor: '#fff',
        statusColor: '#fff',
        authorColor: '#FCB305',
        timeColor: '#FCB305',
        titleFontSize: 30,
        leftFontSize: 20,
        rightFontSize: 20,
        statusFontSize: 20,
        checkColorList: [{ label: '待审', color: '#FFB70A' }, { label: '通过', color: '#3EB016' }, { label: '已推送', color: '#00B2CC' }, { label: '返回', color: '#BD3D67' }],
        data: [{
                title: '爆料标题十九届二中全十九届...',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                status: '待审'
            },
            {
                title: '爆料标题十九届二中全十九届...',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                status: '待审'
            }, {
                title: '爆料标题十九届二中全十九届...',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                status: '待审'
            }, {
                title: '爆料标题十九届二中全十九届...',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                status: '返回'
            }, {
                title: '爆料标题十九届二中全十九届...',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                status: '已推送'
            }, {
                title: '爆料标题十九届二中全十九届...',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                status: '通过'
            }
        ],
    },
    cardList: {
        titleColor: '#fff',
        statusColor: '#fff',
        authorColor: '#FCB305',
        timeColor: '#FCB305',
        titleFontSize: 30,
        leftFontSize: 20,
        rightFontSize: 20,
        statusFontSize: 20,
        data: [{
                title: '合肥高新区企业中科类脑完成A轮亿元融资',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                status: '待审'
            },
            {
                title: '湖北打造人工智能创新高地，在16个重点领域开展布局，东湖高新将作为核心承载区',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                status: '待审'
            }, {
                title: '逆势增长5.9%的背后——中关村创新地标里蕴藏的发展密码',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                status: '待审'
            }, {
                title: '成都国际化营商环境政策再升级 开启3．0版时代',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                status: '返回'
            }, {
                title: '爆料标题十九届二中全十九届',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                status: '已推送'
            }, {
                title: '爆料标题十九届二中全十九届',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                status: '通过'
            }, {
                title: '爆料标题十九届二中全十九届',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                status: '通过'
            }, {
                title: '爆料标题十九届二中全十九届',
                author: '王小米',
                time: '2020-05-20 17:00:07',
                status: '通过'
            }
        ],
    },
    listAndDetailsAnimation: {
        // color: ["#fff", "#8AAFAF", "#8AAFAF", "#FFB70A", "#FFB70A", "#FFB70A", "#8AAFAF", "#fff", "#fff"],
        titleColor: '#fff',
        authorColor: '#8aafaf',
        timeColor: '#8aafaf',
        // fireIconColor: 'red',
        // fireColor: '#fff',
        detailsTitleColor: '#ffb70a',
        detailsFromColor: '#ffb70a',
        detailsTimeColor: '#ffb70a',
        detailsFireIconColor: 'red',
        detailsFireColor: '#fff',
        detailsColor: '#8aafaf',
        titleFontSize: 30,
        authorFontSize: 20,
        timeFontSize: 20,
        // fireFontSize: 20,
        detailsTitleFontSize: 35,
        detailsTimeFontSize: 25,
        detailsFromFontSize: 25,
        detailsFontSize: 28,
        detailsFireFontSize: 25,
        Animationtime: 8,
        selectStyle: {
            default: 'style1',
            option: [
                { label: '马拉松风格', value: 'style1' },
                { label: '舆情监控风格', value: 'style2' },

            ],
        },
        data: [{
            title: '宋仲基写封信给粉丝发结婚感言言宋仲基写封信给粉丝发结婚感言言',
            author: '作者',
            publishTime: '2017-08-28  16:45:20',
            from: '新浪新闻',
            details: '摘要：昨日，宋仲基与宋慧乔两人相继发表结婚婚讯引发网友关注，今日，宋仲基结婚感言另许多女粉丝难忘，随后宋仲基与宋慧乔结婚婚纱照曝光，两人结婚日期公开。宋仲基和宋慧乔于5日凌晨通过双方经济公司公开此消息.有人采访了宋仲基的爸爸，对此他表示：儿子终于结婚了，虽然宋慧乔比儿子大一些，但是他喜欢就好.<img src="https://hbimg.huabanimg.com/8dd52ac02afd7496d4b822bc5b6cb122456eddfd430c-PTV5vq" />',
            // fire: 12,
            keywords: '宋仲基;宋慧乔;'
        }, {
            title: '宋仲基写封信给粉丝发结婚感言言',
            author: '作者',
            publishTime: '2017-08-28  16:45:20',
            from: '新浪新闻',
            details: '摘要：昨日，宋仲基与宋慧乔两人相继发表结婚婚讯引发网友关注，今日，宋仲基结婚感言另许多女粉丝难忘，随后宋仲基与宋慧乔结婚婚纱照曝光，两人结婚日期公开。宋仲基和宋慧乔于5日凌晨通过双方经济公司公开此消息.有人采访了宋仲基的爸爸，对此他表示：儿子终于结婚了，虽然宋慧乔比儿子大一些，但是他喜欢就好.',
            // fire: 12,
            keywords: '宋仲基;宋慧乔;'
        }, {
            title: '宋仲基写封信给粉丝发结婚感言言',
            author: '作者',
            publishTime: '2017-08-28  16:45:20',
            from: '新浪新闻',
            details: '摘要：昨日，宋仲基与宋慧乔两人相继发表结婚婚讯引发网友关注，今日，宋仲基结婚感言另许多女粉丝难忘，随后宋仲基与宋慧乔结婚婚纱照曝光，两人结婚日期公开。宋仲基和宋慧乔于5日凌晨通过双方经济公司公开此消息.有人采访了宋仲基的爸爸，对此他表示：儿子终于结婚了，虽然宋慧乔比儿子大一些，但是他喜欢就好.',
            // fire: 12,
            keywords: '宋仲基;宋慧乔;'
        }, {
            title: '宋仲基写封信给粉丝发结婚感言言',
            author: '作者',
            publishTime: '2017-08-28  16:45:20',
            from: '新浪新闻',
            details: '摘要：昨日，宋仲基与宋慧乔两人相继发表结婚婚讯引发网友关注，今日，宋仲基结婚感言另许多女粉丝难忘，随后宋仲基与宋慧乔结婚婚纱照曝光，两人结婚日期公开。宋仲基和宋慧乔于5日凌晨通过双方经济公司公开此消息.有人采访了宋仲基的爸爸，对此他表示：儿子终于结婚了，虽然宋慧乔比儿子大一些，但是他喜欢就好.',
            // fire: 12,
            keywords: '宋仲基;宋慧乔;'
        }]
    },
    listAndImg: {
        data: [{
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '【遂宁市疫情防控专题天气预报113】 ​',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
        ],
        titleColor: '#A6CAF2',
        activeTitleColor: '#FEFEFE',
        fromColor: '#AED5EB',
        activeFromColor: '#AED5EB',
        timeColor: '#AED5EB',
        activeTimeColor: '#AED5EB',
        indexColor: '#fff',
        activeIndexColor: '#fff',
        indexFontSize: 20,
        activeIndexFontSize: 22,
        titleFontSize: 20,
        activeTitleFontSize: 22,
        fromFontSize: 16,
        activeFromTitle: 18,
        timeFontSize: 16,
        activeTimeTitle: 18,
        liHeight: 80,
        isScroll: false,
        Animationtime: 8,
    },
    flowList: {
        data: [{
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '【遂宁市疫情防控专题天气预报113】 ​',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
            {
                title: '520，进擎来电 一汽丰田奕泽IZOA家族纯电车型上市',
                from: '川报观察',
                time: '2020-05-20 17:00:07',
            },
        ],
        titleColor: '#A6CAF2',
        activeTitleColor: '#FEFEFE',
        fromColor: '#AED5EB',
        activeFromColor: '#AED5EB',
        timeColor: '#AED5EB',
        activeTimeColor: '#AED5EB',
        indexColor: '#fff',
        activeIndexColor: '#fff',
        indexFontSize: 20,
        activeIndexFontSize: 22,
        titleFontSize: 20,
        activeTitleFontSize: 22,
        fromFontSize: 16,
        activeFromTitle: 18,
        timeFontSize: 16,
        activeTimeTitle: 18,
        liHeight: 80,
        isScroll: false,
        Animationtime: 8,
    },
    staffMix: {
        color: '#72c6e6',
        fontSize: 16,
        data: [{
            name: '前端工程师',
            number: 3
        }, {
            name: '后端工程师',
            number: 5
        }, {
            name: '网页设计师',
            number: 2
        }, {
            name: '测试工程师',
            number: 2
        }, {
            name: '产品经理',
            number: 1
        }, {
            name: '安卓工程师',
            number: 1
        }, {
            name: 'IOS工程师',
            number: 1
        }]
    },
    flashCloud: {
        color: '#00f6ff',
        fontSize: 12,
        data: [{
            title: 'JavaScript'
        }, {
            title: 'Vue.js'
        }, {
            title: 'React.js'
        }, {
            title: 'Node.js'
        }, {
            title: 'Angular'
        }, {
            title: 'HTML5'
        }, {
            title: 'CSS3'
        }, {
            title: 'jQuery'
        }, {
            title: 'Typescript'
        }, {
            title: 'Bootstrap'
        }, {
            title: 'WebApp'
        }, {
            title: '小程序'
        }, {
            title: 'HTTP'
        }, {
            title: 'Sass/Less'
        }, {
            title: 'Webpack'
        }, {
            title: 'ES6'
        }]
    },
    sinaRank: {
        Animationtime: 5,
        itemNumTitle: '事项数：',
        dataItemTitle: '数据项：',
        dataSizeTitle: '数据量：',
        data: [{
            id: 1,
            itemNum: 258,
            dataItem: 1288,
            dataSize: 12306,
            workUnit: 'JS'
        }, {
            id: 2,
            itemNum: 568,
            dataItem: 5623,
            dataSize: 12306,
            workUnit: 'Nodejs'
        }, {
            id: 3,
            itemNum: 208,
            dataItem: 1755,
            dataSize: 12043,
            workUnit: 'Vuejs'
        }, {
            id: 4,
            itemNum: 358,
            dataItem: 1812,
            dataSize: 12306,
            workUnit: 'CSS3'
        }, {
            id: 5,
            itemNum: 128,
            dataItem: 4718,
            dataSize: 12580,
            workUnit: 'jQuery'
        }]
    },
    dynamicList: {
        nameFontSize: 20,
        nameColor: '#0072bc',
        countFontSize: 22,
        countColor: '#00aeef',
        data: [{ name: '区块链', value: 12345 }, { name: '大数据', value: 32432 }, { name: '云计算', value: 65464 }, { name: '人工智能', value: 42352 }]
    },
    pyramid: {
        nameFontSize: 16,
        nameColor: '#84a9ef',
        color: ['#45fed4', '#84a9ef', '#f1e04f', '#dbfe73'],
        data: [{
            name: '技术经理',
            value: 158
        }, {
            name: 'Java工程师',
            value: 572
        }, {
            name: '前端工程师',
            value: 826
        }, {
            name: '项目经理',
            value: 66
        }]
    },
    dataContainer: {
        data: [{
            title: "英超榜首队异装出游 众将扮",
            description: '上传人: 王萌萌',
            type: 'img',
            url: 'https://hbimg.huabanimg.com/87071eba2a8c3a6790f103a84a76f58121194eb214af54-3H6XoJ'
        }, {
            title: "英超榜首队异装出游 众将扮",
            description: '上传人: 王萌萌',
            type: 'video',
            url: 'https://hbimg.huabanimg.com/05ee44dc813390e220c3d02cb591a861fc861b9414a600-RsFNnx',
            playUrl: 'http://172.16.131.74:19207/bucket-p/u-f7v801ezwc350079/2020/08/03/%E4%BA%BA%E7%89%A9%E8%B7%9F%E8%B8%AA%EF%BC%88%E5%BC%A0%E9%9D%93%E9%A2%96%E7%B4%A0%E6%9D%90%EF%BC%89_000.mp4'
        }, {
            title: "英超榜首队异装出游 众将扮",
            description: '上传人: 王萌萌',
            type: 'voice',
            url: 'https://hbimg.huabanimg.com/6c85735d6e931e2b77eb0f675a21cee5135e58843ff30-JvPQet'
        }, {
            title: "英超榜首队异装出游 众将扮",
            description: '上传人: 王萌萌',
            type: 'img',
            url: 'https://hbimg.huabanimg.com/87071eba2a8c3a6790f103a84a76f58121194eb214af54-3H6XoJ'
        }, {
            title: "英超榜首队异装出游 众将扮",
            description: '上传人: 王萌萌',
            type: 'img',
            url: 'https://hbimg.huabanimg.com/87071eba2a8c3a6790f103a84a76f58121194eb214af54-3H6XoJ'
        }, {
            title: "英超榜首队异装出游 众将扮",
            description: '上传人: 王萌萌',
            type: 'img',
            url: 'https://hbimg.huabanimg.com/87071eba2a8c3a6790f103a84a76f58121194eb214af54-3H6XoJ'
        }, {
            title: "英超榜首队异装出游 众将扮",
            description: '上传人: 王萌萌',
            type: 'img',
            url: 'https://hbimg.huabanimg.com/87071eba2a8c3a6790f103a84a76f58121194eb214af54-3H6XoJ'
        }, {
            title: "英超榜首队异装出游 众将扮",
            description: '上传人: 王萌萌',
            type: 'img',
            url: 'https://hbimg.huabanimg.com/87071eba2a8c3a6790f103a84a76f58121194eb214af54-3H6XoJ'
        }, {
            title: "英超榜首队异装出游 众将扮",
            description: '上传人: 王萌萌',
            type: 'img',
            url: 'https://hbimg.huabanimg.com/87071eba2a8c3a6790f103a84a76f58121194eb214af54-3H6XoJ'
        }, {
            title: "英超榜首队异装出游 众将扮",
            description: '上传人: 王萌萌',
            type: 'img',
            url: 'https://hbimg.huabanimg.com/87071eba2a8c3a6790f103a84a76f58121194eb214af54-3H6XoJ'
        }, {
            title: "英超榜首队异装出游 众将扮",
            description: '上传人: 王萌萌',
            type: 'img',
            url: 'https://hbimg.huabanimg.com/87071eba2a8c3a6790f103a84a76f58121194eb214af54-3H6XoJ'
        }, {
            title: "英超榜首队异装出游 众将扮",
            description: '上传人: 王萌萌',
            type: 'img',
            url: 'https://hbimg.huabanimg.com/87071eba2a8c3a6790f103a84a76f58121194eb214af54-3H6XoJ'
        }],
        titleFontSize: 20,
        descriptionFontSize: 18,
        color: ['#fff', '#fff']
    },
    
    capsuleList: {
        fontSize: 26,
        capsuleHeight: 20,
        avatarWidth: 54,
        fontColor: "#fff",
        color: [
            "#FF4D4D",
            "#AA027D",
            "#FACC22",
            "#F83600",
            "#A541FF",
            "#3FBBFE",
            "#659CF6",
            "#88D8FD"
        ],
        data: [{
            img: 'https://hbimg.huabanimg.com/17bf0ec2de67faf5d600374a95d4b09fdd43959d33a70-QLfdVc',
            count: 1
        }, {
            img: 'https://hbimg.huabanimg.com/17bf0ec2de67faf5d600374a95d4b09fdd43959d33a70-QLfdVc',
            count: 2
        }, {
            img: 'https://hbimg.huabanimg.com/17bf0ec2de67faf5d600374a95d4b09fdd43959d33a70-QLfdVc',
            count: 3
        }, {
            img: 'https://hbimg.huabanimg.com/17bf0ec2de67faf5d600374a95d4b09fdd43959d33a70-QLfdVc',
            count: 4
        }, {
            img: 'https://hbimg.huabanimg.com/17bf0ec2de67faf5d600374a95d4b09fdd43959d33a70-QLfdVc',
            count: 5
        }]
    },
    sigleList: {
        data: [{
            title: '在这篇重要文章中，习近平这样强调民法典颁布实施',
            count: 222,
        }, {
            title: '守望相助 习近平这样推动中非团结抗疫',
            count: 222,
        }, {
            title: '12篇重磅讲话！今年习近平在《求是》上都谈了啥',
            count: 222,
        }, {
            title: '中非团结抗疫特别峰会开始举行 习近平在北京主持',
            count: 222,
        }, {
            title: 'NO.5#阿拉善盟新闻# 【我盟第十四届社会科学普及第二季度活动周启动】6月15日，由盟委宣传部',
            count: 222,
        }, {
            title: '中华人民共和国职业病防治法',
            count: 222,
        }, {
            title: 'NO.6#阿拉善盟新闻# 【缔结友好园区 共建“一带一路”】6月14日，新疆生产建设兵团乌鲁木齐经济',
            count: 222,
        }],
        titleFontSize: 26,
        indexFontSize: 15,
        countFontSize: 20,
        indexColor: '#fff',
        countColor: '#fff',
        titleColor: '#fff',
        liHeight: 50,
        Animationtime: 8
    },

    tag: {
        data: '标签',
        selectType: {
            default: 'default',
            option: [
                { label: '默认', value: 'default' },
                { label: '成功', value: 'success' },
                { label: '提示', value: 'info' },
                { label: '警告', value: 'warning' },
                { label: '危险', value: 'danger' },
            ],
        },
        closable: true,
        size: 'medium',
        selectEffect: {
            default: 'light',
            option: [
                { label: '暗色', value: 'dark' },
                { label: '亮色', value: 'light' },
                { label: '朴素', value: 'plain' },
            ],
        },
        color: [],
        hit: false, // 是否有边框描边
        disableTransitions: false, // 是否禁用渐变动画
    },
    avatar: {
        imgText: 'cbz',
        selectShape: {
            default: 'circle',
            option: [
                { label: '圆形', value: 'circle' },
                { label: '方形', value: 'square' },
            ],
        }, // circle, square 设置头像的形状
        src: 'http://image.fsyule.net/2016-12-12/72c5e6250635e91a86e7e87ff5eead69.jpg',
        alt: '头像',
        selectFit: {
            default: 'cover',
            option: [
                { label: 'fill', value: 'fill' },
                { label: 'contain', value: 'contain' },
                { label: 'cover', value: 'cover' },
                { label: 'none', value: 'none' },
                { label: 'scale-down', value: 'scale-down' },
            ],
        }, // 当展示类型为图片的时候，设置图片如何适应容器框 fill / contain / cover / none / scale-down
    },
    image: {
        src: 'https://t8.baidu.com/it/u=1484500186,1503043093&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1589524445&t=602a130de6b1cf690eac8eeab55a5071',
        alt: '图片',
        selectFit: {
            default: 'fill ',
            option: [
                { label: 'fill', value: 'fill' },
                { label: 'contain', value: 'contain' },
                { label: 'cover', value: 'cover' },
                { label: 'none', value: 'none' },
                { label: 'scale-down', value: 'scale-down' },
            ],
        },
        isloading: true,
        isShowError: true,
    },
    icon: {
        color: ['#fff'],
        class: 'el-icon-edit',
        size: 24,
    },
    bubble: {
        data: {
            name: '微博',
            count: 888,
        },
        nameFontSize: 40,
        countFontSize: 30,
        nameColor: '#fff',
        countColor: 'rgba(255, 255, 255, 0.6)',
        src: 'https://moctest.sobeylingyun.com/screen/iframe/image/star1.png',
    },
    datePicker: {
        format: 'yyyy/MM/dd ',
        rangeSeparator: '~',
        valueFormat: 'yyyy-MM-dd',
    },
    clue: {
        cartoonTime: 10,
        serverUrl: 'http://47.95.197.2/',
        dataType: 1,
        myChart: '',
        hiddenOption: {
            geo: {
                show: true,
                roam: false,
                map: 'china',
                label: {
                    normal: {
                        show: true,
                        color: '#EEEFF9',
                    },
                    emphasis: {
                        label: {
                            show: true,
                        }
                    },
                },

                itemStyle: {
                    normal: {
                        show: 'true',
                        color: {
                            colorStops: [{
                                    offset: 0,
                                    color: '#20A0F8', // 0% 处的颜色
                                },
                                {
                                    offset: 0.25,
                                    color: '#1EADF8', // 0% 处的颜色
                                },
                                {
                                    offset: 0.75,
                                    color: '#0D7BF8', // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: '#0D9BF8', // 100% 处的颜色
                                },
                            ],
                        }, // 地图背景色
                        borderWidth: 1,
                        borderType: 'dashed',
                        borderColor: '#fff', // 省市边界线
                        shadowColor: 'rgba(166, 230, 236, 0.6)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: 0,
                    },
                },
                regions: [{
                    name: '南海诸岛',
                    value: 0,
                    itemStyle: {
                        normal: {
                            opacity: 0,
                            label: {
                                show: false,
                            },
                        },
                    },
                }, ],
            },
            visualMap: {
                min: 0,
                max: 100,
                calculabel: true,
                show: false,
            },
            series: [{
                    type: 'lines',
                    zlevel: 6,
                    effect: {
                        show: true,
                        period: 4, // 箭头指向速度，值越小速度越快
                        trailLength: 0.02, // 特效尾迹长度[0,1]值越大，尾迹越长重
                        // symbol: 'arrow', //箭头图标
                        symbolSize: 8, // 图标大小
                    },
                    lineStyle: {
                        normal: {
                            opacity: 1,
                            color: '#16e820',
                            width: 2,
                        },
                    },
                },
                {
                    type: 'effectScatter',
                    symbol: 'circle',
                    zlevel: 2,
                    coordinateSystem: 'geo',
                    symbolSize: 10,
                    rippleEffect: {
                        period: 4, // 动画时间，值越小速度越快
                        brushType: 'stroke', // 波纹绘制方式 stroke, fill
                        scale: 6, // 波纹圆环最大限制，值越大波纹越大
                    },
                },
            ],
        },
        startPath: [
            [
                [104.06, 30.67]
            ],
            [
                [115.25, 39.28]
            ],
            [
                [113.41, 29.58]
            ],
            [
                [120.52, 30.4]
            ]
        ],
        endPath: [
            [116.909555, 51.536562],
            [116.909555, 28.58],
            [80.709555, 30.58],
            [80.70555, 51.58],
        ],
        queryParam: [
            { flag: 2, name: '电视稿' },
            { flag: 2, name: '过放电' },
            { flag: 3, name: '个任务更' },
            { flag: 4, name: 'GRE个佛挡杀佛' },
        ],
    },
 
    border1: {
        // 边框
        borderColor: '',
        border1Color: '',
        backgroundColor: 'transparent'
    },
    border2: {
        borderColor: '',
        border1Color: '',
        backgroundColor: 'transparent'
    },
    border3: {
        borderColor: '',
        border1Color: '',
        backgroundColor: 'transparent'
    },
    border4: {
        borderColor: '',
        border1Color: '',
        backgroundColor: 'transparent'
    },
    border5: {
        borderColor: '',
        border1Color: '',
        backgroundColor: 'transparent'
    },
    border6: {
        borderColor: '',
        border1Color: '',
        backgroundColor: 'transparent'
    },
    border7: {
        borderColor: '',
        border1Color: '',
        backgroundColor: 'transparent'
    },
    border8: {
        borderColor: '',
        dur: 3,
        reverse: false,
        border1Color: '',
        backgroundColor: 'transparent'
    },
    border9: {
        borderColor: '',
        border1Color: '',
        backgroundColor: 'transparent'
    },
    border10: {
        borderColor: '',
        backgroundColor: 'transparent'
    },
    border11: {
        borderColor: '',
        title: '边框标题',
        titleWidth: 250,
        border1Color: '',
        backgroundColor: 'transparent'
    },
    border12: {
        borderColor: '',
        border1Color: '',
        backgroundColor: 'transparent'
    },
    border13: {
        borderColor: '',
        border1Color: '',
        backgroundColor: 'transparent'
    },
    border14: {
        bgColor: '#fff',
        borderColor: '#676868',
        borderFontSize: 1,
        borderType: 'solid',
        borderRadius: 20,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
    },
    border15: {
        borderColor: '#054B96',
        border1Color: '#054B96',
    },
    border16: {
        borderColor: '#054B96',
        border1Color: '#054B96',
    },
    border17: {
        borderColor: '#1296db',
    },
    border18: {
        borderColor: '#1296db',
    },
    border19: {
        borderColor: '#1296db',
        border1Color: '#1296db',
        border2Color: '#1296db',
        border3Color: '#1296db',
    },
    border20: {
        borderColor: '#1296db',
    },
    decoration1: {
        // 装饰
        borderColor: '',
        border1Color: '',
    },
    decoration2: {
        borderColor: '',
        border1Color: '',
    },
    decoration3: {
        borderColor: '',
        border1Color: '',
    },
    decoration4: {
        borderColor: '',
        border1Color: '',
    },
    decoration5: {
        borderColor: '',
        border1Color: '',
    },
    decoration6: {
        borderColor: '',
        border1Color: '',
    },
    decoration7: {
        borderColor: '',
        border1Color: '',
    },
    decoration8: {
        borderColor: '',
        border1Color: '',
    },
    decoration9: {
        borderColor: '',
        border1Color: '',
    },
    decoration10: {
        borderColor: '',
        border1Color: '',
    },
    decoration11: {
        borderColor: '',
        border1Color: '',
    },
    decoration12: {

    },
    decoration13: {

    },
    decoration14: {

    },
    decoration15: {

    },
    decoration16: {

    },
    decoration17: {

    },
    decoration18: {

    },
    decoration19: {

    },
    decoration20: {

    },
    decoration21: {},
    decoration22: {},
    // digitalFlop: {
    //   content: '{nt}个',
    //   toFixed: 2,
    //   data: 20,
    //   style: {
    //     fontSize: 30,
    //     fill: '#3de7c9',
    //   },
    // },
    scrollBoard: {
        header: ['列1', '列2', '列3'],
        index: true,
        columnWidth: [50],
        align: ['center'],
        selectCarousel: {
            default: 'single',
            option: [
                { label: '单条轮播', value: 'single' },
                { label: '单页轮播', value: 'page' },
            ],
        },
        waitTime: 2000,
        data: [
            ['<span style="color:#37a2da;">行1列1</span>', '行1列2', '行1列3'],
            ['行2列1', '<span style="color:#32c5e9;">行2列2</span>', '行2列3'],
            ['行3列1', '行3列2', '<span style="color:#67e0e3;">行3列3</span>'],
            ['行4列1', '<span style="color:#9fe6b8;">行4列2</span>', '行4列3'],
            ['<span style="color:#ffdb5c;">行5列1</span>', '行5列2', '行5列3'],
            ['行6列1', '<span style="color:#ff9f7f;">行6列2</span>', '行6列3'],
            ['行7列1', '行7列2', '<span style="color:#fb7293;">行7列3</span>'],
            ['行8列1', '<span style="color:#e062ae;">行8列2</span>', '行8列3'],
            ['<span style="color:#e690d1;">行9列1</span>', '行9列2', '行9列3'],
            ['行10列1', '<span style="color:#e7bcf3;">行10列2</span>', '行10列3'],
        ],
    },
    basicCard: {
        // 基础卡片
        title: '卡片名称',
        titleFontSize: 21,
        titleColor: '#000',
        selectShadow: {
            default: 'hover',
            option: [{ label: '总是显示', value: 'always' }, { label: '鼠标悬浮时显示', value: 'hover' }, { label: '从不显示', value: 'never' }],
        },
        data: ['列表内容1', '列表内容2', '列表内容3', '列表内容4'],
        descriptionFontSize: 18,
        descriptionColor: '#999'
    },
    imgCard: {
        src: 'https://hbimg.huabanimg.com/5cb695c000d359381b2b902432a8eeb23b3d43901a564-dKX7KM_fw658/format/webp',
        title: '卡片名称',
        titleFontSize: 21,
        titleColor: '#000',
        selectShadow: {
            default: 'hover',
            option: [{ label: '总是显示', value: 'always' }, { label: '鼠标悬浮时显示', value: 'hover' }, { label: '从不显示', value: 'never' }],
        },
        description: '卡片描述',
        descriptionFontSize: 18,
        descriptionColor: '#999'
    },
    steps: {
        // 步骤条  
        nowStep: 2,
        selectNowStatus: {
            default: 'success',
            option: [{ label: '等待', value: 'wait' }, { label: '进行中', value: 'process' }, { label: '完成', value: 'finish' }, { label: '失败', value: 'error' }, { label: '成功', value: 'success' }]
        },
        titleFontSize: 20,
        titleColor: '#fff',
        leftFontSize: 18,
        leftColor: '#5AA4F9',
        rightFontSize: 18,
        rightColor: '#5AA41',
        data: [{ title: '八大关泡泡屋咖啡厅成新网红打卡地', left: '苏金荣', right: '2020-04-09 17:29:52' }, { title: '步骤2', left: '我是左侧数据', right: '我是右侧数据' }, { title: '步骤3', left: '我是左侧数据', right: '我是右侧数据' }, { title: '步骤4', left: '我是左侧数据', right: '我是右侧数据' }],
    },
    stepsHor: {
        // 步骤条 
        nowStep: 2,
        selectNowStatus: {
            default: 'success',
            option: [{ label: '等待', value: 'wait' }, { label: '进行中', value: 'process' }, { label: '完成', value: 'finish' }, { label: '失败', value: 'error' }, { label: '成功', value: 'success' }]
        },
        titleFontSize: 20,
        titleColor: '#fff',
        leftFontSize: 18,
        leftColor: '#5AA4F9',
        rightFontSize: 18,
        rightColor: '#5AA41',
        data: [{ title: '八大关泡泡屋咖啡厅成新网红打卡地', left: '苏金荣', right: '2020-04-09 17:29:52' }, { title: '步骤2', left: '我是左侧数据', right: '我是右侧数据' }, { title: '步骤3', left: '我是左侧数据', right: '我是右侧数据' }, { title: '步骤4', left: '我是左侧数据', right: '我是右侧数据' }],
    },
    progress: {
        data: {
            statusList: [{
                label: '编辑',
                status: 0
            }, {
                label: '合成',
                status: 1
            }, {
                label: '合成',
                status: 2
            }, {
                label: '播送',
                status: 3
            }],
            nowStatus: 2,
            title: '节目进程'
        },
        borderColor: 'rgba(72,249,248,0.36)',
        backgroundColor: 'rgba(21, 107, 104, 0.24)',
        titleColor: 'rgba(72, 249, 248, 1)',
        activeFontColor: '#fff',
        fontColor: 'rgba(119, 124, 124, 1)',
        activeProgressColor: 'rgba(72, 249, 248, 1)',
        progressColor: 'rgba(94, 74, 24, 1)',
        titleFontSize: 30,
        descriptionFontSize: 25,
    },
    empty: {},
    iframe: {
        url: 'http://www.sobey.com'
    },
    tab: {
        data: [{ name: '网站', value: '1' }, { name: 'APP', value: '2' }],
        titleColor: '#fff',
        bgColor: 'rgba(0, 181, 255, 0.3',
        activeTitleColor: '#fff',
        activeBgColor: 'rgba(0, 146, 200, 1)',
        fontSize: 30,
        selectStyle: {
            default: 'hor',
            option: [
                { label: '水平样式', value: 'hor' },
                { label: '垂直样式', value: 'ver' },
                { label: '垂直科技蓝', value: 'verBlue' },
                { label: '垂直暗黑风', value: 'verBlack' },
                { label: '安吉样式', value: 'anji' },
                { label: '内容库水平样式', value: 'dataHor' },
            ],
        },
        Animationtime: 8
    },
    tab1: {
        fontSize: 48,
        titleColor: 'rgba(174,213,235,1)',
        data: [{ name: '网站', value: '1' }, { name: 'APP', value: '2' }],
        Animationtime: 8
    },
    dropDown: {
        data: [{ name: '网站', value: '1' }, { name: 'APP', value: '2' }],
    },
    pagination: {
        bgColor: '#73ACFF',
        activeBgColor: '#FD866A',
        pageSize: 5,
        total: 20,
    },
    video: {
        autoplay: true,
        loop: false,
        data: 'http://demo.datouwang.com/uploads/demo/jiaoben/2018/jiaoben1337/ckin.mp4',
    },
    basicLine: getLinePieBarchartsProperty('line', 'basicLine', false, false),
    line: getLinePieBarchartsProperty('line', 'line', false, false),
    notSmoothLine: getLinePieBarchartsProperty('line', 'notSmoothLine', true, true),
    dataZoomLine: getLinePieBarchartsProperty('line', 'dataZoomLine', false, false),
    stackLine: getLinePieBarchartsProperty('line', 'stackLine', false, false),
    lineAndBar: getLinePieBarchartsProperty('line', 'lineAndBar', false, false),
    bgBar: getLinePieBarchartsProperty('bar', 'bgBar', false, false),
    bar: getLinePieBarchartsProperty('bar', 'bar', false, false),
    singleBar: getLinePieBarchartsProperty('bar', 'singleBar', true, true),
    mulityHorBar: getLinePieBarchartsProperty('bar', 'mulityHorBar', false, false),
    stackHorBar: getLinePieBarchartsProperty('bar', 'stackHorBar', false, false),
    stackBar: getLinePieBarchartsProperty('bar', 'stackBar', false, false),
    pie: getLinePieBarchartsProperty('pie', 'pie', false, false),
    circlePie: getLinePieBarchartsProperty('pie', 'circlePie', false, true),
    circleRadiusPie: getLinePieBarchartsProperty('pie', 'circleRadiusPie', false, true),
    rosePie: getLinePieBarchartsProperty('pie', 'rosePie', false, true),
    percentPie: getLinePieBarchartsProperty('pie', 'percentPie', false, true),
    percent2Pie: getLinePieBarchartsProperty('pie', 'percent2Pie', false, true),
    percent3Pie: getLinePieBarchartsProperty('pie', 'percent3Pie', false, false),
    roseHalfPie: getLinePieBarchartsProperty('pie', 'roseHalfPie', false, true),
    rotateColorful: {
        color: [
            "#00aeef",
            "#0072bc",
            "#2F54EB",
            "#1D39C4",
            "#10239E",
            "#061178",
            "#030852"
        ],
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
            show: true,
            orient: 'vertical',
            left: 'center',
            top: 'middle',
            textStyle: {
                color: '#4ce5ff',
                fontSize: 25,
            },
            itemWidth: 20,
            itemHeight: 10
        },
        label: {
            normal: {
                show: false
            },
        },
        labelLine: {
            normal: {
                show: false
            }
        },
        series: [{
            type: 'pie',
            radius: ['30%', '55%'],
            center: ['50%', '50%'],
            roseType: 'area',
            label: {
                show: false
            },
            emphasis: {
                label: {
                    show: false
                }
            },
        }],
        data: [{
            name: '磁盘空间',
            data: [{ name: '内存', value: 6.5 }, { name: '存储', value: 3.5 }]
        }]
    },
    area: getLinePieBarchartsProperty('map', 'area', false, true),
    runInMap: getLinePieBarchartsProperty('runInMap', 'runInMap', false, true),
    cityMap: getLinePieBarchartsProperty('cityMap', 'cityMap', false, true),
    singleHorBar: {
        color: ["#45c8dc", "#854cff", "#5f45ff", "#47aee3", "#d5d6d8", "#96d7f9", "#f9e264"],
        yAxis: {
            type: 'category',
            axisLine: {
                show: false // 坐标线
            },
            axisTick: {
                show: false // 小横线
            },
            axisLabel: {
                color: '#9CCBF6', // 坐标轴字颜色
                fontSize: 16,
            },
            data: []
        },

        xAxis: {
            show: false,
        },
        grid: {
            top: '40',
            right: '50',
            left: '140',
            bottom: '40' // 图表尺寸大小
        },
        animationDuration: 9000,
        series: [{
            type: 'bar',
            barWidth: '10px',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(29, 146, 209, 0.4)',
                barBorderRadius: [30, 30, 30, 30] // 圆角大小
            },
            label: {
                show: true,
                position: 'right', // 每一条的数据位置
                fontSize: 20,
                color: '#fff'
            },
            itemStyle: {
                normal: {
                    barBorderRadius: [30, 30, 30, 30], // 圆角大小
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 103, 255, 0.2)',
                    shadowOffsetX: -5,
                    shadowOffsetY: 5,
                },
            },

        }],
        data: [{
            "name": "全部",
            "data": [{
                    "name": "2020-03-17",
                    "value": 100
                },
                {
                    "name": "2020-03-18",
                    "value": 221
                },
                {
                    "name": "2020-03-19",
                    "value": 123
                },
                {
                    "name": "2020-03-20",
                    "value": 421
                },
                {
                    "name": "2020-03-21",
                    "value": 211
                },
                {
                    "name": "2020-03-22",
                    "value": 532
                },
                {
                    "name": "2020-03-23",
                    "value": 51
                }
            ]
        }]
    },
    areaPoint: {
        geo: {
            show: true,
            roam: false,
            map: 'china',
            label: {
                normal: {
                    show: true,
                    color: '#EEEFF9',
                },
                emphasis: {
                    label: {
                        show: true,
                    }
                },
            },
            itemStyle: {
                normal: {
                    show: 'true',
                    color: {
                        colorStops: [{
                                offset: 0,
                                color: '#20A0F8', // 0% 处的颜色
                            },
                            {
                                offset: 0.25,
                                color: '#1EADF8', // 0% 处的颜色
                            },
                            {
                                offset: 0.75,
                                color: '#0D7BF8', // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: '#0D9BF8', // 100% 处的颜色
                            },
                        ],
                    }, // 地图背景色
                    borderWidth: 1,
                    borderType: 'dashed',
                    borderColor: '#fff', // 省市边界线
                    shadowColor: 'rgba(166, 230, 236, 0.6)',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 0,
                },
            },
        },
        data: [{ "city": "武汉", "flag": 5, "name": "省情市情01" },
            { "city": "北京", "flag": 2, "name": "上情要闻02" },
            { "city": "上海", "flag": 3, "name": "区情动态0303" },
            { "city": "深圳", "flag": 4, "name": "对标园区0404" }
        ],
        endLine: ["78.309555,52.58",
            "134.309555,54.536562",
            "134.309555,25.536562",
            "78.309555,21.58"
        ]

    },
    dashBoard: {
        tooltip: {
            formatter: '{a} <br/>{b} : {c}%',
        },
        series: [{
            detail: { fontSize: 20, color: '#fff', },
            title: { show: true, color: '#fff', fontSize: 18, },
            itemStyle: {
                color: '#58D9F9',
                shadowColor: 'rgba(0,138,255,0.45)',
                shadowBlur: 10,
                shadowOffsetX: 2,
                shadowOffsetY: 2
            },
            axisLine: {
                roundCap: true,
                lineStyle: {
                    width: 18
                }
            },
            axisTick: {
                splitNumber: 2,
                lineStyle: {
                    width: 2,
                    color: '#999'
                }
            },
            splitLine: {
                length: 12,
                lineStyle: {
                    width: 3,
                    color: '#999'
                }
            },
            axisLabel: {
                distance: 30,
                color: '#999',
                fontSize: 20
            },
            progress: {
                show: true,
                width: 18,
                roundCap: true,
                clip: true,
            },
            pointer: {
                icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                length: '75%',
                width: 16,
                offsetCenter: [0, '5%']
            },
        }],
        data: [{
            name: '业务指标',
            data: [{ value: 50, name: '完成率' }],
        }, ],
    },
    funnel: {
        label: {
            show: true,
            color: '#fff',
            fontSize: 20,
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}%"
        },
        legend: {
            show: true,
            "padding": 5,
            "itemGap": 10,
            "orient": "horizontal",
            "top": "auto",
            "bottom": "auto",
            "icon": "circle",
            "right": "auto",
            "textStyle": {
                "padding": 14,
                "color": "#fff",
                "fontSize": 16
            }
        },
        series: [{
            name: '漏斗图',
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 10,
            label: {
                show: true,
                position: 'inside'
            },
            labelLine: {
                length: 10,
                lineStyle: {
                    width: 1,
                    type: 'solid'
                }
            },
            itemStyle: {
                borderColor: 'transparent',
                borderWidth: 1
            },
            emphasis: {
                label: {
                    fontSize: 20
                }
            },

        }],
        color: ['#07A17D', '#013DA0', '#7605CD', ],
        data: [{
            name: '漏斗图',
            data: [
                { value: 60, name: '访问' },
                { value: 40, name: '咨询' },
                { value: 20, name: '订单' },
                { value: 80, name: '点击' },
                { value: 100, name: '展现' },
            ],
        }, ],
    },
    dot: getLinePieBarchartsProperty('scatter', 'dot', false, false),
    textCloud: getLinePieBarchartsProperty('wordCloud', 'textCloud', false, false),
    textCloud1: getLinePieBarchartsProperty('wordCloud', 'textCloud1', false, false),
    number: {
        data: '00043256',
        fontSize: 48,
        color: [
            "#C34EFF",
            "#0078FF"
        ]
    },
    city: {
        address: '成都索贝数码科技股份有限公司',
        selectMapStyle: {
            default: '极夜蓝',
            option: [{ label: '极夜蓝', value: 1 }, { label: '科技黑', value: 2 }, { label: '涂鸦', value: 3 }, { label: '远山黛', value: 4 }, { label: '梵高', value: 5 }]
        },
        heightFactor: 3,
        buildsOpacity: 1,
        lineWidth: 3,
        lineOpacity: 1,
        lineBlur: 1,
        color: ['#0099cc'],
        radius: 5000,
        interval: 0.5,
        duration: 5,
        trailLength: 0.5,
        rotateSpeed: 0, // 旋转速度 
        gltf: [],
        isShowScann: true,
    },
    mapbox: {
        center: [120.19382669582967, 30.258134],
        isBeat: false,
        isRotate: false,
    },
    cesium: {
        center: [104.104149, 30.67008],
        gltf: [],
        data: {
            streetData: [{
                "id": 6,
                "name": "朱家林村路2",
                "sort": 3,
                "phone": "17865632673",
                "area": [{ "x": -2451009.942849115, "y": 4569264.413747437, "z": 3701709.816495692 }, { "x": -2450994.233721556, "y": 4569283.9550451785, "z": 3701696.188590085 }, { "x": -2450987.1871868116, "y": 4569299.940320679, "z": 3701681.2232443783 }, { "x": -2450964.0446133255, "y": 4569315.966602943, "z": 3701676.793732627 }, { "x": -2450897.921516221, "y": 4569351.054812013, "z": 3701677.258876855 }, { "x": -2450835.749730536, "y": 4569382.524302896, "z": 3701679.5609918092 }, { "x": -2450801.9881165074, "y": 4569399.831301843, "z": 3701680.543422276 }, { "x": -2450798.9152957895, "y": 4569392.879438318, "z": 3701691.0882456936 }, { "x": -2450795.56932099, "y": 4569390.254078698, "z": 3701696.5077642407 }, { "x": -2450717.650473946, "y": 4569429.393692859, "z": 3701699.7587284865 }, { "x": -2450647.1463154037, "y": 4569465.042026412, "z": 3701702.4126201216 }, { "x": -2450585.0290789753, "y": 4569495.773869569, "z": 3701705.578181305 }, { "x": -2450567.226210546, "y": 4569517.609403334, "z": 3701690.5109227286 }, { "x": -2450582.8552646106, "y": 4569510.427545285, "z": 3701689.0397388376 }],
                "content": "<p>位于朱家林村内的一条主干道，途经园区民宿等</p>",
                "switch": 1,
                "ctime": 1568941581,
                "utime": null,
                "children": [

                ]
            }, {
                "id": 5,
                "name": "朱家林村路1",
                "sort": 2,
                "phone": "17865632673",
                area: [{ "x": -2451008.9271157132, "y": 4569264.995070435, "z": 3701709.7717782725 }, { "x": -2450992.001148707, "y": 4569289.204941498, "z": 3701691.2199712046 }, { "x": -2450973.2773161526, "y": 4569313.247225589, "z": 3701674.055764495 }, { "x": -2450954.4459172194, "y": 4569334.836534246, "z": 3701659.969662898 }, { "x": -2450930.3499405067, "y": 4569353.812356767, "z": 3701652.550248531 }, { "x": -2450915.7884091204, "y": 4569370.929795202, "z": 3701641.1385989264 }, { "x": -2450896.3386488087, "y": 4569388.83094433, "z": 3701631.980716619 }, { "x": -2450884.3399527846, "y": 4569405.195581572, "z": 3701619.8062505615 }, { "x": -2450870.240808006, "y": 4569416.20931492, "z": 3701615.5742035094 }, { "x": -2450847.7136014933, "y": 4569422.699102535, "z": 3701622.4321108093 }, { "x": -2450813.1742335823, "y": 4569434.835985574, "z": 3701630.265449477 }, { "x": -2450786.1295003532, "y": 4569444.549226372, "z": 3701636.1413873844 }, { "x": -2450750.0112770977, "y": 4569459.197729148, "z": 3701641.932682308 }, { "x": -2450725.5787991574, "y": 4569472.834867293, "z": 3701641.2787753902 }, { "x": -2450707.1991021326, "y": 4569482.645218481, "z": 3701641.336534207 }, { "x": -2450677.0530444616, "y": 4569496.355754489, "z": 3701644.3496254454 }, { "x": -2450622.9378052694, "y": 4569510.744074372, "z": 3701662.29360148 }, { "x": -2450572.2907705167, "y": 4569544.092226212, "z": 3701654.7076659026 }, { "x": -2450573.6691783015, "y": 4569547.334085793, "z": 3701649.8260803632 }, { "x": -2450574.0561389844, "y": 4569546.646664957, "z": 3701650.4145330065 }, { "x": -2450574.0561389844, "y": 4569546.646664957, "z": 3701650.4145330065 }],
                "content": "<p>位于朱家林村内的一条主干道，途经再生之塔、乡村生活美学馆等景点。</p>",
                "switch": 1,
                "ctime": 1568941343,
                "utime": null,

            }, {
                "id": 4,
                "name": "靠山路",
                "sort": 1,
                "phone": "18392945593",
                "area": [{ "x": -2451051.5029029963, "y": 4569523.528547292, "z": 3701364.7559379423 }, { "x": -2451025.5132569433, "y": 4569507.504898579, "z": 3701401.5003987397 }, { "x": -2450983.5880279453, "y": 4569496.005413176, "z": 3701443.1779365386 }, { "x": -2450956.120983655, "y": 4569488.024637248, "z": 3701471.030261605 }, { "x": -2450923.9639438563, "y": 4569490.9152484825, "z": 3701488.635967414 }, { "x": -2450890.3889169903, "y": 4569496.04616211, "z": 3701504.426790402 }, { "x": -2450871.5838672104, "y": 4569495.405298646, "z": 3701517.580667541 }, { "x": -2450847.0095192846, "y": 4569480.701447405, "z": 3701551.7730695056 }, { "x": -2450813.093447025, "y": 4569484.928295085, "z": 3701568.89581246 }, { "x": -2450771.8195152977, "y": 4569498.171444155, "z": 3701579.8012606534 }, { "x": -2450731.3891667444, "y": 4569518.293024714, "z": 3701581.716988761 }, { "x": -2450679.7795184245, "y": 4569544.368148187, "z": 3701583.68368718 }, { "x": -2450623.306496347, "y": 4569564.815588369, "z": 3701595.7485102927 }, { "x": -2450574.401802639, "y": 4569589.823170378, "z": 3701597.2436510203 }, { "x": -2450537.3501638905, "y": 4569607.257246986, "z": 3701600.2304331716 }, { "x": -2450519.751092831, "y": 4569615.277468283, "z": 3701601.968699374 }, { "x": -2450520.1485554036, "y": 4569614.5714083295, "z": 3701602.573127765 }, { "x": -2450521.8347942526, "y": 4569616.006212838, "z": 3701599.7048786185 }, { "x": -2450522.3445134987, "y": 4569615.100739209, "z": 3701600.480016594 }, { "x": -2450529.9980227496, "y": 4569612.551569356, "z": 3701598.5730491043 }, { "x": -2450529.7248422573, "y": 4569612.483928814, "z": 3701598.835632238 }, { "x": -2450522.6742824055, "y": 4569616.164891477, "z": 3701598.958266427 }, { "x": -2450523.221232016, "y": 4569615.193281641, "z": 3701599.7900207443 }, { "x": -2450524.0957757924, "y": 4569616.396646584, "z": 3701597.7393265287 }, { "x": -2450523.443508045, "y": 4569615.6132709365, "z": 3701599.128850348 }, { "x": -2450523.9734001076, "y": 4569614.671962345, "z": 3701599.934664785 }, { "x": -2450523.9734001076, "y": 4569614.671962345, "z": 3701599.934664785 }],
                "content": "<p>靠山路位于朱家林田园综合体入口处，因地势位置暂时命名</p>",
                "switch": 1,
                "ctime": 1568940764,
                "utime": null,
                "children": [

                ]
            }],
            flyData: [{
                classId: 1,
                label: '停车系统',
                position: [118.21002, 35.70539, 10],
                destination: [-2451159.5868161586, 4569290.571021583, 3701754.3560328917],
                orientation: {
                    heading: 4.7784159152452865,
                    pitch: -0.7199005710200699,
                    roll: 6.278964574356454
                },
                billboard: { image: '../iframe/image/cesium/cheliang.png', width: 35, height: 40 }
            }, {
                classId: 2,
                label: '客流分析系统',
                position: [118.20973, 35.70555, 10],
                destination: [-2451159.5868161586, 4569290.571021583, 3701754.3560328917],
                orientation: {
                    heading: 4.7784159152452865,
                    pitch: -0.7199005710200699,
                    roll: 6.278964574356454
                },
                billboard: { image: '../iframe/image/cesium/jiankong.png', width: 35, height: 40 }
            }, {
                classId: 3,
                label: '共享车系统',
                position: [118.20996, 35.70557, 10],
                destination: [-2451159.5868161586, 4569290.571021583, 3701754.3560328917],
                orientation: {
                    heading: 4.7784159152452865,
                    pitch: -0.7199005710200699,
                    roll: 6.278964574356454
                },
                billboard: { image: '../iframe/image/cesium/danche.png', width: 35, height: 40 }
            }, {
                classId: 4,
                label: '客流分析系统',
                position: [118.20791, 35.70462, 10],
                destination: [-2450973.9005359965, 4569478.622018611, 3701642.217128693],
                orientation: {
                    heading: 5.826378716674048,
                    pitch: -1.0191041936859877,
                    roll: 6.280496895150513
                },
                billboard: { image: '../iframe/image/cesium/jiankong.png', width: 35, height: 40 }
            }, {
                classId: 5,
                label: '环境监测仪',
                position: [118.20643, 35.70390, 10],
                destination: [-2450867.048225528, 4569612.047961829, 3701548.8839329774],
                orientation: {
                    heading: 6.207562284597419,
                    pitch: -0.8256027311625922,
                    roll: 6.282829821595243
                },
                billboard: { image: '../iframe/image/cesium/haunjinjiance.png', width: 35, height: 40 }
            }, {
                classId: 6,
                label: '支付系统',
                position: [118.20597, 35.70488, 10],
                destination: [-2450828.327522273, 4569551.352179894, 3701648.822710052],
                orientation: {
                    heading: 5.778416384996152,
                    pitch: -0.8312999567210166,
                    roll: 6.2808965083199375
                },
                billboard: { image: '../iframe/image/cesium/zhifu.png', width: 35, height: 40 }
            }]
        }
    },
    smartCity: {
        "luminanceAtZenith": 0.2, // 材质底色
        bloomEnabled: true
    },
    lineAndScatterEarth: {
        globe: {
            viewControl: {
                autoRotate: true,
                autoRotateSpeed: 5, // 旋转速度
            }
        },
        series: [{
            type: 'lines3D',
            coordinateSystem: 'globe',
            blendMode: 'lighter',
            effect: {
                show: true,
                trailWidth: 2,
                trailLength: 0.15,
                trailOpacity: 1,
                trailColor: '#E7EE98',
                constantSpeed: 40,
                period: 4
            },
            lineStyle: {
                width: 1,
                color: '#FF5533',
                opacity: 0
            },
        }, {
            type: 'scatter3D',
            coordinateSystem: 'globe',
            blendMode: 'lighter',
            symbolSize: 2,
            itemStyle: {
                color: '#F8E71C',
                opacity: 1
            },
        }],
        data: {
            lineData: [],
            scatterData: []
        }
    },
    lineEarth: {
        globe: {
            viewControl: {
                autoRotate: true,
                autoRotateSpeed: 5, // 旋转速度
            }
        },
        series: {
            type: 'lines3D',
            coordinateSystem: 'globe',
            blendMode: 'lighter',
            effect: {
                show: true,
                trailWidth: 2,
                trailLength: 0.15,
                constantSpeed: 40,
                trailOpacity: 1,
                trailColor: 'rgb(30, 30, 60)'
            },
            lineStyle: {
                width: 1,
                color: 'rgb(50, 50, 150)',
                opacity: 0.1
            },
        },
        data: []
    },
    scatterEarth: {
        globe: {
            viewControl: {
                autoRotate: true,
                autoRotateSpeed: 5, // 旋转速度
            },
            globeOuterRadius: 220,
        },
        series: {
            type: 'scatter3D',
            coordinateSystem: 'globe',
            blendMode: 'lighter',
            symbolSize: 2,
            itemStyle: {
                color: '#19E0EE',
                opacity: 1
            },
        },
        data: []
    },
    basicEarth: {
        globe: {
            viewControl: {
                autoRotate: true,
                autoRotateSpeed: 5, // 旋转速度
            },
        },
        data: []
    },
    wave: {
        vertexCount: 10000,
        vertexSize: 3,
        oceanWidth: 204,
        oceanHeight: -80,
        gridSize: 32,
        waveSize: 16,
        perspective: 500,

    },
    spaceTime: {
        data: 'Sobey'
    },
    queue: {
        rotateX: 1,
        rotateY: 0,
        rotateZ: 0,
        data: [
            '科技', '创新', 'AI', '技术', '北京', 'JS', '智慧', '3D', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        ],
        selectStatus: {
            default: 'helix',
            option: [{ label: '螺旋', value: 'helix' }, { label: '球体', value: 'sphere' }, { label: '队列', value: 'grid' }]
        }
    },
    flyLine: {
        color: 'rgb(13,64,140)',
        enable: true,
        interval: 1,
        duration: 2,
        trailLength: 0.8,
        opacity: 0.6,
        selectType: {
            default: 'greatcircle',
            option: [{ label: '大圆航线', value: 'greatcircle' }, { label: '3D弧线', value: 'arc3d' }, { label: '路径图', value: 'line' }, { label: '弧线', value: 'arc' }]
        },
        data: []
    },
    lightCity: {
        address: '上海东方明珠',
        baseColor: 'rgb(16,16,16)',
        windowColor: 'rgb(30,60,89)',
        brightColor: 'rgb(255,176,38)',
        color: 'rgba(242,246,250,0.5)',
        radius: 5000,
        lineColor: '#ff893a',
        opacity: 1,
        interval: 1,
        duration: 2,
        trailLength: 0.8,
        enableCity: true,
        enableLine: true,
        gltf: [],
        data: []
    },
    heatCity: {
        rampColors: [
            '#2E8AE6',
            '#69D1AB',
            '#DAF291',
            '#FFD591',
            '#FF7A45',
            '#CF1D49'
        ],
        opacity: 1,
        radius: 20,
        intensity: 2,
        selectType: {
            default: 'heatmap3D',
            option: [{ label: '2D热力图', value: 'heatmap' }, { label: '3D热力图', value: 'heatmap3D' }]
        },
        data: []
    },
    heatGridCity: {
        data: [],
        coverage: 2,
        angle: 0,
        color: ["#0A1FB2", "#1A7AFF", "#02BEFF", "#46F3FF", "#FFE754", "#FFB02A", "#FF7412", "#FF3417"],
    },
    columnCity: {
        color: ["#002466", "#105CB3", "#2894E0", "#CFF6FF", "#FFF5B8", "#FFAB5C", "#F27049", "#730D1C"],
        data: []
    },
    lineCity: {
        address: '成都索贝数码科技股份有限公司',
        color: '#ff893a',
        enable: true,
        interval: 1,
        duration: 2,
        trailLength: 0.8,
        opacity: 0.6,
        data: [],
        radius: 5000
    },
    pointerCity: {
        color: '#0D408C',
        size: 1,
        opacity: 1,
        data: []
    },
    popCity: {
        color: '#4cfd47',
        size: 56,
        opacity: 1,
        animate: true,
        active: true,
        data: []
    },
    weather: {
        address: '成都市',
        color: "#fff",
        fontSize: 25,
        isOpenAnimation: true
    }
};
export default elementList;