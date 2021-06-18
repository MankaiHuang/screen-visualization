/*
 * @Descripttion: 全局公用方法
 * @Author: cbz
 * @Date: 2020-11-20 15:46:07
 * @LastEditors: cbz
 * @LastEditTime: 2021-03-18 16:00:20
 */
Vue.mixin({
    mounted() {
        this.getStaticUrl()
    },
    methods: {
        getStaticUrl() {
            const scripts = [].slice.call(document.scripts)
            scripts.some(item => {
                if (item.src.includes('commonFun.js')) {
                    const reg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+\/iframe/
                    const nowUrl = item.src.match(reg)[0]
                    this.staticUrl = nowUrl;
                    return true;
                }
            })
        },
        async handlerBluePrintConfig(bluePrintConfig, sourceData) {
            // 执行蓝图编辑器的配置交互
            for (const key in bluePrintConfig) {
                if (!(key === 'tabChange' || key === 'requestCompleted' || key === "leave")) continue;
                // switch (key) {
                //   case 'tabChange': {
                const tabChangeChildren = bluePrintConfig[key]
                const bakSourceData = sourceData // 备份sourceData 因为judge的时候要用
                for (const item of tabChangeChildren) {
                    const { customFunction } = item.property
                    const func = new Function(`return ${customFunction}`)()
                    sourceData = func(sourceData)
                    switch (item.type) {
                        case 'judge':
                            {
                                const { customFunction } = item.property
                                const func = new Function(`return ${customFunction}`)()
                                result = func(bakSourceData)
                                if (result) {
                                    await this.bluePrintAction(item.judgeTrue, item.property, result)
                                } else {
                                    await this.bluePrintAction(item.judgeFalse, item.property, result)
                                }
                            };
                            break;
                        case 'component':
                            {
                                await this.bluePrintAction(action, targetAction.property, sourceData)
                            };
                            break;
                        case 'dataHandler':
                            {
                                await this.bluePrintAction(item.leave, item.property, sourceData)
                            };
                            break;
                        case 'element':
                            {
                                await this.bluePrintAction([item], item.property, sourceData)
                            };
                            break;
                    }
                }
            }

        },
        uniqueArray(array, key) {
            // 数组去重
            const map = new Map();
            for (const item of array) {
                if (!map.has(item[key])) {
                    map.set(item[key], item);
                }
            }
            return [...map.values()];
        },
        apiUrlToAuto(url) {
            // url中存在windowLocationOrigin的替换为自动获取
            if (!url) return
            const reg = /^http(s|):\/\/\S*?\//
            const nowUrl = url.match(reg)[0]
            const result = url.replace(nowUrl, "windowLocationOrigin/"); // 如果url中存在windowLocationOrigin 则替换为window.location.origin 自动获取
            return result;
        },
        getPathByKey(arr, key, value) {
            // arr为树形结构数组，value为要查询的树节点的标识值，key则为标识
            // 获取指定节点的路径数组
            // 用于存储节点唯一标识值路径数组
            this.nodePathArray = [];
            try {
                for (let i = 0; i < arr.length; i++) {
                    this.getNodePath(arr[i], key, value);
                }
            } catch (e) {
                return this.nodePathArray;
            }
        },
        getNodePath(node, key, value) {
            // 这里可以自定义push的内容，而不是整个node,而且这里node也包含了children
            this.nodePathArray.push(node.property.elementId);
            // 找到符合条件的节点，通过throw终止掉递归
            if (node.property[key] === value) {
                // 也可以直接使用return;结束循环
                throw ("over!");
            }
            if (node.property.children && node.property.children.length > 0) {
                for (let i = 0; i < node.property.children.length; i++) {
                    this.getNodePath(node.property.children[i], key, value);
                }
                // 当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
                this.nodePathArray.pop();
            } else {
                // 找到叶子节点时，删除路径当中的该叶子节点
                this.nodePathArray.pop();
            }
        },
        findTemplateForId(id, templateList = this.templateList) {
            // 因为存在children的情况 因此这里要遍历所有元素去查找
            const nowTemplate = []
            const find = (node) => { // 匿名函数防止this指向错误
                node.some(item => {
                    const { type, componentsType, option, children, elementId } = item.property
                    if (type !== 'group') {
                        if (elementId === id) {
                            nowTemplate.push(item);
                            return true
                        }
                        if (componentsType === "private") {
                            // 如果是私有组件 则取 option.templatelist
                            find(option.templateList)
                        }
                    }
                    if (type === 'group' && children.length > 0) {
                        find(children)
                    }

                })
            }
            find(templateList)
            if (nowTemplate.length > 0) {
                return nowTemplate[0]
            }
        },
        GetQueryString(name, url) {
            // 获取url中指定参数的值
            const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
            url = url.split('?')[1]
            try {
                const r = url.match(reg); // search,查询？后面的参数，并匹配正则
                if (r != null) return unescape(r[2]);
                return null;
            } catch (err) {}

        },
        changeLinkTempalte(multLink, value) {
            // 当绑定的组件列表改变的时候去修改列表内id对应的组件内容
            if (!(multLink && multLink.elementId)) return;
            multLink.elementId.map(async item => {
                const nowTemplate = this.findTemplateForId(item)
                    // 和组件联动 当改变tab的选项时 修改联动的组件的接口配置值
                    // 需要定制一个规则, 当改变时若为get请求则改变type值为tab的value值
                    //                 当为post请求 则改变请求参数的type值
                    // 如果为system模式 则获取dataOriginConfig中的值
                const { property } = nowTemplate
                if (property == null) {
                    return
                }
                const { dataOriginConfig } = property
               if (property.dataBindType.default === 'api') {
                    this.changeParams(property.method.default, property, property.params, multLink, value) // url为字符串 直接传递会导致修改不生效
                }
                await this.initApi(nowTemplate)
            })
        },
        changeParams(method, config, params, multLink, value) {
            // 根据切换的值改变对应的params或者url
            if (method === 'get') {
                // 获取url中type对应的值 typ.a
                let type = null
                if (multLink.customKey.includes(',') && Object.prototype.toString.call(value) === '[object Array]') {

                    multLink.customKey.split(',').forEach((key, index) => {
                        type = this.GetQueryString(key, config.url)
                        if (this.origin) {
                            // 匹配结果
                            this.sendMsg('linkKeyNotMatch', null, Boolean(type))
                        }
                        config.url = config.url.replace(`${key}=${type}`, `${key}=${value[index]}`)
                    })
                } else {
                    type = this.GetQueryString(multLink.customKey, config.url)
                    if (multLink.customKey !== '') {
                        config.url = config.url.replace(`${multLink.customKey}=${type}`, `${multLink.customKey}=${value}`)
                    }
                }

            } else if (params.toString() !== '{}') {
                if (multLink.customKey.includes(',') && Object.prototype.toString.call(value) === '[object Array]') {
                    multLink.customKey.split(',').forEach((key, index) => {
                        const type = this.objectUrlEval(params, key, false)
                        if (vm.origin) {
                            // 匹配结果
                            this.sendMsg('linkKeyNotMatch', null, Boolean(type))
                        }
                        config.url = config.url.replace(`${key}=${type}`, `${key}=${value[index]}`)
                        this.objectUrlEval(params, key, true, value[index])
                    })
                } else {
                    if (multLink.customKey !== '') {
                        const result = this.objectUrlEval(params, multLink.customKey, false)
                        if (!result) {
                            const type = this.GetQueryString(multLink.customKey, config.body.request)
                            if (multLink.customKey !== '') {
                                config.body.request = config.body.request.replace(`${multLink.customKey}=${type}`, `${multLink.customKey}=${value}`)
                            }
                        } else {
                            this.objectUrlEval(params, multLink.customKey, true, value)
                        }

                    }
                }
            }
        },
        isHavetab() {
            // 判断页面是否存在tab组件 若存在tab组件则获取其绑定的值
            this.templateList.some(item => {
                if (item.property.componentsType === 'pagination') {
                    this.linkTemplateList = item.property.multLink
                    return true
                }
            })
        },
        async setValue(property, name, value) {
            // 给组件设置属性
            // property: 组件的property属性
            // name: style的name
            // value: 为style赋值的值
            const id = property.elementId
            const elementRef = document.getElementById(`${id}chart-item`)
            property[name] = value // template里面的值也要替换
            if (elementRef == undefined) return;
            if ((name === 'left' || name === 'top') && !String(value).includes('%')) { // 当value中含有% 则为预览的自适应模式 不能使用transform 因为它的百分比是以自身的宽高为基准
                const translate3d = this.setTranslate3d(elementRef.style.transform, name, value) // left top全部使用transform translate3d调换 减少页面重排
                elementRef.style.willChange = 'transform' // 告诉浏览器即将改变transform 增加性能
                elementRef.style.transform = translate3d
            } else {
                elementRef.style.willChange = name
                elementRef.style[name] = value
            }
            elementRef.style.willChange = 'auto'

        },
        bluePrintAction(config, property, sourceData = {}) {
            /**
             * @name: 
             * @param {config: 蓝图配置参数 property: 组件配置的属性, sourceData: 若连接了数据处理 则操作的sourceData}
             * @return {*}
             */
            // 蓝图根据name执行对应的方法
            if (!config) return;
            config.forEach(async item => {
                const { customFunction, moveStep } = item.property
                if (item.type === 'dataHandler' || item.type === 'judge') {
                    // 结尾不是组件
                    this.bluePrintAction(item.leave, item.property, sourceData);
                    return;
                }
                const { actionName, id } = item
                const nowTemplate = this.findTemplateForId(id)
                switch (actionName) {
                    case 'hidden':
                        {
                            this.$set(nowTemplate.property, 'isHidden', true)
                        };
                        break;
                    case 'show':
                        {
                            this.$set(nowTemplate.property, 'isHidden', false)
                        };
                        break;
                    case 'move':
                        {
                            const elementRef = document.getElementById(`${nowTemplate.property.elementId}chart-item`)
                            elementRef.style.transition = '0.5s'
                            this.setValue(nowTemplate.property, 'left', nowTemplate.property.left + moveStep)
                            setTimeout(() => {
                                elementRef.style.transition = 'none'
                            }, 500);
                        };
                        break;
                    case 'importData':
                        {
                            // 导入数据接口
                            const func = new Function(`return ${customFunction}`)()
                            try {
                                const result = func(sourceData)
                                vm.$set(nowTemplate.property.option, 'data', result)
                                nowTemplate.isLoading = this.guid()
                            } catch (err) {
                                console.log(err)
                            }

                        };
                        break;
                    case 'changeVisible':
                        {
                            // 切换显隐状态
                            this.$set(nowTemplate.property, 'isHidden', !nowTemplate.property.isHidden)
                        };
                        break;
                    case 'updateTemplate':
                        {
                            const func = new Function(`return ${customFunction}`)()
                            const result = func(sourceData)
                            nowTemplate.property.option = this.MergeRecursive(nowTemplate.property.option, result)
                            // this.objectUrlEval(nowTemplate.property.option, updateKey, true, updateValue)
                            if (nowTemplate.property.componentsType === 'charts' || nowTemplate.property.secondType === 'earth') {
                                nowTemplate.property.option = {...nowTemplate.property.option }
                            }
                            //console.log(result)
                        };
                        break;
                    case 'requestData':
                        {
                            const { property } = nowTemplate
                            if (property == null) {
                                return
                            }
                            const func = new Function(`return ${customFunction}`)()
                            const result = func(sourceData)

                            const { dataOriginConfig } = property
                           if (property.dataBindType.default === 'api') {
                                this.dynamicParams(property.method.default, property, property.params, result) // url为字符串 直接传递会导致修改不生效
                            }
                            switch (nowTemplate.property.dataBindType.default) {
                                case 'api':
                                    {
                                        this.initApi(nowTemplate)
                                    };
                                    break;
                            }
                        };
                        break;
                }
            })
        },
        dynamicParams(method, config, params, dynamicParams) {
            // 蓝图编辑器动态参数
            Object.entries(dynamicParams).forEach(([key, value]) => {
                if (method === 'get') {
                    // 获取url中type对应的值
                    const type = this.GetQueryString(key, config.url)
                    if (key !== '') {
                        config.url = config.url.replace(`${key}=${type}`, `${key}=${value}`)
                    }
                } else if (params.toString() !== '{}') {
                    if (key !== '') {
                        this.objectUrlEval(params, key, true, value)
                    }
                }
            })

        },
        guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        // 获取随机颜色
        getRandomColor() {
            const color = []
            for (let i = 0; i < 20; i++) {
                color.push({
                    normal: {
                        color: `rgb(${[
                            Math.round(Math.random() * 256),
                            Math.round(Math.random() * 256),
                            Math.round(Math.random() * 256)
                        ].join(',')})`
                    }
                })
            }
            return color;
        },
        SSEBind() {
            // 从SSE中获取数据
            if (this.EventSource || !this.basicConfig.SSEServer) return;
            this.EventSource = new EventSource(this.basicConfig.SSEServer)
                // this.EventSource.onerror = event => {
                //   this.EventSource.close()
                //   // this.Toast(item.name || `${item.type}连接中断`, 'warning')
                // };
            this.EventSource.onmessage = async event => {
                this.templateList.map(item => {
                    const { SSEDataPath, option, componentsType, SSEDataConversionFunction, dataBindType, dataIsAdd, elementId, dataMaxLength } = item.property
                    if (dataBindType.default === 'SSE') { // 配置了SSE
                        if (!SSEDataConversionFunction) {
                            this.dataBindPath(JSON.parse(event.data), SSEDataPath, item.property, dataIsAdd)
                        } else {
                            // 配置了数据转换器
                            const func = new Function(`return ${SSEDataConversionFunction}`)()
                            const result = func(JSON.parse(event.data))
                            if (componentsType === 'charts') {
                                if (dataIsAdd) {
                                    result.forEach((da, daIndex) => {
                                        if (!option.data[daIndex]) option.data[daIndex] = { data: [] } // 不存在初始化一个值防止报错
                                        option.data[daIndex].data = [...option.data[daIndex].data, ...da.data]
                                        option.data[daIndex].name = da.name
                                        option.data[daIndex].data = option.data[daIndex].data.slice(-dataMaxLength) // 截取后两千的数组
                                    })
                                } else {
                                    this.$set(option, 'data', result)
                                }
                            } else if (dataIsAdd) {
                                option.data.unshift(result)
                                option.data.length = 20 // 限制长度 防止无限增加
                                this.$set(option, 'data', option.data)
                            } else {
                                this.$set(option, 'data', result)
                            }
                        }

                        // 让组件更新
                        if (componentsType === 'charts') {
                            item.property.option = {...item.property.option }
                        }

                    }
                })
            };
        },
        dataBindPath(data, dataPath, item, isAdd = false) {
            // 根据用户选择的映射字段 自定义映射数据
            const tempData = item.option.data
            if (Object.prototype.toString.call(dataPath) === '[object Array]') {
                dataPath.some(dp => {
                    const dpApikey = dp.apiKey && dp.apiKey.split('.'); // key的数组格式
                    const indexUpIndex = dpApikey.indexOf('cbzIndex'); // 找
                    let firstArray = []; // 获取第一个出现cbzIndex 的前面个key 并组合成字符串供下面判断是否是数组 如果是则参照api的长度为组件赋值
                    for (let i = 0; i < indexUpIndex; i++) {
                        firstArray.push(dpApikey[i]);
                    }
                    firstArray = firstArray.join('.');
                    if (Object.prototype.toString.call(tempData) === '[object Array]' && Object.prototype.toString.call(tempData[0]) === '[object Object]') {
                        const apiData = this.objectUrlEval(data, firstArray, false)
                        if (Object.prototype.toString.call(apiData) === '[object Array]') {
                            apiData.some((opt, index) => {
                                if (!tempData[index]) {
                                    tempData.push(JSON.parse(JSON.stringify(tempData[0])))
                                }
                                tempData[index][dp.systemKey] = this.objectUrlEval(data, this.replaceStr(dp.apiKey, 'cbzIndex', index), false)
                                    // this.$set(
                                    //   tempData[index],
                                    //   dp.systemKey,
                                    //   this.objectUrlEval(data, this.replaceStr(dp.apiKey, 'cbzIndex', index), false),
                                    // );
                            });
                            tempData.length = apiData.length
                                // this.$set(item.option, 'data', tempData) // 去掉api返回数据没有的对象
                        } else {
                            tempData.map((opt, index) => {
                                this.$set(
                                    opt,
                                    dp.systemKey,
                                    this.objectUrlEval(data, this.replaceStr(dp.apiKey, 'cbzIndex', index), false),
                                );
                            });
                        }
                    } else if (Object.prototype.toString.call(data.data) === '[object Array]') {
                        // 当api的数据不是数组,但是给的是数组
                        this.objectUrlEval(
                            item,
                            dp.systemKey,
                            true,
                            this.objectUrlEval(data, this.replaceStr(dp.apiKey, 'cbzIndex', 0), false),
                        );
                    } else {
                        // 当需要字符串 则取第一项
                        this.objectUrlEval(
                            item,
                            dp.systemKey,
                            true,
                            this.objectUrlEval(data, this.replaceStr(dp.apiKey, 'cbzIndex', 0), false),
                        );
                    }
                });
            }
        },
        getTime(type, hhmmss) {
            // type =0 为当天 type = 1 为前一天
            // hhmmss 自己传需要的时分秒
            const now = new Date();
            let date
            if (type === 0) {
                date = new Date(now + 8 * 3600 * 1000); // 增加8小时 当天
            } else {
                const now = new Date();
                date = new Date(now - 3 * type * 8 * 3600 * 1000); // type天前
            }
            if (hhmmss) {
                return `${date.toJSON().substr(0, 19).replace('T', ' ').substring(0, 10)} ${hhmmss}`;
            }
            return `${date.toJSON().substr(0, 19).replace('T', ' ').substring(0, 10)}`;

        },
        fixParamsTime(params) {
            // 如果params中存在时间查询 因 参数里面不可获取当前时间 因此这里对约定的特殊字符进行获取替换
            // #0,23:59:29# 当天结束 #5,00:00:00#  五天前
            let newParams = JSON.stringify(params)
            const bakTime = newParams.match(/#.*?\#/gi)
            bakTime && bakTime.forEach(item => {
                const time = item.split('#')[1].split(',')
                const originTime = this.getTime(time[0], time[1])
                newParams = newParams.replace(item, originTime)
            })
            return JSON.parse(newParams)
        },
        async initApi(item, isSystem = false) {
            // 初始化接口数据
            let { url, method, params, dataPath, option, dataOriginConfig, componentsType, dataConversionFunction, shareApiId, shareList } = item.property;
            if (url.includes('windowLocationOrigin')) {
                // 自动获取
                url = url.replace('windowLocationOrigin', window.location.origin)
            }
            params = this.fixParamsTime(params)
            method = method.default;
            if (url && method || dataOriginConfig) {
                vm.origin && (vm.sendMsg('loading', null, { loading: true, loadingText: '正在请求数据...' }))
                try {
                    let data = null
                    if (shareApiId && (!shareList || shareList && shareList.length === 0)) {
                        // 如果是共享api  则不去请求接口 直接获取共享接口的response数据即可 减少请求接口的次数
                        vm.origin && this.sendMsg('loading', null, { loading: false })
                            // return;
                    }
                    if (isSystem) {
                        // 系统内置api 
                        data = await axios({
                            method: dataOriginConfig.method,
                            url: dataOriginConfig.url,
                            data: dataOriginConfig.body,
                            timeout: 10000
                        })
                    } else {
                        data = await axios({
                            method,
                            url,
                            data: params,
                            timeout: 10000
                        })
                    }
                    data = data.data
                    this.setData(item, data)
                    item.property.responseData = data
                        // 蓝图绑定切换组件
                    if (item.property.bluePrintConfig && item.property.bluePrintConfig.requestCompleted) {
                        // 当数据请求接口完成时执行 才执行
                        await this.handlerBluePrintConfig(item.property.bluePrintConfig, item.property.responseData)
                    }
                    await shareList && shareList.forEach(item => {
                        // 如果有绑定的组件 则修改所有绑定的组件的值
                        const shareApiTemplate = this.findTemplateForId(item)
                        this.setData(shareApiTemplate, data)
                    })
                } catch (err) {
                    console.log(err)
                    vm.origin && vm.Toast('请求数据失败', 'error');
                }
                vm.origin && vm.sendMsg('loading', null, { loading: false })
            }
        },
        setData(item, data) {
            // 请求完 根据组件设置的数据绑定方式绑定数据
            const { dataPath, option, dataConversionFunction, componentsType } = item.property;

            if (!dataConversionFunction) {
                this.dataBindPath(data, dataPath, item.property, false) // api模式数据不配置叠加模式
            } else {
                const func = new Function(`return ${dataConversionFunction}`)()
                const result = func(data)
                this.$set(option, 'data', result)
            }
            if (componentsType === 'charts') {
                item.property.option = {...option } // echarts图表没有使用deep watch 因为会导致无限watch造成卡顿 因此这里重新赋值option 触发watch
            }
            // this.$set(item, 'isLoading', this.guid())

        },
        MergeRecursive(obj1, obj2) {
            // 合并两个数组   
            for (const p in obj2) {
                if (obj1[p] === undefined) { // 如果obj1没有p 直接把obj2的p加入
                    obj1[p] = obj2[p]
                }
                try {
                    if (obj2[p].constructor === Object) {
                        obj1[p] = this.MergeRecursive(obj1[p], obj2[p])
                    } else if (typeof obj1[p] === 'object') {
                        for (let i = 0; i < obj2[p].length; i++) {
                            if (typeof obj2[p][i] === 'object') { // 数组里面的数据也是数组对象 则进行查找重复并赋值
                                if (obj1[p][i] === undefined) { // 如果obj1中没有obj2的属性就把obj2的属性push到1里
                                    obj1[p].push(obj2[p][i])
                                } else {
                                    this.uniq(obj1[p][i], obj2[p][i])
                                }
                            } else {
                                obj1[p] = obj2[p] // 数组 但是里面的数据是普通类型 直接赋值
                            }
                        }
                    } else {
                        obj1[p] = obj2[p] // 普通类型有直接赋值 obj1没有的就创建并赋值
                    }
                } catch (e) {
                    console.log(e)
                }
            }
            return obj1
        },
        uniq(obj1, obj2) {
            // 查找重复并obj2的值赋给obj1
            Object.keys(obj1).forEach(key => {
                if (typeof obj1[key] === 'object') {
                    try {
                        if (key in obj2) { // 确保obj2有obj1的key 不然会导致失败
                            this.uniq(obj1[key], obj2[key])
                        }
                    } catch (err) {
                        obj1 = obj2
                    }
                } else {
                    if (key in obj2) {
                        obj1[key] = obj2[key]
                    }
                    Object.keys(obj2).forEach(obj2key => { // 把obj2中有的obj1中没有的添加进去
                        if (!(obj2key in obj1)) {
                            obj1[obj2key] = obj2[obj2key]
                        }
                    })
                }
            })
        },
        CSV(csvString) {
            const data = [];
            const relArr = csvString.split(/\s+/); // '\r'
            if (relArr.length > 1) {
                const title = relArr[0].split(',');
                let title_arr = title.keys();
                for (let key = 1, len = relArr.length - 1; key < len; key++) {
                    const values = relArr[key];
                    const objArr = values.split(",");
                    const obj = {};
                    for (let i = 0; i < title.length; i++) {
                        obj[title[title_arr.next().value]] = objArr[i];
                    }
                    data.push(obj);
                    title_arr = title.keys();
                }
            }
            return data;
        },
        objectUrlEval(data, type, isEdit, result = '') {
            // 此方法的用法:
            // 若存在 此数据结构的数据 ps: a: { b: c: { d: { name: 'xx'}} }
            // 调用此方法仅需 objectUrlEval(a, 'b.c.d.name',false) 即可返回 'xx'
            // 若  objectUrlEval(a, 'b.c.d.name',true, 'yy') 可修改name的值为 'yy'
            // 第一个参数是数据源 第二个参数是对象的路径 第三个若传则为此路径赋值
            if (data !== undefined) {
                const temp = type.split('.');
                const tempLength = temp.length; // 路径的长度
                let tempA = data;
                for (let i = 0; i < tempLength; i++) {
                    if (i === tempLength - 1) {
                        if (isEdit) {
                            // tempA[temp[i]] = result // 赋值
                            // 如果想要监听数组变化用set
                            this.$set(tempA, temp[i], result);
                            break;
                        } else {
                            // if (typeof tempA[temp[i]] === 'object') {
                            // return JSON.stringify(tempA[temp[i]])
                            // } else {
                            return tempA[temp[i]]; // 获取值返回
                            // }
                        }
                    }
                    if (typeof tempA[temp[i]] === 'object') {
                        tempA = tempA[temp[i]];
                        continue;
                    } else {
                        tempA[temp[i]] = {} // 不是对象则新增
                    }
                }
            }
        },
        addStr(oldStr, addItem, afterWhich) {
            // 在指定字符串后面添加指定字符串
            const strArr = oldStr.split('');
            strArr.splice(oldStr.indexOf(afterWhich) + afterWhich.length, 0, addItem);
            return strArr.join('');
        },
        replaceStr(str, replaceStr, newStr) {
            return str.replace(replaceStr, newStr)
        },
        addWaterMask(id, str, $element) {
            // 增加水印

            if (document.getElementById(id) !== null) {
                try {
                    document.body.removeChild(document.getElementById(id));
                } catch (err) {}
            }
            if (!str) return;
            const can = document.createElement('canvas');
            const strLength = str.length
            can.width = 30 * strLength;
            can.height = Math.min(200, 30 * strLength);

            const cans = can.getContext('2d');
            // 旋转角度
            cans.rotate(-15 * Math.PI / 180);
            cans.font = '18px Vedana';
            // 设置填充绘画的颜色、渐变或者模式
            cans.fillStyle = 'rgba(200, 200, 200, 0.40)';
            // 设置文本内容的当前对齐方式
            cans.textAlign = 'left';
            // 设置在绘制文本时使用的当前文本基线
            cans.textBaseline = 'Middle';
            // 在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
            cans.fillText(str, can.width / 8, can.height / 2);

            const div = document.createElement('div');
            div.id = id;
            div.style.pointerEvents = 'none';
            div.style.top = '30px';
            div.style.left = '0px';
            div.style.position = 'absolute';
            div.style.zIndex = '1';
            div.style.width = `100%`;
            div.style.height = `100%`;
            div.style.background = `url(${can.toDataURL('image/png')}) left top repeat`;
            $element && $element.appendChild(div);
            return id;
        },
        clearData(property) {
            // 当组件是api或者SSE 删除组件的数据
            property.option.data.forEach(item => {
                item.data = []
                item.data = new Array(property.dataMaxLength).fill({ name: '', value: null, })
            })
        },
        allTemplate2NotGroupAllTemplate(allTemplateList) {
            // 将有组关系的allTemplate转换为没有组的allTemplate
            const previewTemplateList = []
            allTemplateList.map(all => {
                const tempData = []
                const find = (node) => { // 匿名函数防止this指向错误
                    // 向下递归查找所有组件
                    node.map(item => {
                        const { type, groupId } = item.property
                        if (type === 'group') {
                            find(item.property.children)
                        } else {
                            const outLayerProperty = this.getParentGroupProperty(item, true, all) // 获取父组的属性 传入all 避免因为未传入templateList 导致使用this.templateList  因为这里要把所有桌都循环到 使用this.templateList只能获取到当桌面
                            const result = JSON.parse(JSON.stringify(item.property))
                            result.left += outLayerProperty.left
                            result.top += outLayerProperty.top
                            if (result.dataBindType.default === 'api' || result.dataBindType.default === 'SSE') {
                                // 选择接口绑定则将静态json置为null
                                result.staticJson = null
                                result.responseData = null // responseData不需要 删除防止接口返回了html结构数据导致页面打不开
                                delete result['option.data']
                                result.SSEResponseData = null
                                result.dataBindType.default === 'SSE' && this.clearData(result) // SSE 清空data
                                if (this.shareData && this.shareData.isAutoApi) {
                                    // api地址替换为自动获取 
                                    result.originUrl = result.url
                                    result.url = this.apiUrlToAuto(result.url)
                                }
                            }

                            tempData.push({ property: result }) // 嵌套一层property 方便公用方法
                        }
                    })
                }
                find(all)
                previewTemplateList.push(tempData)
            })
            return previewTemplateList
        },
        findGroupForId(nowGroupId, templateList = this.templateList) {
            // 根据组id获取组
            let nowGroupTemplate = null
            const find = (node) => { // 匿名函数防止this指向错误
                node.some(item => {
                    const { type, elementId } = item.property
                    if (type === 'group' && elementId === nowGroupId) {
                        nowGroupTemplate = item;
                        return true
                    }
                    if (type === 'group') {
                        // 去组里面找看是否为组嵌套
                        find(item.property.children)
                    }
                })
            }
            find(templateList)
            return nowGroupTemplate
        },
        getParentGroupProperty(template, isIncludeSelf = true, templateList = this.templateList) {
            // 获取当前组的父组属性之和
            // templateList 如果传templateList 则按照传的 否则使用this.templateList  预览保存页面时传templateList
            const result = {
                left: 0,
                top: 0
            }

            function find(node, isSelf) {
                if (!node) return;
                if (node.property.type === 'group') {
                    if (isSelf) {
                        result.left += node.property.left
                        result.top += node.property.top
                    }
                    const { parentId } = node.property
                    if (parentId) {
                        const parentGroupTemplate = vm.findGroupForId(parentId, templateList)
                        find(parentGroupTemplate, true)
                    }
                } else {
                    find(vm.findGroupForId(node.property.groupId, templateList), true)
                }
            }
            find(template, isIncludeSelf)
            return result;
        },
        debounce(fn, wait) {
            if (this.debounceTimer !== null) {
                clearTimeout(this.debounceTimer)
            }
            this.debounceTimer = setTimeout(fn, wait || 500)
        },
        Toast(message, type) {
            // Toast 提示
            const params = {
                command: 'toast',
                type,
                data: message
            }
            window.parent.postMessage(params, '*') // 用 iframe 外的toast 防止iframe过大 导致toast显示位置不对
        },
        setTranslate3d(translate3d, type, value) {
            // 设置元素的translate3d属性值
            if (translate3d === '') {
                translate3d = 'translate3d(0px,0px,0px)'
            }
            const x = translate3d.substring(12).split('px')[0]
            const y = translate3d.substring(12).split('px')[1].substring(2)
            if (!String(value).includes('%')) {
                value += 'px'
            }
            if (type === 'left') {
                return `translate3d(${value},${y}px,0px)`
            }
            if (type === 'top') {
                return `translate3d(${x}px,${value},0px)`
            }
        }
    }
})