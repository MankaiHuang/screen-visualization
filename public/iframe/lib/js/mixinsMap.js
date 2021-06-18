/*
 * @Descripttion: 3D地图组件
 * @Author: cbz
 * @Date: 2020-06-01 10:23:02
 * @LastEditors: cbz
 * @LastEditTime: 2021-03-18 16:06:53
 */

Vue.mixin({
  methods: {
    initL7Map (id, mapConfig, callback) {
      /** 初始化 L7地图 
       * @name: 
       * @param {id 地图id mapConfig 地图初始化参数 callback初始化成功回调}
       * @return {*}
       */
      const scene = new L7.Scene({
        id,
        map: new L7.GaodeMap({
          style: mapConfig.style, // 样式URL
          center: mapConfig.center,
          pitch: mapConfig.pitch,
          zoom: mapConfig.zoom,
          plugin: mapConfig.plugin || [],
          token: 'b1876df77766a9ea12e4e047fc3588fc'
        })

      });
      scene.on('loaded', () => {
        callback(scene)
      });
    },
    async searchGeo (address, radius, callback) {
      /** 地理转坐标并获取radius范围内的路网数据并转换为geoData
       * @name: 
       * @param {address 中文地址 radius 范围 traff 路网数据}
       * @return {*}
       */
      const traff = {
        type: "FeatureCollection",
        name: "dl2",
        crs: {
          type: "name",
          properties: {
            name: "urn:ogc:def:crs:OGC:1.3:CRS84"
          }
        },
        features: []
      }
      let center = []
      if (typeof address === 'object') {
        center = address
      } else {
        const { data } = await axios.get(`https://restapi.amap.com/v3/geocode/geo?key=502123a4f08bd95be55b49ae6eabd728&address=${address}`)
        center = data.geocodes[0].location.split(',')
      }
      // 获取转换后的线条数据
      const traffData = await axios.get(`https://restapi.amap.com/v3/traffic/status/circle?location=${center.join()}&radius=${radius}&key=502123a4f08bd95be55b49ae6eabd728&extensions=all`)
      traffData.data.trafficinfo.roads.map(item => {
        const coordinates = []
        const coord = []
        coordinates.push(item.polyline.split(';'))
        coordinates.map(item => {
          coord.push(item.map(ite => {
            return ite.split(',').map(it => {
              return it = Number(it)
            })
          }))
        })
        coord.map(item => {
          traff.features.push({ type: 'Feature', properties: {}, geometry: { type: 'MultiLineString', coordinates: [item] } })
        })
      })
      callback({ traff, center })
    },
    drawTraffLineLayer (scene, traff, config) {
      /** 绘制路网轨迹图
       * @name: 
       * @param {*}
       * @return {*}
       */
      const lineLayer = new L7.LineLayer({
        zIndex: 2
      }).source(traff).size(1).shape('line').color(config.color).animate({
        enable: config.enable,
        interval: config.interval,
        duration: config.duration,
        trailLength: config.trailLength
      }).style({
        opacity: config.opacity
      })
      scene.addLayer(lineLayer)
      return lineLayer
    },
    updateData (layer, data) {
      // 更新图层数据
      if (layer) {
        layer.setData(data)
      }
    },
    updateStyle (layer, keyName, value, object3Dlayer, scene) {
      // 更新图层样式
      // layer 图层 keyName 更新的key值 value 更新的值
      if (!layer) return;
      switch (keyName) {
        case 'color':
        case 'active':
        case 'size':
        case 'animate':
        case 'shape':
          {
            layer[keyName](value)
            // layer.color(this.option.color);
          } break;
        case 'enable':
        case 'interval':
        case 'duration':
        case 'trailLength': {
          layer.animate({
            [keyName]: value,
          })
        }; break;
        case 'opacity':
        case 'strokeWidth':
        case 'stroke':
        case 'baseColor':
        case 'windowColor':
        case 'brightColor':
        case 'baseColor':
        case 'intensity':
        case 'radius':
        case 'coverage':
        case 'angle': {
          layer.style({
            [keyName]: value,
          })
        }; break;
        case 'selectType': {
          layer.shape(value.default)
        }; break;
        case 'rampColors': {
          layer.style({
            rampColors: {
              colors: value,
            }
          })
        }; break
        case 'gltf': {
          value.map(item => {
            this.addGITF(item.lnglat, item.selectGltf, item.config, object3Dlayer, scene)
          })
        }
      }
    },
    addGITF (lnglat, selectGltf, config, object3Dlayer, scene) {
      const urlDuck = `./3d/${selectGltf}/scene.gltf`;
      const paramDuck = {
        position: new AMap.LngLat(lnglat[0], lnglat[1]), // 必须
        scale: config.scale || 1, // 非必须，默认1
        height: config.height || 0,  // 非必须，默认0
        scene: 0, // 非必须，默认0
      };
      const gltfObj = new AMap.GltfLoader();
      gltfObj.load(urlDuck, gltfDuck => {
        gltfDuck.setOption(paramDuck);
        gltfDuck.rotateX(config.rotateX || 90);
        gltfDuck.rotateZ(config.rotateZ || 120);
        object3Dlayer.add(gltfDuck);
        scene.map.add(object3Dlayer)
      });
      scene.panTo(lnglat)
      scene.setPitch(50)
      scene.setZoom(17)
    },
    async updateAddress (address) {
      await vm.searchGeo(address, this.option.radius, (result) => {
        this.scene.panTo(result.center)
        vm.updateData(this.lineLayer, result.traff)
      })
    },
    initMap () {
      // 气泡图
      Vue.component('x-popCity', {
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
          'option.data': {
            handler (newVal) {
              vm.updateData(this.pointLayer, newVal)
            }
          }
        },
        data () {
          return {
            scene: null,
            pointLayer: null,
            data: null
          }
        },
        beforeDestroy () {
          this.scene && this.scene.destroy()
          this.scene = null
        },
        mounted () {
          setTimeout(() => {
            this.init()
          }, 10);
          Object.keys(this.option)
            .filter(_ => !["data"].includes(_))
            .forEach(_ => {
              this.$watch(vm => vm.option[_], (newValue) => {
                vm.updateStyle(this.pointLayer, _, newValue)
                this.scene && this.scene.render()
              });
            });
        },
        methods: {
          updateStyle () {
            if (this.pointLayer) {
              this.pointLayer.active(this.option.active)
              this.pointLayer.color(this.option.color)
              this.pointLayer.animate(this.option.animate)
              this.pointLayer.size(this.option.size)
              this.pointLayer.style({
                opacity: this.option.opacity
              })
            }
          },
          async drawPointLayer () {
            this.pointLayer = new L7.PointLayer({})
              .source(this.data, {
                parser: {
                  type: 'csv',
                  x: 'Longitude',
                  y: 'Latitude',
                }
              })
              .shape('circle')
              .active(this.option.active)
              .animate(this.option.animate)
              .size(56)
              .color(this.option.color)
              .style({
                opacity: this.option.opacity
              });
            this.scene.addLayer(this.pointLayer)
          },
          async initData () {
            if (this.option.data.length === 0) {
              const defaultData = await axios.get('https://gw.alipayobjects.com/os/basement_prod/9078fd36-ce8d-4ee2-91bc-605db8315fdf.csv')
              this.data = defaultData.data
            } else {
              this.data = this.option.data
            }
          },
          init () {
            const mapConfig = {
              style: "amap://styles/7e3bb5bc6ed4019b2fe41a29167fd026", // 样式URL
              pitch: 0,
              center: [112, 23.69],
              zoom: 2.5,
            }
            this.initL7Map(`map${this.id}`, mapConfig, async (scene) => {
              this.scene = scene
              await this.initData()
              this.drawPointLayer()
            })
          }
        },
        template: `<div class="full" :id="'map'+id"></div>`
      })

      Vue.component('x-pointerCity', {
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
          'option.data': {
            handler (newVal) {
              vm.updateData(this.pointLayer, newVal)
            }
          }
        },
        data () {
          return {
            scene: null,
            pointLayer: null,
            data: null
          }
        },
        beforeDestroy () {
          this.scene && this.scene.destroy()
          this.scene = null
        },
        mounted () {
          setTimeout(() => {
            this.init()
          }, 10);
          Object.keys(this.option)
            .filter(_ => !["data"].includes(_))
            .forEach(_ => {
              this.$watch(vm => vm.option[_], (newValue) => {
                vm.updateStyle(this.pointLayer, _, newValue)
                this.scene && this.scene.render()
              });
            });
        },
        methods: {
          drawPointerLayer () {
            this.pointLayer = new L7.PointLayer({}).source(this.data, {
              parser: {
                type: 'csv',
                y: 'lat',
                x: 'lng'
              }
            }).size(this.option.size).color(this.option.color).style({
              stroke: this.option.stroke,
              strokeWidth: this.option.strokeWidth,
              opacity: this.option.opacity
            })
            this.scene.addLayer(this.pointLayer)
          },
          async initData () {
            if (this.option.data.length === 0) {
              const defaultData = await axios.get('./excel/pointerCity.text')
              this.data = defaultData.data
            } else {
              this.data = this.option.data
            }
          },
          init () {
            const mapConfig = {
              style: "amap://styles/62a0eed57a13e1a23dad2a24cc1ae404", // 样式URL
              center: [121.51222019389274, 31.23572578718841],
              pitch: 0,
              zoom: 11,
            }
            this.initL7Map(`map${this.id}`, mapConfig, async (scene) => {
              this.scene = scene
              await this.initData()
              await this.drawPointerLayer()
            })
          }
        },
        template: `<div class="full" :id="'map'+id"></div>`
      })

      Vue.component('x-lineCity', {
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
          'option.data': {
            handler (newVal) {
              vm.updateData(this.lineLayer, newVal)
            }
          },
          'option.address': {
            handler (newVal) {
              this.updateAddress(newVal)
            }
          }
        },
        beforeDestroy () {
          this.scene && this.scene.destroy()
          this.scene = null
        },
        data () {
          return {
            scene: {},
            lineLayer: null,
            data: null,
            center: null,
            traff: null,
          }
        },
        async mounted () {
          setTimeout(() => {
            this.init()
          }, 10);
          Object.keys(this.option)
            .filter(_ => !["data"].includes(_))
            .filter(_ => !["address"].includes(_))
            .forEach(_ => {
              this.$watch(vm => vm.option[_], (newValue) => {
                vm.updateStyle(this.lineLayer, _, newValue)
                this.scene && this.scene.render()
              });
            });
        },
        methods: {
          async updateAddress () {
            await vm.searchGeo(this.option.address, this.option.radius, (result) => {
              this.scene.panTo(result.center)
              vm.updateData(this.lineLayer, result.traff)
            })
          },
          init () {
            const mapConfig = {
              style: "amap://styles/62a0eed57a13e1a23dad2a24cc1ae404", // 样式URL
              center: ["104.038153", "30.595381"],
              pitch: 45,
              zoom: 16,
            }
            this.initL7Map(`map${this.id}`, mapConfig, (scene) => {
              this.scene = scene
              vm.searchGeo(this.option.address, this.option.radius, (result) => {
                this.scene.panTo(result.center)
                const traffConfig = {
                  enable: this.option.enable,
                  interval: this.option.interval,
                  duration: this.option.duration,
                  trailLength: this.option.trailLength,
                  opacity: this.option.opacity,
                  color: this.option.color
                }
                this.lineLayer = this.drawTraffLineLayer(this.scene, result.traff, traffConfig)
              })
            })
          }
        },
        template: `<div class="full" :id="'map'+id"></div>`
      })

      Vue.component('x-columnCity', {
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
          'option.data': {
            handler (newVal) {
              vm.updateData(this.pointLayer, newVal)
            }
          }
        },
        data () {
          return {
            scene: null,
            pointLayer: null,
            data: null
          }
        },
        mounted () {
          setTimeout(() => {
            this.init()
          }, 10);
          Object.keys(this.option)
            .filter(_ => !["data"].includes(_))
            .forEach(_ => {
              this.$watch(vm => vm.option[_], (newValue) => {
                vm.updateStyle(this.pointLayer, _, newValue)
                this.scene && this.scene.render()
              });
            });
        },
        methods: {
          drawPointerLayer () {
            this.pointLayer = new L7.PointLayer({
              zIndex: 2
            }).source(this.data, {
              parser: {
                type: 'csv',
                x: 'j',
                y: 'w'
              }
            }).shape('cylinder').size('t', function (level) {
              return [2, 2, level * 3 + 20];
            }).active(true).color('t', this.option.color)
            this.scene.addLayer(this.pointLayer)
          },
          async initData () {
            if (this.option.data.length === 0) {
              const defaultData = await axios.get('./excel/columnCity.text')
              this.data = defaultData.data
            } else {
              this.data = this.option.data
            }
          },
          init () {
            const mapConfig = {
              style: "amap://styles/62a0eed57a13e1a23dad2a24cc1ae404", // 样式URL
              center: [120.19382669582967, 30.258134],
              pitch: 0,
              zoom: 4,
            }
            this.initL7Map(`map${this.id}`, mapConfig, async (scene) => {
              this.scene = scene
              await this.initData()
              await this.drawPointerLayer()
            })
          }
        },
        template: `<div class="full" :id="'map'+id"></div>`
      })

      Vue.component('x-heatCity', {
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
          'option.data': {
            handler (newVal) {
              vm.updateData(this.heatmapLayer, newVal)
            }
          }
        },
        data () {
          return {
            scene: null,
            heatmapLayer: null,
            data: null,
          }
        },
        beforeDestroy () {
          this.scene && this.scene.destroy()
          this.scene = null
        },
        mounted () {
          setTimeout(() => {
            this.init()
          }, 10);
          Object.keys(this.option)
            .filter(_ => !["data"].includes(_))
            .forEach(_ => {
              this.$watch(vm => vm.option[_], (newValue) => {
                vm.updateStyle(this.heatmapLayer, _, newValue)
                if (_ === 'selectType') { // 更改类型需要重新设置data
                  vm.updateData(this.heatmapLayer, this.data)
                } else {
                  this.scene && this.scene.render()
                }
              });
            });
        },
        methods: {
          drawHeatmapLayer () {
            this.heatmapLayer = new L7.HeatmapLayer({
              blend: 'normal'
            }).source(this.data, {
              parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
              },
            }).shape(this.option.selectType.default).size('count', [0, 1]) // weight映射通道
              .style({
                intensity: this.option.intensity,
                radius: this.option.radius,
                opacity: this.option.opacity,
                rampColors: {
                  colors: this.option.rampColors,
                  positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
                }
              })
            this.scene.addLayer(this.heatmapLayer)
          },
          async initData () {
            if (this.option.data.length === 0) {
              const defaultData = await axios.get('./excel/heatCity.json')
              this.data = defaultData.data
            } else {
              this.data = this.option.data
            }
          },
          init () {
            const mapConfig = {
              style: "amap://styles/62a0eed57a13e1a23dad2a24cc1ae404", // 样式URL
              center: [116.49434030056, 39.868073421167621],
              zoom: 16,
              pitch: 45,
            }
            this.initL7Map(`map${this.id}`, mapConfig, async (scene) => {
              this.scene = scene
              await this.initData()
              await this.drawHeatmapLayer()
            })
          }
        },
        template: `<div class="full" :id="'map'+id"></div>`
      })

      Vue.component('x-heatGridCity', {
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
          'option.data': {
            handler (newVal) {
              vm.updateData(this.heatmapLayer, newVal)
            }
          }
        },
        data () {
          return {
            scene: null,
            heatmapLayer: null,
            data: null,
          }
        },
        beforeDestroy () {
          this.scene && this.scene.destroy()
          this.scene = null
        },
        mounted () {
          setTimeout(() => {
            this.init()
          }, 10);
          Object.keys(this.option)
            .filter(_ => !["data"].includes(_))
            .forEach(_ => {
              this.$watch(vm => vm.option[_], (newValue) => {
                vm.updateStyle(this.heatmapLayer, _, newValue)
                this.scene && this.scene.render()
              });
            });
        },
        methods: {
          drawHeatmapLayer () {
            this.heatmapLayer = new L7.HeatmapLayer({
              blend: 'normal'
            }).source(this.data, {
              parser: {
                type: 'csv',
                x: 'lng',
                y: 'lat'
              },
              transforms: [
                {
                  type: 'grid',
                  size: 10000,
                  field: 'v',
                  method: 'sum'
                }
              ]
            })
              .shape('square')
              .style({
                coverage: this.option.coverage,
                angle: this.option.angle
              })
              .color(
                'count',
                this.option.color
              );
            this.scene.addLayer(this.heatmapLayer)
          },
          async initData () {
            if (this.option.data.length === 0) {
              const defaultData = await axios.get('https://gw.alipayobjects.com/os/basement_prod/7359a5e9-3c5e-453f-b207-bc892fb23b84.csv')
              this.data = defaultData.data
            } else {
              this.data = this.option.data
            }
          },
          init () {
            const mapConfig = {
              style: "amap://styles/7e3bb5bc6ed4019b2fe41a29167fd026", // 样式URL
              pitch: 0,
              center: [127.5671666579043, 7.445038892195569],
              zoom: 2.632456779444394
            }
            this.initL7Map(`map${this.id}`, mapConfig, async (scene) => {
              this.scene = scene
              await this.initData()
              await this.drawHeatmapLayer()
            })
          }
        },
        template: `<div class="full" :id="'map'+id"></div>`
      })

      Vue.component('x-lightCity', {
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
          'option.data': {
            handler (newVal) {
              vm.updateData(this.CityBuildingLayer, newVal)
            },
          },
          'option.address': {
            handler (newVal) {
              this.updateAddress(newVal)
            }
          }
        },
        data () {
          return {
            scene: null,
            CityBuildingLayer: null,
            data: null,
            object3Dlayer: null,
            lineLayer: null,
          }
        },
        mounted () {
          Object.keys(this.option)
            .filter(_ => !["data"].includes(_))
            .filter(_ => !["address"].includes(_))
            .forEach(_ => {
              this.$watch(vm => vm.option[_], (newValue) => {
                if (_ === 'lineColor' || _ === 'opacity' || _ == 'interval' || _ === 'duration' || _ === 'trailLength' || _ === 'enableLine') {
                  if (_ === 'lineColor') _ = 'color'
                  if (_ === 'enableLine') _ = 'enable'
                  vm.updateStyle(this.lineLayer, _, newValue)
                } else {
                  if (_ === 'enableCity') _ = 'enable'
                  vm.updateStyle(this.CityBuildingLayer, _, newValue, this.object3Dlayer, this.scene)
                }
                this.scene && this.scene.render()
              });
            });
          setTimeout(() => {
            this.init()
          }, 10);
        },
        methods: {
          light () {
            // 增加光线
            this.scene.map.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.3);
            this.scene.map.DirectionLight = new AMap.Lights.DirectionLight([0, -1, 2], [1, 1, 1], 0.7);
            let angle = 90;
            const that = this
            function changeLightDirection () {
              angle += 3;
              const dir = [
                Math.cos(angle / 180 * Math.PI),
                -Math.sin(angle / 180 * Math.PI),
                2
              ];
              that.scene.map.DirectionLight.setDirection(dir);
              requestAnimationFrame(changeLightDirection);
            }
            changeLightDirection();
          },

          drawCityBuildingLayer () {
            this.CityBuildingLayer = new L7.CityBuildingLayer({
              zIndex: 0
            }).source(this.data)
              .size('height', [0, 500])
              .color(this.option.color)
              .animate({
                enable: this.option.enableCity
              })
              .style({
                opacity: this.option.opacity,
                baseColor: this.option.baseColor,
                windowColor: this.option.windowColor,
                brightColor: this.option.brightColor,
              });
            this.scene.addLayer(this.CityBuildingLayer)
          },
          async initData () {
            if (this.option.data.length === 0) {
              let defaultData
              // if (this.option.customConfig.geojson) {
              //   defaultData = await axios.get(this.option.customConfig.geojson)
              // } else {
              defaultData = await axios.get('./excel/lightCity.json')
              // }
              this.data = defaultData.data
            } else {
              this.data = this.option.data
            }
          },
          init () {
            const mapConfig = {
              style: "amap://styles/7e3bb5bc6ed4019b2fe41a29167fd026", // 样式URL
              center: [121.48954189405066, 31.256622695684516],
              pitch: 65.59312320916906,
              zoom: 16.5,
              plugin: ['AMap.Map3D', 'AMap.GltfLoader', 'AMap.LngLat', 'AMap.Lights.AmbientLight', 'AMap.Lights.DirectionLight'], // 注册高德插件
            }

            this.initL7Map('lightCity', mapConfig, async (scene) => {
              this.scene = scene
              await this.initData()
              await this.drawCityBuildingLayer()
              // document.getElementsByClassName('l7-scene')[0] && (document.getElementsByClassName('l7-scene')[0].style = `filter: drop-shadow(0 0 ${this.option.shadowSize}px ${this.option.shadowColor})`)
              await vm.searchGeo(mapConfig.center, this.option.radius, async (result) => {
                this.scene.panTo(result.center)
                const traffConfig = {
                  enable: this.option.enableLine,
                  interval: this.option.interval,
                  duration: this.option.duration,
                  trailLength: this.option.trailLength,
                  opacity: this.option.opacity,
                  color: this.option.lineColor
                }
                this.lineLayer = await this.drawTraffLineLayer(this.scene, result.traff, traffConfig)
              })
              setTimeout(() => {
                this.object3Dlayer = new AMap.Object3DLayer(); // 初始化3d图层
                this.option.gltf.map(item => {
                  vm.addGITF(item.lnglat, item.selectGltf, item.config, this.object3Dlayer, this.scene)
                })
              }, 1000);

            })
          }
        },
        beforeDestroy () {
          this.scene && this.scene.destroy()
          this.scene = null
        },
        template: `<div class="full" id="lightCity"></div>`
      })

      Vue.component('x-flyLine', {
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
          'option.data': {
            handler (newVal) {
              vm.updateData(this.lineLayer, newVal)
            }
          }
        },
        beforeDestroy () {
          this.scene && this.scene.destroy()
          this.scene = null
        },
        data () {
          return {
            scene: null,
            lineLayer: null,
            data: null
          }
        },
        mounted () {
          setTimeout(() => {
            this.init()
          }, 10);
          Object.keys(this.option)
            .filter(_ => !["data"].includes(_))
            .forEach(_ => {
              this.$watch(vm => vm.option[_], (newValue) => {
                vm.updateStyle(this.lineLayer, _, newValue)
                if (_ === 'selectType') { // 更改类型需要重新设置data
                  vm.updateData(this.lineLayer, this.data)
                } else {
                  this.scene && this.scene.render()
                }
              });
            });
        },
        methods: {
          drawLineLayer () {
            this.lineLayer = new L7.LineLayer({
              blend: 'normal'
            }).source(this.data, {
              parser: {
                type: 'csv',
                x: 'lng1',
                y: 'lat1',
                x1: 'lng2',
                y1: 'lat2'
              }
            }).shape(this.option.selectType.default).size(0.8).color('rgb(13,64,140)').animate({
              enable: this.option.enable,
              interval: this.option.interval,
              duration: this.option.duration,
              trailLength: this.option.trailLength
            }).style({
              opacity: this.option.opacity
            })
            this.scene.addLayer(this.lineLayer)
          },
          async initData () {
            if (this.option.data.length === 0) {
              const defaultData = await axios.get('./excel/flyLine.text')
              this.data = defaultData.data
            } else {
              this.data = this.option.data
            }
          },
          init () {
            const mapConfig = {
              style: "amap://styles/62a0eed57a13e1a23dad2a24cc1ae404", // 样式URL
              pitch: 50,
              center: [107.77791556935472, 35.443286920228644],
              zoom: 5,
            }
            this.initL7Map(`map${this.id}`, mapConfig, async (scene) => {
              this.scene = scene
              await this.initData()
              await this.drawLineLayer()
            })
          }
        },
        template: `<div class="full" :id="'map'+id"></div>`
      })

    }
  }
})
