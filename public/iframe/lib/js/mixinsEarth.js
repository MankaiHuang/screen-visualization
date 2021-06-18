/*
 * @Descripttion: 3D地球组件
 * @Author: cbz
 * @Date: 2020-12-18 10:06:35
 * @LastEditors: cbz
 * @LastEditTime: 2021-01-07 17:56:34
 */
Vue.mixin({
  methods: {
    dataToScatter (data) {
      // csv 数据转line
      const result = []
      for (const item of data) {
        result.push([Number(item.lng), Number(item.lat), Math.sqrt(Number(item.value))])
      }
      return result;
    },
    dataToLine (data) {
      // csv 数据转line
      const result = []
      for (const item of data) {
        result.push([[Number(item.lng1), Number(item.lat1)], [Number(item.lng2), Number(item.lat2)]])
      }
      return result;
    },
    initEarth () {
      Vue.component(`x-lineAndScatterEarth`, {
        props: {
          option: {
            type: Object,
            default: () => {
              return {};
            },
          },
          id: {
            type: String,
            default: ''
          }
        },
        watch: {
          option: {
            handler () {
              this.initChart()
            },
          }
        },
        data () {
          return {
            myChart: null,
            chartOption: {
              globe: {
                environment: `${vm.staticUrl}/image/scatterEarth/star.jpg`,
                heightTexture: `${vm.staticUrl}/image/scatterEarth/bathymetry_bw_composite_4k.jpg`,
                displacementScale: 0.05,
                displacementQuality: 'high',
                baseColor: '#000',
                shading: 'realistic',
                realisticMaterial: {
                  roughness: 0.2,
                  metalness: 0
                },

                postEffect: {
                  enable: true,

                },
                temporalSuperSampling: {
                  enable: true
                },
                light: {
                  ambient: {
                    intensity: 0
                  },
                  main: {
                    intensity: 0.1,
                    shadow: false
                  },
                },
              },
            }
          }
        },
        mounted () {
          this.initChart()
        },
        beforeDestroy () {
          this.myChart.clear()
        },
        methods: {
          async initChart () {
            this.chartOption = vm.MergeRecursive(JSON.parse(JSON.stringify(this.chartOption)), JSON.parse(JSON.stringify(this.option)))
            // console.log(this.chartOption)
            this.myChart = echarts.init(document.getElementById(this.id, null, { renderer: 'canvas' }));
            let lineData = []
            let scatterData = []
            if (this.option.data.lineData.length === 0) {
              const defaultData = await axios.get(`${vm.staticUrl}/excel/lineEarth.text`)
              lineData = vm.CSV(defaultData.data)
            } else {
              lineData = this.option.data.lineData
            }
            lineData = this.dataToLine(lineData)
            if (this.option.data.scatterData.length === 0) {
              const defaultData = await axios.get(`${vm.staticUrl}/excel/scatterEarth.text`)
              scatterData = vm.CSV(defaultData.data)
            } else {
              scatterData = this.option.data.scatterData
            }
            scatterData = this.dataToScatter(scatterData)
            delete this.chartOption.data
            this.chartOption.series[0].data = lineData
            this.chartOption.series[1].data = scatterData
            this.myChart.setOption(this.chartOption);
            this.myChart.resize()
          },
          handleResize () {
            vm.debounce(this.myChart.resize, 200)
          },

        },
        template: `<div  class="full">
        <div :id="id" class="full"/>
        <resize-observer @notify="handleResize" />
        </div>`,
      });
      Vue.component(`x-lineEarth`, {
        props: {
          option: {
            type: Object,
            default: () => {
              return {};
            },
          },
          id: {
            type: String,
            default: ''
          }
        },
        watch: {
          option: {
            handler () {
              this.initChart()
            },
          }
        },
        data () {
          return {
            myChart: null,
            chartOption: {
              globe: {
                baseTexture: `${vm.staticUrl}/image/lineEarth/starfield.jpg`,
                environment: `${vm.staticUrl}/image/lineEarth/star.jpg`,
                heightTexture: `${vm.staticUrl}/image/lineEarth/bathymetry_bw_composite_4k.jpg`,
                shading: 'lambert',
                displacementScale: 0.08,
                light: {
                  ambient: {
                    intensity: 0.4
                  },
                  main: {
                    intensity: 0.4
                  },
                  ambientCubemap: {
                    texture: `${vm.staticUrl}/image/lineEarth/pisa.hdr`,
                    diffuseIntensity: 0.2
                  }
                },
              },
            }
          }
        },
        beforeDestroy () {
          this.myChart.clear()
        },
        mounted () {
          this.initChart()
        },
        methods: {
          async initChart () {
            this.chartOption = vm.MergeRecursive(JSON.parse(JSON.stringify(this.chartOption)), JSON.parse(JSON.stringify(this.option)))
            // console.log(this.chartOption)
            this.myChart = echarts.init(document.getElementById(this.id, null, { renderer: 'canvas' }));
            let data = []
            if (this.option.data.length === 0) {
              const defaultData = await axios.get(`${vm.staticUrl}/excel/lineEarth.text`)
              data = vm.CSV(defaultData.data)
            } else {
              data = this.option.data
            }
            data = this.dataToLine(data)
            delete this.chartOption.data
            this.chartOption.series.data = data
            this.myChart.setOption(this.chartOption);
            this.myChart.resize()
          },
          handleResize () {
            vm.debounce(this.myChart.resize, 200)
          },
          dataToLine (data) {
            // csv 数据转line
            const result = []
            for (const item of data) {
              result.push([[Number(item.lng1), Number(item.lat1)], [Number(item.lng2), Number(item.lat2)]])
            }
            return result;
          }
        },
        template: `<div  class="full">
        <div :id="id" class="full"/>
        <resize-observer @notify="handleResize" />
        </div>`,
      });
      Vue.component(`x-scatterEarth`, {
        props: {
          option: {
            type: Object,
            default: () => {
              return {};
            },
          },
          id: {
            type: String,
            default: ''
          }
        },
        watch: {
          option: {
            handler () {
              this.initChart()
            },
          }
        },
        data () {
          return {
            myChart: null,
            chartOption: {
              globe: {
                environment: `${vm.staticUrl}/image/scatterEarth/star.jpg`,
                heightTexture: `${vm.staticUrl}/image/scatterEarth/bathymetry_bw_composite_4k.jpg`,
                displacementScale: 0.05,
                displacementQuality: 'high',
                baseColor: '#000',
                shading: 'realistic',
                realisticMaterial: {
                  roughness: 0.2,
                  metalness: 0
                },

                postEffect: {
                  enable: true,

                },
                temporalSuperSampling: {
                  enable: true
                },
                light: {
                  ambient: {
                    intensity: 0
                  },
                  main: {
                    intensity: 0.1,
                    shadow: false
                  },
                },
              },
            }
          }
        },
        mounted () {
          this.initChart()
        },
        beforeDestroy () {
          this.myChart.clear()
        },
        methods: {
          async initChart () {
            this.chartOption = vm.MergeRecursive(JSON.parse(JSON.stringify(this.chartOption)), JSON.parse(JSON.stringify(this.option)))
            // console.log(this.chartOption)
            this.myChart = echarts.init(document.getElementById(this.id, null, { renderer: 'canvas' }));
            let data = []
            if (this.option.data.length === 0) {
              const defaultData = await axios.get(`${vm.staticUrl}/excel/scatterEarth.text`)
              data = vm.CSV(defaultData.data)
            } else {
              data = this.option.data
            }
            data = this.dataToScatter(data)
            delete this.chartOption.data
            this.chartOption.series.data = data
            this.myChart.setOption(this.chartOption);
            this.myChart.resize()
          },
          handleResize () {
            vm.debounce(this.myChart.resize, 200)
          },

        },
        template: `<div  class="full">
        <div :id="id" class="full"/>
        <resize-observer @notify="handleResize" />
        </div>`,
      });
      Vue.component(`x-basicEarth`, {
        props: {
          option: {
            type: Object,
            default: () => {
              return {};
            },
          },
          id: {
            type: String,
            default: ''
          }
        },
        watch: {
          option: {
            handler () {
              this.initChart()
            },
          }
        },
        data () {
          return {
            myChart: null,
            chartOption: {
              globe: {
                baseTexture: `${vm.staticUrl}/image/basicEarth/world.topo.bathy.200401.jpg`,
                environment: `${vm.staticUrl}/image/basicEarth/starfield.jpg`,
                heightTexture: `${vm.staticUrl}/image/basicEarth/world.topo.bathy.200401.jpg`,
                shading: 'realistic',
                realisticMaterial: {
                  roughness: 0.9
                },
                light: {
                  main: {
                    intensity: 1.5,
                    shadow: true
                  },
                  ambientCubemap: {
                    texture: `${vm.staticUrl}/image/basicEarth/pisa.hdr`,
                    diffuseIntensity: 0.8
                  }
                }
              }
            }
          }
        },
        mounted () {
          this.initChart()
        },
        beforeDestroy () {
          this.myChart.clear()
        },
        methods: {
          async initChart () {
            this.chartOption = vm.MergeRecursive(JSON.parse(JSON.stringify(this.chartOption)), JSON.parse(JSON.stringify(this.option)))
            this.myChart = echarts.init(document.getElementById(this.id, null, { renderer: 'canvas' }));
            await this.myChart.setOption(this.chartOption);
            this.myChart.resize()
          },
          handleResize () {
            vm.debounce(this.myChart.resize, 200)
          },
        },
        template: `<div  class="full">
        <div :id="id" class="full"/>
        <resize-observer @notify="handleResize" />
        </div>`,
      });

    }
  }
})