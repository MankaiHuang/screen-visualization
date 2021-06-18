/*
 * @Descripttion: three组件
 * @Author: cbz
 * @Date: 2020-06-01 10:23:02
 * @LastEditors: cbz
 * @LastEditTime: 2020-12-17 16:01:53
 */
Vue.mixin({
  methods: {
    initThree () {
      Vue.component('x-queue', {
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
            targets: {
              grid: [],
              helix: [],
              sphere: [],
            },
            objects: [],
            renderer: null,
            scene: null,
            camera: null,
            controls: null,
          }
        },
        mounted () {
          this.init()
          this.animation();
        },
        beforeDestroy () {
          this.controls.removeEventListener('change', this.render);

        },
        watch: {
          'option.selectStatus.default': {
            handler (newVal) {
              this.transform(this.targets[newVal], 2000)
            },
            immediate: true,
          },
        },
        methods: {
          transform (targets, duration) {
            const objLength = this.objects.length;
            // this.nowStatus = status
            TWEEN.removeAll();
            for (let i = 0; i < objLength; ++i) {

              const object = this.objects[i];
              const target = targets[i];
              new TWEEN.Tween(object.position)
                .to({ x: target.position.x, y: target.position.y, z: target.position.z },
                  Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();


              new TWEEN.Tween(object.rotation)
                .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

            }

            // 这个补间用来在位置与旋转补间同步执行，通过onUpdate在每次更新数据后渲染scene和camera
            new TWEEN.Tween({})
              .to({}, duration * 2)
              .onUpdate(this.render)
              .start();

          },
          onWindowResize () {
            const { camera, renderer } = this
            const height = document.getElementById(this.id).clientHeight;
            const width = document.getElementById(this.id).clientWidth;
            camera.aspect = width / height
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
            this.render();

          },
          animation () {
            const { camera, controls, scene } = this
            TWEEN.update();
            controls.update();
            requestAnimationFrame(this.animation);
          },
          render () {
            const { camera, renderer, scene } = this
            renderer.render(scene, camera);
          },
          init () {
            const that = this
            this.scene = null
            this.objects = []
            const felidView = 40;
            const height = document.getElementById(this.id).clientHeight;
            const width = document.getElementById(this.id).clientWidth;
            const aspect = width / height;
            const nearPlane = 1;
            const farPlane = 10000;
            const WebGLoutput = document.getElementById('container');

            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(felidView, aspect, nearPlane, farPlane);
            this.camera.position.z = 3000;

            this.renderer = new THREE.CSS3DRenderer();
            this.renderer.setSize(width, height);
            this.renderer.domElement.style.position = 'absolute';
            WebGLoutput.appendChild(this.renderer.domElement);

            this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);

            this.controls.rotateSpeed = 1;
            this.controls.staticMoving = true;
            this.controls.minDistance = 500;
            this.controls.maxDistance = 6000;
            this.controls.addEventListener('change', this.render);

            let i = 0;
            const len = this.option.data.length;

            for (; i < len; i++) {

              const element = document.createElement('div');
              element.className = 'element';
              element.dataset.index = i
              element.style.backgroundColor = `rgba( 0, 127, 127, ${Math.random() * 0.5 + 0.25} )`;
              element.onclick = () => {
                if (element.dataset.isScale === 'true') {
                  element.style.transform = element.dataset.oldTransform // 恢复备份
                  element.dataset.isScale = false
                } else {
                  element.dataset.isScale = true
                  element.dataset.oldTransform = element.style.transform // 备个份
                  element.style.transition = '1s'
                  element.style.transform = `translate(-50%, -50%) matrix3d(8, 0, 0, 0, 0, -8, 0, 0, 0, 0, 8, 0, 0, 0, 1000, 1)`
                }

              }

              const symbol = document.createElement('div');
              symbol.className = 'symbol';
              symbol.textContent = this.option.data[i];
              element.appendChild(symbol);

              const object = new THREE.CSS3DObject(element);
              object.position.x = Math.random() * 4000 - 2000;
              object.position.y = Math.random() * 4000 - 2000;
              object.position.z = Math.random() * 4000 - 2000;
              this.scene.add(object);
              this.objects.push(object);

            }

            const objLength = that.objects.length;

            createGridVertices();
            createHelixVertices();
            createSphereVertices();
            function fixPosition (type, i) {
              switch (type) {
                case 'helix': {
                  const phi = i * 0.213 + Math.PI;
                  const object = new THREE.Object3D();
                  object.position.x = 800 * Math.sin(phi);
                  object.position.y = -(i * 8) + 450;
                  object.position.z = 800 * Math.cos(phi + Math.PI);
                  return object
                }; break;
                case 'sphere': {
                  const phi = Math.acos(-1 + (2 * i) / objLength);
                  const theta = Math.sqrt(objLength * Math.PI) * phi;
                  const object = new THREE.Object3D();

                  object.position.x = 800 * Math.cos(theta) * Math.sin(phi);
                  object.position.y = 800 * Math.sin(theta) * Math.sin(phi);
                  object.position.z = -800 * Math.cos(phi);
                  return object
                }; break;
                case 'grid': {
                  const object = new THREE.Object3D();

                  object.position.x = 360 * (i % 5) - 800;
                  object.position.y = -360 * ((i / 5 >> 0) % 5) + 700;
                  object.position.z = -700 * (i / 25 >> 0);
                  return object
                }; break;
              }
            }
            function createSphereVertices () {

              let i = 0;
              const vector = new THREE.Vector3();

              for (; i < objLength; ++i) {

                const object = fixPosition('sphere', i)
                // rotation object 

                vector.copy(object.position).multiplyScalar(2);
                object.lookAt(vector);
                that.targets.sphere.push(object);
              }


            }

            function createHelixVertices () {

              let i = 0;
              const vector = new THREE.Vector3();

              for (; i < objLength; ++i) {

                const object = fixPosition('helix', i)
                object.scale.set(1.1, 1.1, 1.1);

                vector.x = object.position.x * 2;
                vector.y = object.position.y;
                vector.z = object.position.z * 2;

                object.lookAt(vector);

                that.targets.helix.push(object);
              }


            }

            function createGridVertices () {
              let i = 0;

              for (; i < objLength; ++i) {


                const object = fixPosition('grid', i)

                that.targets.grid.push(object);
              }


            }

            // default animation
            this.transform(this.targets[this.option.selectStatus.default], 2000);

            this.render();
          },
        },
        template: `<div :id="id" class="full"><div id="container"></div>  <resize-observer @notify="onWindowResize" /></div>`
      })


      Vue.component(`x-spaceTime`, {
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
            camera: null,
            renderer: null
          }
        },
        mounted () {
          this.init()
        },
        methods: {
          onWindowResize () {
            const { camera, renderer } = this
            const height = document.getElementById(this.id).clientHeight;
            const width = document.getElementById(this.id).clientWidth;
            camera.aspect = width / height
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
            this.render();
          },
          init () {
            const group = new THREE.Group();
            const group2 = new THREE.Group();
            const group3 = new THREE.Group();
            const groupD = new THREE.Group();
            const groupDD = new THREE.Group();
            groupD.add(group2);
            group.add(groupD);
            groupDD.add(group3);
            group.add(groupDD);

            const scene = new THREE.Scene();
            // scene.fog = new THREE.Fog(0xffffff,68,700);//雾化的颜色，近，远
            scene.fog = new THREE.FogExp2(0x000000, 0.0052);// 雾化的颜色，浓度
            const height = document.getElementById(this.id).clientHeight;
            const width = document.getElementById(this.id).clientWidth;
            this.camera = new THREE.PerspectiveCamera(90, width / height, 1, 1000);
            // antialias 抗锯齿
            this.renderer = new THREE.WebGLRenderer({ alpha: false, antialias: false });
            const { camera, renderer } = this

            renderer.setClearColor(0x000000, 0);
            renderer.setSize(width, height);
            renderer.shadowMapEnabled = true;// 渲染器支持阴影

            function pm () {
              for (var jiaodu = 0; jiaodu <= 360; jiaodu++) {
                dx = Math.cos(jiaodu) * 10 * 2.5;
                dy = -0.5 * jiaodu * Math.PI;// 互相垂直
                // dy = -0.5*Math.PI; //互相平行
                dz = Math.sin(jiaodu) * 25;
                var planeGeometryX = new THREE.PlaneGeometry(0.6, 10, 0);
                planeMaterialX = new THREE.MeshPhongMaterial();
                planeMaterialX.opacity = 1;
                planeMaterialX.side = THREE.DoubleSide;
                // planeMaterialX.wireframe =true;
                planeMaterialX.transparent = true;
                planeMaterialX.color = new THREE.Color(0xffffff);
                var dd1 = new THREE.Mesh(planeGeometryX, planeMaterialX);
                dd1.position.x = dx;
                dd1.rotation.y = dy;
                dd1.position.z = dz;
                dd1.position.y = -Math.random() * 220;
                dd1.scale.y = Math.random() * 1;
                dd1.scale.x = Math.random() * 1;
                dd1.scale.z = Math.random() * 1;
                group2.add(dd1);
                group2.position.set(0, 0, 0);
              }

              for (var jiaodu = 0; jiaodu <= 360; jiaodu++) {
                dx = Math.cos(jiaodu) * 10 * 2.5;
                dy = -0.5 * jiaodu * Math.PI;// 互相垂直
                // dy = 0.5*Math.PI; //互相平行
                dz = Math.sin(jiaodu) * 25;
                var planeGeometryX = new THREE.PlaneGeometry(0.5, 10, 0);
                planeMaterialX = new THREE.MeshPhongMaterial();
                planeMaterialX.opacity = 0.7;
                planeMaterialX.side = THREE.DoubleSide;
                // planeMaterialX.wireframe =true;
                planeMaterialX.transparent = true;
                planeMaterialX.color = new THREE.Color(0xffffff);
                var dd1 = new THREE.Mesh(planeGeometryX, planeMaterialX);
                dd1.position.x = dx;
                dd1.rotation.y = dy;
                dd1.position.z = dz;
                dd1.position.y = -Math.random() * 220;
                dd1.scale.y = Math.random() * 4;
                dd1.scale.x = Math.random() * 2;
                dd1.scale.z = Math.random() * 1;
                group3.add(dd1);
                group3.position.set(0, 0, 0);
              }

              for (var jiaodu2 = 0; jiaodu2 <= 60; jiaodu2++) {
                dx2 = Math.cos(jiaodu2) * 10;
                dz2 = Math.sin(jiaodu2) * 10;
                dy2 = Math.cos(Math.random() * jiaodu2) * 0.5;
                var planeGeometryX2 = new THREE.SphereGeometry(Math.cos(jiaodu2) * 2, Math.sin(jiaodu2), 0);
                planeMaterialX2 = new THREE.MeshLambertMaterial();
                planeMaterialX2.side = THREE.DoubleSide;
                // planeMaterialX2.wireframe =true;
                planeMaterialX2.transparent = true;
                planeMaterialX2.opacity = 0.5;
                planeMaterialX2.color = new THREE.Color(0xffffff);
                var dd2 = new THREE.Mesh(planeGeometryX2, planeMaterialX2);
                dd2.position.x = dx2 * 2.5;
                dd2.position.z = dz2 * 2.5;

                dd2.rotation.y = 0.5 * jiaodu2 * Math.PI;
                dd2.position.y = -Math.random() * 240;

                group2.add(dd2);
                group2.position.set(0, 0, 0);

              }

              for (var jiaodu2 = 0; jiaodu2 <= 60; jiaodu2++) {
                dx2 = Math.cos(jiaodu2) * 10;
                dz2 = Math.sin(jiaodu2) * 10;
                dy2 = Math.cos(Math.random() * jiaodu2) * 0.5;
                var planeGeometryX2 = new THREE.SphereGeometry(Math.cos(jiaodu2) * 2, Math.sin(jiaodu2), 0);
                planeMaterialX2 = new THREE.MeshLambertMaterial();
                planeMaterialX2.side = THREE.DoubleSide;
                // planeMaterialX2.wireframe =true;
                planeMaterialX2.transparent = true;
                planeMaterialX2.opacity = 0.5;
                planeMaterialX2.color = new THREE.Color(0xffffff);
                var dd2 = new THREE.Mesh(planeGeometryX2, planeMaterialX2);
                dd2.position.x = dx2 * 2.5;
                dd2.position.z = dz2 * 2.5;

                dd2.rotation.y = 0.5 * jiaodu2 * Math.PI;
                dd2.position.y = -Math.random() * 240;

                group3.add(dd2);
                group3.position.set(0, 0, 0);

              }
            }
            pm();

            // 设置摄像机
            camera.position.set(-30, 30, 30);
            camera.lookAt(scene.position);// 摄像机指向场景中心

            // 设置光源
            const spotLight = new THREE.SpotLight();
            spotLight.position.set(0, 10, 50);
            // spotLight.castShadow = true;
            spotLight.intensity = 10;
            scene.add(spotLight);

            const spotLight2 = new THREE.SpotLight(0x00C1DE);
            spotLight2.position.set(0, 50, 0);
            spotLight2.intensity = 4;
            scene.add(spotLight2);

            const spotLight3 = new THREE.SpotLight();
            spotLight3.position.set(50, 10, -50);
            spotLight3.intensity = 5;
            scene.add(spotLight3);

            // 设置环境光
            const ambientLight = new THREE.AmbientLight(0x222222);
            scene.add(ambientLight);

            // 将渲染输出到叫"WebGL-output"的div中
            document.getElementById("WebGL-output").appendChild(renderer.domElement);
            // renderer.render(scene, camera);

            let step = 0;
            renderScene();
            scene.add(group);

            group3.position.y = -240;
            function renderScene () {
              step += 0.005;
              r = 0.2 * Math.abs(Math.cos(step));
              g = 0.1 * Math.abs(Math.sin(step));
              b = 0.4 * Math.abs(Math.cos(step));
              spotLight.color = new THREE.Color(r, g, b * 2);

              spotLight3.color = new THREE.Color(b, r * 2, g);
              groupD.rotation.x = 0.5 * Math.PI;
              groupD.rotation.z = 0.25 * Math.PI;
              groupD.rotation.y = -0.25 * Math.PI;
              groupDD.rotation.x = .5 * Math.PI;
              groupDD.rotation.z = 0.25 * Math.PI;
              groupDD.rotation.y = -0.25 * Math.PI;
              // group2.rotation.y = -0.57*Math.PI;
              // group3.rotation.y = -0.57*Math.PI;
              group2.rotation.y -= 0.0025;
              group3.rotation.y -= 0.0025;
              if (group2.position.y < 270) {
                group2.position.y += 0.5;
              } else {
                group2.position.y = -200;
              }
              if (group3.position.y < 290) {
                group3.position.y += 0.5;
              } else {
                // scene.remove(group);
                group3.position.y = -210;
              }
              // spotLight.position.x =20*Math.abs(Math.cos(step));
              requestAnimationFrame(renderScene);// 循环执行某动作
              renderer.render(scene, camera);// 渲染这个场景          
            }

          }
        },
        template: `<div :id="id" class="full">
                    <a id="threeLogo">{{option.logo}}</a>
                    <div id="WebGL-output"></div>
                    <resize-observer @notify="onWindowResize" />
                  </div>`,
      });
    },
  },
})
