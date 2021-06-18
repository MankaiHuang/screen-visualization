// export default {
//   'GET /chart/list': (req, res) => {
//     res.send({
//       'area': {
//         title: {
//           text: '堆叠区域图'
//         },
//         tooltip: {
//           trigger: 'axis',
//           axisPointer: {
//             type: 'cross',
//             label: {
//               backgroundColor: '#6a7985'
//             }
//           }
//         },
//         legend: {
//           data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
//         },
//         toolbox: {
//           feature: {
//             saveAsImage: {}
//           }
//         },
//         grid: {
//           left: '3%',
//           right: '4%',
//           bottom: '3%',
//           containLabel: true
//         },
//         xAxis: [{
//           type: 'category',
//           boundaryGap: false,
//           data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
//         }],
//         yAxis: [{
//           type: 'value'
//         }],
//         series: [{
//           name: '邮件营销',
//           type: 'line',
//           stack: '总量',
//           areaStyle: {
//             normal: {}
//           },
//           data: [120, 132, 101, 134, 90, 230, 210]
//         },
//         {
//           name: '联盟广告',
//           type: 'line',
//           stack: '总量',
//           areaStyle: {
//             normal: {}
//           },
//           data: [220, 182, 191, 234, 290, 330, 310]
//         },
//         {
//           name: '视频广告',
//           type: 'line',
//           stack: '总量',
//           areaStyle: {
//             normal: {}
//           },
//           data: [150, 232, 201, 154, 190, 330, 410]
//         },
//         {
//           name: '直接访问',
//           type: 'line',
//           stack: '总量',
//           areaStyle: {
//             normal: {}
//           },
//           data: [320, 332, 301, 334, 390, 330, 320]
//         },
//         {
//           name: '搜索引擎',
//           type: 'line',
//           stack: '总量',
//           label: {
//             normal: {
//               show: true,
//               position: 'top'
//             }
//           },
//           areaStyle: {
//             normal: {}
//           },
//           data: [820, 932, 901, 934, 1290, 1330, 1320]
//         }
//         ]
//       },
//       'bar': {
//         title: {
//           text: '销量统计'
//         },
//         tooltip: {},
//         legend: {
//           data: ['销量']
//         },
//         xAxis: {
//           data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
//         },
//         yAxis: {},
//         series: [{
//           name: '销量',
//           type: 'bar',
//           data: [5, 20, 36, 10, 10, 20]
//         }]
//       },
//       "radar": {
//         title: {
//           text: '基础雷达图'
//         },
//         tooltip: {},
//         legend: {
//           data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
//         },
//         radar: {
//           // shape: 'circle',
//           name: {
//             textStyle: {
//               color: '#fff',
//               backgroundColor: '#999',
//               borderRadius: 3,
//               padding: [3, 5]
//             }
//           },
//           indicator: [
//             { name: '销售（sales）', max: 6500 },
//             { name: '管理（Administration）', max: 16000 },
//             { name: '信息技术（Information Techology）', max: 30000 },
//             { name: '客服（Customer Support）', max: 38000 },
//             { name: '研发（Development）', max: 52000 },
//             { name: '市场（Marketing）', max: 25000 }
//           ]
//         },
//         series: [{
//           name: '预算 vs 开销（Budget vs spending）',
//           type: 'radar',
//           // areaStyle: {normal: {}},
//           data: [
//             {
//               value: [4300, 10000, 28000, 35000, 50000, 19000],
//               name: '预算分配（Allocated Budget）'
//             },
//             {
//               value: [5000, 14000, 28000, 31000, 42000, 21000],
//               name: '实际开销（Actual Spending）'
//             }
//           ]
//         }]
//       },
//       "pie": {
//         tooltip: {
//           trigger: 'item',
//           formatter: '{a} <br/>{b}: {c} ({d}%)'
//         },
//         legend: {
//           orient: 'vertical',
//           left: 10,
//           data: ['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他']
//         },
//         series: [
//           {
//             name: '访问来源',
//             type: 'pie',
//             selectedMode: 'single',
//             radius: [0, '30%'],

//             label: {
//               position: 'inner'
//             },
//             labelLine: {
//               show: false
//             },
//             data: [
//               { value: 335, name: '直达', selected: true },
//               { value: 679, name: '营销广告' },
//               { value: 1548, name: '搜索引擎' }
//             ]
//           },
//           {
//             name: '访问来源',
//             type: 'pie',
//             radius: ['40%', '55%'],
//             label: {
//               formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
//               backgroundColor: '#eee',
//               borderColor: '#aaa',
//               borderWidth: 1,
//               borderRadius: 4,
//               // shadowBlur:3,
//               // shadowOffsetX: 2,
//               // shadowOffsetY: 2,
//               // shadowColor: '#999',
//               // padding: [0, 7],
//               rich: {
//                 a: {
//                   color: '#999',
//                   lineHeight: 22,
//                   align: 'center'
//                 },
//                 // abg: {
//                 //     backgroundColor: '#333',
//                 //     width: '100%',
//                 //     align: 'right',
//                 //     height: 22,
//                 //     borderRadius: [4, 4, 0, 0]
//                 // },
//                 hr: {
//                   borderColor: '#aaa',
//                   width: '100%',
//                   borderWidth: 0.5,
//                   height: 0
//                 },
//                 b: {
//                   fontSize: 16,
//                   lineHeight: 33
//                 },
//                 per: {
//                   color: '#eee',
//                   backgroundColor: '#334455',
//                   padding: [2, 4],
//                   borderRadius: 2
//                 }
//               }
//             },
//             data: [
//               { value: 335, name: '直达' },
//               { value: 310, name: '邮件营销' },
//               { value: 234, name: '联盟广告' },
//               { value: 135, name: '视频广告' },
//               { value: 1048, name: '百度' },
//               { value: 251, name: '谷歌' },
//               { value: 147, name: '必应' },
//               { value: 102, name: '其他' }
//             ]
//           }
//         ]
//       },
//       "dot": {
//         xAxis: {},
//         yAxis: {},
//         series: [{
//           symbolSize: 20,
//           data: [
//             [10.0, 8.04],
//             [8.0, 6.95],
//             [13.0, 7.58],
//             [9.0, 8.81],
//             [11.0, 8.33],
//             [14.0, 9.96],
//             [6.0, 7.24],
//             [4.0, 4.26],
//             [12.0, 10.84],
//             [7.0, 4.82],
//             [5.0, 5.68]
//           ],
//           type: 'scatter'
//         }]
//       },
//       "line": {
//         xAxis: {
//           type: 'category',
//           data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//         },
//         yAxis: {
//           type: 'value'
//         },
//         series: [{
//           data: [820, 932, 901, 934, 1290, 1330, 1320],
//           type: 'line'
//         }]
//       },
//     });
//   },
// };
