/*
 * @Descripttion: 3D地球组件
 * @Author: cbz
 * @Date: 2020-12-18 10:06:35
 * @LastEditors: cbz
 * @LastEditTime: 2021-01-26 15:45:52
 */
Vue.mixin({
  methods: {
    initCesiumEarth () {
      Vue.component('x-cesium', {
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
          'option.gltf': {
            handler (newVal) {
              // const data = newVal.slice(-1)[0]
              // this.loadTile(data.lnglat, data.selectGitf)
              // this.loadTile(lnglat)
            }
          }
        },
        data () {
          return {
            moveTimerOut: [null, null, null, null],
            moveTimer: null,
            moveMarker1: null,
            moveMarker2: null,
            moveMarker3: null,
            moveMarker4: null,
            moveMarker5: null,
            moveMarker6: null,
            isFly: false,
          }
        },
        mounted () {
          this.init()
        },
        beforeDestroy () {
          this.viewer = null
          this.moveTimer = null
          this.moveTimerOut[0] = null
          this.moveTimerOut[1] = null
          this.moveTimerOut[2] = null
          this.moveTimerOut[3] = null
          this.moveTimerOut[4] = null
          this.moveTimerOut[5] = null
          this.moveTimerOut[6] = null
          clearInterval(this.moveTimer)
          clearTimeout(this.moveTimerOut[0])
          clearTimeout(this.moveTimerOut[1])
          clearTimeout(this.moveTimerOut[2])
          clearTimeout(this.moveTimerOut[3])
          clearTimeout(this.moveTimerOut[4])
          clearTimeout(this.moveTimerOut[5])
          clearTimeout(this.moveTimerOut[6])
        },
        methods: {
          init () {
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyNGVmNDgyMy1iYzg4LTRiMmYtYmY2OS1hZTIyNWEyMDU3ZTciLCJpZCI6MzAwMjcsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTMwMDA1MjV9.i8hU7hE7YzQ1AVlAjcHIpUKwDMCRhdff4lnGnboPuf0'
            // 初始化cesium
            this.viewer = new Cesium.Viewer("cesiumContainer", {
              geocoder: true,
              homeButton: true,
              sceneModePicker: false,
              baseLayerPicker: true,
              navigationHelpButton: false,
              animation: false,
              timeline: false,
              fullscreenButton: false,
              vrButton: false,
              selectionIndicator: false,
              scene3DOnly: true,// 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
              clock: new Cesium.Clock(),// 用于控制当前时间的时钟对象
              selectedImageryProviderViewModel: undefined,// 当前图像图层的显示模型，仅baseLayerPicker设为true有意义
              // imageryProviderViewModels: Cesium.createDefaultImageryProviderViewModels(),//可供BaseLayerPicker选择的图像图层ProviderViewModel数组
              selectedTerrainProviderViewModel: undefined,// 当前地形图层的显示模型，仅baseLayerPicker设为true有意义
              terrainProviderViewModels: Cesium.createDefaultTerrainProviderViewModels(),// 可供BaseLayerPicker选择的地形图层ProviderViewModel数组
              useDefaultRenderLoop: true,// 如果需要控制渲染循环，则设为true
              targetFrameRate: undefined,// 使用默认render loop时的帧率
              showRenderLoopErrors: false,// 如果设为true，将在一个HTML面板中显示错误信息
              automaticallyTrackDataSourceClocks: true,// 自动追踪最近添加的数据源的时钟设置
              contextOptions: undefined,// 传递给Scene对象的上下文参数（scene.options）
              sceneMode: Cesium.SceneMode.SCENE3D,// 初始场景模式
              imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
              }),
              terrainProvider: Cesium.createWorldTerrain({ // 启用地形照明和水体效果
                requestVertexNormals: true
              })
            });
            const { viewer } = this
            viewer.scene.globe.enableLighting = true; // 启用地形照明和水体效果
            viewer.scene.undergroundMode = false                                  // [ Bool , 设置开启地下场景 ]
            // viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50     // [ Number ,设置相机最小缩放距离,距离地表n米 ]
            viewer.scene.terrainProvider.isCreateSkirt = false                    // [ Bool , 关闭裙边 ]
            viewer.scene.globe.enableLighting = true                              // [ Bool , 是否添加全球光照，scene(场景)中的光照将会随着每天时间的变化而变化 ]
            viewer.scene.globe.showGroundAtmosphere = true                        // [ Bool , 是否关闭大气效果 ]

            viewer.cesiumWidget.creditContainer.style.display = "none"
            this.load3dTiles()
            this.moveAnimation()
            this.PolyLinePrimitives()
          },
          // 地球飞入方法
          flyToFun (long, lat, height, bool) {
            const { viewer } = this
            let destination
            if (bool) {
              destination = new Cesium.Cartesian3(long, lat, height)
            } else {
              destination = Cesium.Cartesian3.fromDegrees(long, lat, height)
            }
            viewer.scene.camera.flyTo({
              destination,
            })
          },
          moveAnimation () {
            this.isFly = !this.isFly
            if (this.moveTimer != null) {
              clearInterval(this.moveTimer)
            }
            this.option.data.flyData.forEach((item, index) => {
              if (this.moveTimerOut[index] != null) {
                clearTimeout(this.moveTimerOut[index])
              }
            })
            const { viewer } = this
            const callbackFun = () => {
              let index = 0
              for (const item of this.option.data.flyData) {
                this.moveTimerOut[index] = setTimeout(() => {
                  viewer.scene.camera.flyTo({
                    destination: new Cesium.Cartesian3(item.destination[0], item.destination[1], item.destination[2]),
                    orientation: item.orientation
                  })
                  setTimeout(() => {
                    this.moveAddMarker(item)
                  }, 1500)
                }, 8000 * (index + 1))
                index++
              }

            }
            if (this.isFly) {
              callbackFun()
              this.moveTimer = setInterval(() => {
                callbackFun()
              }, 8000 * this.option.data.flyData.length)
            }
          },

          // 动态点
          moveAddMarker (obj) {
            const { viewer } = this
            if (this[`moveAddMarker${obj.classId}`] != null) {
              viewer.entities.remove(viewer.entities.getById(this[`moveAddMarker${obj.classId}`][0]))
              viewer.entities.remove(viewer.entities.getById(this[`moveAddMarker${obj.classId}`][1]))
              this[`moveAddMarker${obj.classId}`] = null
            }
            setTimeout(() => {
              let alt1 = 0; let alt2 = 0
              let offset = 150; let n = -15
              let opt = 0; let optn = -15
              let optt = 0; let opttn = -15
              const marker = viewer.entities.add({
                name: 'moveMarker',
                position: new Cesium.CallbackProperty(function () {
                  alt1++
                  if (alt1 >= obj.position[2]) {
                    alt1 = obj.position[2]
                  }
                  return Cesium.Cartesian3.fromDegrees(obj.position[0], obj.position[1], alt1)
                }, false),
                billboard: obj.billboard,
                label: { // 文字标签
                  text: obj.label,
                  font: '16px Source Han Sans CN',                   // 字体样式
                  fillColor: new Cesium.CallbackProperty(function () {
                    opttn++
                    if (opttn >= 0) {
                      optt += 0.05
                      if (optt >= 1) {
                        optt = 1
                      }
                    }
                    return Cesium.Color.BLACK.withAlpha(optt)
                  }, false),                       // 字体颜色
                  backgroundColor: new Cesium.CallbackProperty(function () {
                    optn++
                    if (optn >= 0) {
                      opt += 0.1
                      if (opt >= 0.6) {
                        opt = 0.6
                      }
                    }
                    return Cesium.Color.AQUA.withAlpha(opt)
                  }, false),    // 背景颜色
                  showBackground: true,                                // 是否显示背景颜色
                  style: Cesium.LabelStyle.FILL,                      // label样式
                  outlineWidth: 2,
                  verticalOrigin: Cesium.VerticalOrigin.CENTER,      // 垂直方向以底部来计算标签的位置
                  horizontalOrigin: Cesium.HorizontalOrigin.LEFT,   // 水平位置
                  pixelOffset: new Cesium.CallbackProperty(function () {
                    n += 2
                    if (n >= 0) {
                      offset -= n
                      if (offset <= 17) {
                        offset = 17
                      }
                    }
                    return new Cesium.Cartesian2(offset, -5)
                  }, false)      // 偏移量
                },
              })
              const markerLine = viewer.entities.add({
                name: "baioshi",
                polyline: {
                  positions: new Cesium.CallbackProperty(function () {
                    alt2++
                    if (alt2 >= obj.position[2]) {
                      alt2 = obj.position[2]
                    }
                    return Cesium.Cartesian3.fromDegreesArrayHeights([
                      obj.position[0], obj.position[1], -100,
                      obj.position[0], obj.position[1], alt2
                    ])
                  }, false),
                  width: 1,
                  // material : Cesium.Color.DODGERBLUE
                  material: new Cesium.PolylineGlowMaterialProperty({ // 发光线
                    glowPower: 0.1,
                    color: Cesium.Color.DODGERBLUE.withAlpha(.2)
                  })
                }
              })
              this[`moveAddMarker${obj.classId}`] = [marker.id, markerLine.id]
            }, 1000)
          },
          // 贴地线绘制方法
          PolyLinePrimitive (item, opt) {
            const { viewer } = this
            const _update = function () {
              return item.area
            }
            const options = {
              corridor: {
                show: true,
                positions: new Cesium.CallbackProperty(_update, false),
                material: Cesium.Color.DODGERBLUE.withAlpha(1),
                // material : new Cesium.PolylineGlowMaterialProperty({
                //     glowPower : 0.2,
                //     color : Cesium.Color.BLUE
                // }),
                // material : new Cesium.PolylineGlowMaterialProperty({
                //     glowPower : 1,
                //     color : Cesium.Color.YELLOW.withAlpha(1),
                // }),
                width: 2
              }
            }
            if (opt) {
              Object.assign(options.corridor, opt)
            }
            const lineObj = viewer.entities.add(options)
            return lineObj.id
          },
          // 贴地线多线绘制
          PolyLinePrimitives () {
            const { viewer } = this

            viewer.entities.removeAll()
            this.option.data.streetData.map((item, i) => {
              item.entities_id = this.PolyLinePrimitive(item)
            })
          },
          // 街道-item项点移入事件
          streeEnter (item) {
            const { viewer } = this
            const obj = viewer.entities.getById(item.entities_id)
            viewer.entities.remove(obj)
            item.entities_id = this.PolyLinePrimitive(item, {
              material: Cesium.Color.RED.withAlpha(1),
              // material : new Cesium.PolylineGlowMaterialProperty({
              //     glowPower : 0.2,
              //     color : Cesium.Color.BLUE
              // }),
              // material : new Cesium.PolylineGlowMaterialProperty({
              //     glowPower : .1,
              //     color : Cesium.Color.CORNFLOWERBLUE.withAlpha(.9),
              // }),
              width: 4
            })
          },
          // 街道-item项点移出事件
          streeLeave (item) {
            const { viewer } = this
            const obj = viewer.entities.getById(item.entities_id)
            viewer.entities.remove(obj)
            item.entities_id = this.PolyLinePrimitive(item)
          },
          // 街道-item项点击事件
          streeClick (i, id) {
            this.street_id = id
            this.selInp = `${this.streeData[i].name}>楼栋`
          },
          addIdentificationLine (long, lat, height) {
            // 添加标识线
            const { viewer } = this
            viewer.entities.add({
              name: "",
              polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                  long, lat, -100,
                  long, lat, height
                ]),
                width: 1,
                // material: Cesium.Color.DODGERBLUE
                material: new Cesium.PolylineGlowMaterialProperty({ // 发光线
                  glowPower: 1,
                  color: Cesium.Color.DODGERBLUE
                })
              }
            });
          },
          load3dTiles () {
            const { viewer } = this
            // 加载3DTiles模型数据
            viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
              url: 'https://cesium-map.oss-cn-qingdao.aliyuncs.com/zjl/12/tileset.json'
            }))
          },
        },
        template: `<div>
                     <div id="cesiumContainer" class="full"></div>
                     <button @click="moveAnimation" style="position:absolute;bottom:0;right:0">{{isFly?'关闭巡航模式':'开启巡航模式'}}</button>
                   <div>`
      });

      Vue.component('x-smartCity', {
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
        data () {
          return {
            positionEditing: false, // 编辑模型位置
            rotationEditing: false, // 编辑模型旋转
            xbsjPosition: [0, 0, 0],
            xbsjRotation: [0, 0, 0],
            isShowModelTools: false,
            listIsOpen: false,
            reportData: [{
              name: '陆家嘴中心绿地',
              position: [121.513256, 31.242725, 600],
              time: '2021-01-21'
            }, {
              name: '上海站',
              position: [121.460938, 31.255567, 600],
              time: '2021-01-21'
            }, {
              name: '汤臣商务中心大厦',
              position: [121.518861, 31.231239, 600],
              time: '2021-01-21'
            }, {
              name: '上海世博洲际酒店',
              position: [121.511818, 31.205421, 600],
              time: '2021-01-21'
            }, {
              name: '外滩',
              position: [121.497374, 31.24291, 600],
              time: '2021-01-21'
            }, {
              name: '迪士尼',
              position: [121.665321, 31.139919, 600],
              time: '2021-01-21'
            }, {
              name: '松江南站',
              position: [121.231834, 30.994414, 600],
              time: '2021-01-21'
            }, {
              name: '虹桥机场',
              position: [121.345668, 31.204186, 600],
              time: '2021-01-21'
            }, {
              name: '海棠公园',
              position: [121.39856, 31.250628, 600],
              time: '2021-01-21'
            }]
          }
        },
        mounted () {
          XE.ready().then(this.startup); // 初始化挂载
        },
        beforeDestroy () {
          this._rotationEditingUnbind = this._rotationEditingUnbind && this._rotationEditingUnbind();
          this._positionEditingUnbind = this._positionEditingUnbind && this._positionEditingUnbind();
          this._xbsjPositionUnbind = this._xbsjPositionUnbind && this._xbsjPositionUnbind();
          this._xbsjRotationUnbind = this._xbsjRotationUnbind && this._xbsjRotationUnbind();
          this._luminanceAtZenith = this._luminanceAtZenith && this._luminanceAtZenith() // 清理资源
          this._bloomEnabled = this._bloomEnabled && this._bloomEnabled()
          this.earth = this.earth && this.earth.destroy();
          this.earth = null
        },
        methods: {
          startup () {
            this.earth = new XE.Earth('earthContainer');
            this.earth.xbsjFromJSON({
              "sceneTree": {
                "root": {
                  "children": [
                    {
                      "czmObject": {
                        "xbsjType": "Tileset",
                        "xbsjGuid": "a55ad37a-8910-40a0-a55b-3f7cbc5c441f",
                        "url": this.option.customConfig.tiles,
                        "xbsjStyle": "var style = {\n    color: \"vec4(0, 0.5, 1.0,1)\"\n}",
                        "xbsjClippingPlanes": {},
                        "maximumScreenSpaceError": 16, // 显示精度
                        "luminanceAtZenith": this.option.luminanceAtZenith, // 材质底色
                        "imageBasedLightingFactor": [0.6, 1],
                        "xbsjCustomShader": {
                          "fsBody": "\n    // 可以修改的参数\n    // 注意shader中写浮点数是，一定要带小数点，否则会报错，比如0需要写成0.0，1要写成1.0\n    float _baseHeight =0.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度\n    float _heightRange = 60.0; // 高亮的范围(_baseHeight ~ _baseHeight + _heightRange) 默认是 0-60米\n    float _glowRange = 300.0; // 光环的移动范围(高度)\n\n    // 建筑基础色\n    float vtxf_height = v_elevationPos.z - _baseHeight;\n    float vtxf_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;\n    float vtxf_a12 = vtxf_height / _heightRange + sin(vtxf_a11) * 0.1;\n    gl_FragColor *= vec4(vtxf_a12, vtxf_a12, vtxf_a12, 1.0);\n\n    // 动态光环\n    float vtxf_a13 = fract(czm_frameNumber / 360.0);\n    float vtxf_h = clamp(vtxf_height / _glowRange, 0.0, 1.0);\n    vtxf_a13 = abs(vtxf_a13 - 0.5) * 2.0;\n    float vtxf_diff = step(0.005, abs(vtxf_h - vtxf_a13));\n    gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - vtxf_diff);\n"
                        }
                      }
                    },
                    {
                      "czmObject": {
                        "xbsjType": "Imagery",
                        "xbsjGuid": "cd462fac-4966-424a-a99b-ef7198662595",
                        "name": "百度暗色风格",
                        "xbsjImageryProvider": {
                          "XbsjImageryProvider": {
                            "url": "http://api0.map.bdimg.com/customimage/tile?=&x={x}&y={y}&z={z}&scale=1&customid=midnight",
                            "srcCoordType": "BD09"
                          },
                          "UrlTemplateImageryProvider": {},
                          "WebMapServiceImageryProvider": {},
                          "WebMapTileServiceImageryProvider": {},
                          "ArcGisMapServerImageryProvider": {},
                          "createTileMapServiceImageryProvider": {}
                        }
                      }
                    },
                    {
                      "ref": "scaneline",
                      "czmObject": {
                        "xbsjType": "Scanline",
                        "xbsjGuid": "c827bdc1-c14b-4452-81de-7b2ce427b786",
                        "name": "扫描线",
                        "position": [this.option.customConfig.center[0] * Math.PI / 180, this.option.customConfig.center[1] * Math.PI / 180, 0],
                        "show": true,
                        "radius": 3000,
                        "timeDuration": "3",
                        "currentTime": 0,
                        "color": [0.5, 0.8, 1.0, 1.0],
                      }
                    },
                    {
                      "czmObject": {
                        "xbsjType": "Model",
                        "url": `${vm.staticUrl}/3d/2/scene.gltf`,
                        "minimumPixelSize": 128,
                        "maximumScale": 20000,
                        "xbsjPosition": [this.option.customConfig.center[0] * Math.PI / 180, this.option.customConfig.center[1] * Math.PI / 180, 0]
                      },
                      "ref": "model1",
                    }
                  ]
                }
              },
            });
            this.earth.camera.navigator.showCompass = true; // 显示指北针
            this.earth.camera.navigator.showDistanceLegend = true; // 显示比例尺    
            const flyPosition = {
              lng: this.option.customConfig.center[0],
              lat: this.option.customConfig.center[1],
              height: 500
            }
            this.flyTo(flyPosition, 2000)
            this.dataBind()
            this.createCircle()
            this.createODLines3()
            this.createCylinder2()
            setTimeout(async () => {
              // this.startFlyReportData()
            }, 3000);
          },
          async startFlyReportData (isLoop = true) {
            let index = 0
            for (const item of this.reportData) {
              index++
              await this.sleep(5000);
              const itemFlyPosition = {
                lng: item.position[0],
                lat: item.position[1],
                height: item.position[2]
              }
              this.flyTo(itemFlyPosition, 1000, { yaw: 0, pitch: -60, flip: 0 }) // 1000米停下 刚好位于屏幕中间

              if (this.reportData.length - 1 === index && isLoop) {
                this.startFlyReportData(true)
              }
            }
          },
          createBasePoint (position, color = [0.5, 0.8, 1, 2], scale = [50, 50, 1]) {
            // const color = [0.5, 0.8, 1, 2];
            // const scale = [50, 50, 1];
            const { earth } = this
            // 底面
            {
              const evalString = `
                    p.canvasWidth = 512;
                    p.canvasHeight = 512;
                    p.drawCanvas(ctx => {
                        var gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
                        gradient.addColorStop(0.1, "rgba(255, 255, 255, 1.0)");
                        gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.0)");
                        gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.9)");
                        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.0)");
                        gradient.addColorStop(0.9, "rgba(255, 255, 255, 0.2)");
                        gradient.addColorStop(1.0, "rgba(255, 255, 255, 1.0)");

                        ctx.clearRect(0, 0, 512, 512);
                        ctx.beginPath();
                        ctx.arc(256, 256, 256, 0, Math.PI * 2, true);
                        // ctx.fillStyle = "rgb(0, 155, 255)";
                        ctx.fillStyle = gradient;
                        ctx.fill();
                        ctx.restore();
                    });
                `;

              const config = {
                evalString,
                position: [...position],
                scale: [...scale],
                positions: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.positions],
                sts: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.sts],
                indices: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.indices],
                renderState: XE.Obj.CustomPrimitive.getRenderState(true, true),
                color: [...color],
                canvasWidth: 512,
                canvasHeight: 512,
              };

              const p = new XE.Obj.CustomPrimitive(earth);
              p.xbsjFromJSON(config);
            }

            // 底面动态辐射波
            {
              const evalString = `
                    p.canvasWidth = 512;
                    p.canvasHeight = 512;
                    p.drawCanvas(ctx => {
                        ctx.clearRect(0, 0, 512, 512);

                        ctx.strokeStyle = "rgb(255, 255, 255)";
                        ctx.setLineDash([80, 80]);
                        ctx.lineWidth = 30;
                        ctx.arc(256, 256, 241, 0, Math.PI * 2, true);
                        ctx.stroke();
                    });
                `;

              const preUpdateEvalString = `
                    if (typeof p.dAngle === 'undefined') p.dAngle = 0.0;
                    if (typeof p.dt === 'undefined') p.dt = 0.01;

                    p.dAngle += 10.0;
                    if (p.dAngle > 360.0) {
                        p.dAngle = 0.0;
                    }
                    p.rotation[0] = p.dAngle / 180.0 * Math.PI;

                    p.dt += 0.02;
                    if (p.dt > 1.0) p.dt = 0.01;

                    p.scale[0] = 50 * p.dt;
                    p.scale[1] = 50 * p.dt;
                `;

              const config = {
                evalString,
                preUpdateEvalString,
                position: [...position],
                scale: [50, 50, 1],
                positions: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.positions],
                sts: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.sts],
                indices: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.indices],
                renderState: XE.Obj.CustomPrimitive.getRenderState(true, true),
                color: [...color],
                canvasWidth: 512,
                canvasHeight: 512,
              };

              const p = new XE.Obj.CustomPrimitive(earth);
              p.xbsjFromJSON(config);
            }

            // 柱体
            {
              const fragmentShaderSource =
                `
                varying vec3 v_positionEC;
                varying vec3 v_normalEC;
                varying vec2 v_st;
                varying vec4 v_color;
                uniform sampler2D u_image;
                uniform vec4 u_color;
                void main()
                {
                    float powerRatio = fract(czm_frameNumber / 30.0) + 1.0;
                    float alpha = pow(1.0 - v_st.t, powerRatio);
                    gl_FragColor = vec4(u_color.rgb, alpha*u_color.a);
                }
                `;
              const renderState = XE.Obj.CustomPrimitive.getRenderState(true, true);
              renderState.cull.enabled = false;
              const cylinder = XE.Obj.CustomPrimitive.Geometry.createCylinder(0.3, 2.0, 1.0, 6);
              const config = {
                position: [...position],
                scale: [3 / 50 * scale[0], 3 / 50 * scale[1], 300 * scale[2]],
                positions: cylinder.positions,
                sts: cylinder.sts,
                indices: cylinder.indices,
                renderState,
                color: [...color],
                canvasWidth: 1.0,
                fragmentShaderSource,
              };

              const p = new XE.Obj.CustomPrimitive(earth);
              p.xbsjFromJSON(config);
            }

            // 柱体粒子
            {
              const fragmentShaderSource =
                `
                varying vec3 v_positionEC;
                varying vec3 v_normalEC;
                varying vec2 v_st;
                varying vec4 v_color;
                uniform sampler2D u_image;
                uniform vec4 u_color;
                void main()
                {
                    vec3 positionToEyeEC = -v_positionEC;
                    vec3 normalEC = normalize(v_normalEC);
                    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);

                    float dt = fract(czm_frameNumber / 90.0);
                    vec2 st = fract(vec2(1.0) + v_st - vec2(dt, dt));
                    vec4 imageColor = texture2D(u_image, st);

                    vec3 diffuse = imageColor.rgb;
                    float alpha = imageColor.a;

                    diffuse *= v_color.rgb;
                    alpha *= v_color.a;

                    diffuse *= u_color.rgb;
                    alpha *= u_color.a;

                    gl_FragColor = vec4(diffuse, alpha * pow(1.0 - v_st.t, 2.0));
                }
                `;

              const evalString = `
                    p.canvasWidth = 32;
                    p.canvasHeight = 256;
                    Cesium.Resource.createIfNeeded('${vm.staticUrl}/image/smartCity/particles.png').fetchImage().then(function(image) {
                        p.drawCanvas(ctx => {
                            ctx.clearRect(0, 0, 32, 256);
                            ctx.drawImage(image, 0, 0);
                        });
                    });
                `;

              const renderState = XE.Obj.CustomPrimitive.getRenderState(true, true);
              renderState.cull.enabled = false;
              const cylinder = XE.Obj.CustomPrimitive.Geometry.createCylinder(4.0, 4.0, 1.0, 6);
              const config = {
                fragmentShaderSource,
                evalString,
                position: [...position],
                scale: [3 / 50 * scale[0], 3 / 50 * scale[1], 300 * scale[2]],
                positions: cylinder.positions,
                sts: cylinder.sts,
                indices: cylinder.indices,
                color: [...color],
                canvasWidth: 32,
                canvasHeight: 256,
                renderState,
              };

              const p = new XE.Obj.CustomPrimitive(earth);
              p.xbsjFromJSON(config);
            }
          },
          createCircle () {
            const evalString = `
                Cesium.Resource.createIfNeeded('${vm.staticUrl}/image/smartCity/circular_03.png').fetchImage().then(function(image) {
                    console.log('image loaded!');
                    p.canvasWidth = 512;
                    p.canvasHeight = 512;

                    p.drawCanvas(ctx => {
                        ctx.clearRect(0, 0, 512, 512);

                        ctx.beginPath();
                        ctx.strokeStyle = "rgb(128, 128, 128)";
                        // ctx.setLineDash([8, 8]);
                        ctx.lineWidth = 1;
                        ctx.arc(256, 256, 250, 0, Math.PI*2, true);
                        ctx.stroke();

                        ctx.drawImage(image, 0, 0);
                    });

                    p.color = [0.5, 0.8, 1, 2];
                });
            `;

            const preUpdateEvalString = `
                if (typeof p.xxxAngle === 'undefined') p.xxxAngle = 360.0;
                p.xxxAngle -= 1.0;
                if (p.xxxAngle < 0) {
                    p.xxxAngle = 360.0;
                }
                p.rotation[0] = p.xxxAngle / 180.0 * Math.PI;
            `;

            // p.positions = XE.Obj.CustomPrimitive.Geometry.unitSquare.positions;
            // p.sts = XE.Obj.CustomPrimitive.Geometry.unitSquare.sts;
            // p.indices = XE.Obj.CustomPrimitive.Geometry.unitSquare.indices;

            const config = {
              // xbsjType: "CustomPrimitive",
              evalString,
              preUpdateEvalString,
              position: [this.option.customConfig.center[0] * Math.PI / 180, this.option.customConfig.center[1] * Math.PI / 180, 0],
              scale: [500, 500, 1],
              positions: [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0],
              sts: [0, 0, 1, 0, 1, 1, 0, 1],
              indices: [0, 1, 2, 0, 2, 3],
              renderState: XE.Obj.CustomPrimitive.getRenderState(true, true),
              color: [0.5, 0.8, 1, 2],
              canvasWidth: 512,
              canvasHeight: 512,
            }

            const p = new XE.Obj.CustomPrimitive(this.earth);
            p.xbsjFromJSON(config);

            return p;
          },
          async setDiv (p, item) {
            // 根据div生成地图box框
            const htmlText = `
                <style>
                  .smartCity-box {
                    width: 980px;
                    height: 560px;
                    color: white;
                    background:url('${vm.staticUrl}/image/smartCity/boxBg.png')
                }
        
                .smartCity-title {
                    width: 100%;
                    height: 50px;
                    color: #000;
                    text-align: center;
                    line-height: 50px;
                    font-size: 24px;
                }
        
                .smartCity-ul {
                    width: 100%;
                    height: 196px;
                    margin-top: 70px;
                    margin-left: 5%;
                    margin-bottom: 50px;
                }
        
                .smartCity-ul li {
                    list-style: none;
                    float: left;
                    width: 45%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
        
                .smartCity-ul li span {
                    display: inline-block;
                    width: 100%;
                    height: 50%;
                    line-height: 108px;
                    text-align: center;
                    font-size: 80px;
                    font-weight: 400;
                }
        
               .smartCity-time> p {
                    width: 52%;
                    font-size: 36px;
                    margin-left: 24%;
                }
        
                .smartCity-time>p span {
                    display: inline-block;
                    width: 120px;
                    text-align: right;
                }
                </style>
                <div class="smartCity-box">
                    <div class="smartCity-title" >${item.name}</div>
                    <ul class="smartCity-ul">
                        <li>
                            <span>PM2.5</span>
                            <span>23</span>
                        </li>
                        <li>
                            <span>PM10</span>
                            <span>36</span>
                        </li>
                    </ul>
                    <div class="smartCity-time">
                        <p><span>时间：</span>${item.time}</p>
                    </div>
                </div>
            `;

            const canvas2 = await XE.HTML.div2Canvas(htmlText, { width: 980, height: 560 });

            p.drawCanvas(ctx => {
              ctx.clearRect(0, 0, 980, 560);
              ctx.drawImage(canvas2, 0, 0);
            })
          },
          async createBox (item) {
            // 创建box
            const config = {
              "position": [item.position[0] * Math.PI / 180, item.position[1] * Math.PI / 180, 300],
              "scale": [150, 150, 100],
              "positions": [0, -1, 0, 0, 1, 0, 0, 1, 2, 0, -1, 2, 0, 1, 0, 0, -1, 0, 0, -1, 2, 0, 1, 2],
              rotation: [-90 * Math.PI / 180, 0, 0],
              "sts": [0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1],
              "indices": [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7],
              "renderState": {
                "cull": {
                  "enabled": true
                },
                "polygonOffset": {},
                "scissorTest": {
                  "rectangle": {}
                },
                "depthRange": {},
                "depthTest": {
                  "enabled": true
                },
                "colorMask": {},
                "depthMask": true,
                "blending": {
                  "enabled": true,
                  "color": {},
                  "equationRgb": 32774,
                  "equationAlpha": 32774,
                  "functionSourceRgb": 770,
                  "functionDestinationRgb": 771,
                  "functionDestinationAlpha": 771
                },
                "stencilTest": {
                  "frontOperation": {},
                  "backOperation": {}
                },
                "sampleCoverage": {}
              },
              "canvasWidth": 980,
              "canvasHeight": 560,
              "autoRegisterEditing": false
            }

            const customP = new XE.Obj.CustomPrimitive(this.earth);
            customP.xbsjFromJSON(config);
            await this.setDiv(customP, item)
          },
          async createODLines3 () {
            const p = []
            for (const item of this.reportData) {
              const re = [[this.option.customConfig.center[0] * Math.PI / 180, this.option.customConfig.center[1] * Math.PI / 180, 0], [item.position[0] * Math.PI / 180, item.position[1] * Math.PI / 180, 10]]
              p.push(re)
              this.createBasePoint([item.position[0] * Math.PI / 180, item.position[1] * Math.PI / 180, 1.5])
              await this.createBox(item)
            }
            // 飞线
            const odlines = new XE.Obj.ODLines(this.earth);
            odlines.color = [1, 1, 1, 1];

            let busLines = [];
            const positionsCollection = p.map(e => {
              const toDegree = 180.0 / Math.PI;
              // Cesium.xbsjCreateTransmitPolyline 根据 首末端点生成弧线，
              // 参数有：
              // startPosition, 端点1
              // endPosition, 端点2
              // minDistance, 计算出的线段的最小间隔距离
              // heightRatio=1.0 弧线高度抬升程度，值越大，抬高得越明显
              // 返回值是cartesian类型的坐标数组
              const cartesians = Cesium.xbsjCreateTransmitPolyline(e[0], e[1], 50.0, 5.0);
              const poss = cartesians.map(ee => {
                const carto = Cesium.Cartographic.fromCartesian(ee);
                return [carto.longitude, carto.latitude, carto.height];
              });

              return poss;
            });

            positionsCollection.push(...positionsCollection);
            positionsCollection.push(...positionsCollection);

            const timeDuration = 10.0;
            const moveBaseDuration = 4.0;

            busLines = positionsCollection.map(e => {
              return {
                positions: e,
                color: [0.5, 0.8, 1.0, 5.0],
                width: 5.0,
                startTime: timeDuration * Math.random(),
                duration: moveBaseDuration + 1.0 * Math.random()
              }
            });

            odlines.data = busLines;
            odlines.timeDuration = timeDuration;
            odlines.playing = true;

            return odlines;
          },
          createCylinder2 () {
            // 中心慢慢扩散的圆
            const cylinder = XE.Obj.CustomPrimitive.Geometry.createCylinder(1.0, 1.0, 1.0, 30);
            const renderState = XE.Obj.CustomPrimitive.getRenderState(true, true);
            renderState.cull.enabled = false;
            const evalString = `
                p.canvasWidth = 1;
                p.canvasHeight = 256;
                p.drawCanvas(ctx => {
                    ctx.clearRect(0, 0, 1, 256);

                    var lingrad2 = ctx.createLinearGradient(0,0,0,256);
                    lingrad2.addColorStop(0, 'rgba(255,255,255,0)');
                    lingrad2.addColorStop(1, 'rgba(255,255,255,1)');

                    ctx.fillStyle = lingrad2;
                    ctx.fillRect(0, 0, 1, 256);
                }); 
            `;
            const preUpdateEvalString = `
                if (typeof p.dt === 'undefined') p.dt = 0.0;
                p.dt += 0.01 * 0.3;
                if (p.dt > 1.0) {
                    p.dt = 0.0;
                }

                const b = (1.0-Math.cos(p.dt*Math.PI*2.0))*0.5;
                p.scale[0] = p.scale[1] = 1000 * (1.0-Math.cos(p.dt*Math.PI))*0.5;
                p.scale[2] = 200 * b;
                p.color[3] = 2.0 * b;
            `;
            const config = {
              evalString,
              preUpdateEvalString,
              position: [this.option.customConfig.center[0] * Math.PI / 180, this.option.customConfig.center[1] * Math.PI / 180, 0],
              scale: [500, 500, 100],
              positions: cylinder.positions,
              sts: cylinder.sts,
              indices: cylinder.indices,
              renderState,
              canvasWidth: 1,
              canvasHeight: 256,
              color: [0.5, 0.8, 1, 2],
            }

            const p = new XE.Obj.CustomPrimitive(this.earth);
            p.xbsjFromJSON(config);

            return p;
          },
          dataBind () {
            // 数据双向绑定
            const tiles = this.earth.sceneTree.root.children[0].czmObject; // 数据双向绑定
            this.model = this.earth.sceneTree.$refs.model1.czmObject; // 模式数据
            this._luminanceAtZenith = XE.MVVM.bind(this, 'option.luminanceAtZenith', tiles, 'luminanceAtZenith');
            this._bloomEnabled = XE.MVVM.bind(this, 'option.bloomEnabled', this.earth.postProcess.bloom, 'enabled');
            this._rotationEditingUnbind = XE.MVVM.bind(this, 'rotationEditing', this.model, 'rotationEditing');
            this._positionEditingUnbind = XE.MVVM.bind(this, 'positionEditing', this.model, 'positionEditing');
            this._xbsjPositionUnbind = XE.MVVM.bindPosition(this, 'xbsjPosition', this.model, 'xbsjPosition');
            this._xbsjRotationUnbind = XE.MVVM.bindRotation(this, 'xbsjRotation', this.model, 'xbsjRotation');
            this.earth.interaction.picking.enabled = true; // 开启拾取操作
            // 拾取事件定制
            this.model.onclick = () => {
              this.isShowModelTools = true
            };

            this.model.onmouseover = () => {
              this.model.color = [1, 0, 0, 1];
            };

            this.model.onmouseout = () => {
              this.model.color = [1, 1, 1, 1];
            };
            const scaneline = this.earth.sceneTree.$refs.scaneline.czmObject;
            scaneline.playing = true;
          },
          scaleModel (isBig) {
            // 缩放模型
            isBig ? this.model.scale++ : this.model.scale--
          },
          flyTo ({ lng, lat, height }, viewDistance, { yaw, pitch, flip } = { yaw: 0, pitch: -45, flip: 0 }) {
            /**
            * 相机飞行
            * @param {number[]} position 目标位置, 形式如：[经度, 纬度, 高度] 其中经纬度的单位是弧度，高度的单位是米。
            * @param {number} [viewDistance] 环绕距离，默认为当前相机到目标点距离, 单位是米。
            * @param {number[]} [rotation] 相机飞入后的姿态控制，从什么角度观察目标，形式如: [偏航角, 俯仰角, 翻转角], 单位是弧度。
          */
            this.earth.camera.flyTo([lng * Math.PI / 180, lat * Math.PI / 180, height], viewDistance, [yaw * Math.PI / 180, pitch * Math.PI / 180, flip * Math.PI / 180]);
          },
          closeEdit () {
            this.positionEditing = false
            this.rotationEditing = false
            this.isShowModelTools = false
          },
          sleep: (timeout = 1000) => new Promise((resolve, reject) => {
            // 暂停几秒
            setTimeout(resolve, timeout);
          }),
          onClickItem (item) {
            const itemFlyPosition = {
              lng: item.position[0],
              lat: item.position[1],
              height: item.position[2]
            }
            this.flyTo(itemFlyPosition, 2000, { yaw: 0, pitch: -45, flip: 0 }) // 1000米停下 刚好位于屏幕中间 
          },
          onClickArrow () {
            this.listIsOpen = !this.listIsOpen
            const $element = document.getElementById('smartCityList')
            $element.style.willChange = 'transform'
            if (this.listIsOpen) {
              $element.style.transform = 'translate3d(50px,0,0)'
            } else {
              $element.style.transform = 'translate3d(-100%,0,0)'
            }
            $element.style.willChange = 'auto'
          }

        },
        template: `<div class="full">
                    <div  id="earthContainer" class="full"></div>
                    <div class="smartCity-arrow">
                      <a @click="onClickArrow('left')">
                        <i class="el-icon-arrow-left" />
                      </a>
                    </div>
                    <ul class="smartCity-list" id="smartCityList">
                       <li v-for="(item,index) in reportData" :key="index" @click="onClickItem(item)">
                          <p>{{item.name}}</p>
                          <p>{{item.time}}</p>
                       </li>
                    </ul>
                    <div class="box" v-show="isShowModelTools" style="position: absolute; left: 18px; top: 18px; color: white; background: rgba(0, 0, 0, 0.6); padding: 20px; border-radius: 25px;min-width:200px; font-size:24px; font-family: 宋体;">
                     <el-button  @click="positionEditing = !positionEditing">平移</el-button>
                     <el-button  @click="rotationEditing = !rotationEditing">旋转</el-button>
                     <el-button  @click="scaleModel(true)">放大</el-button>
                     <el-button  @click="scaleModel(false)">缩小</el-button>
                     <el-button  @click="closeEdit">退出编辑</el-button>
                </div>
                  <div>`
      })
    }
  }
})