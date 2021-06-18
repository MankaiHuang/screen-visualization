export function fixdescription(key) {
    // 根据key修改属性对应的说明文字
    // 这里怎么能像属性哪有自动呢 不用一个个设置???
    const keyList = key.split('.')
    let result = null
    const keyListTwo = Number(keyList[1])
    const list = {
        'type': '图表类型',
        'smooth': '平滑曲线',
        "nameColor": "名称颜色",
        'label.normal.show': '图表上是否显示文字',
        'emphasis.label.show': '是否显示标签',
        'legend.bottom': '图例离容器下侧的距离',
        'legend.itemGap': '图例每项之间的间隔',
        'legend.orient': '图例列表的布局朝向(horizontal,vertical)',
        'legend.padding': '图例内边距',
        'legend.right': '图例离容器右侧的距离',
        'legend.textStyle.fontSize': '图例文字字号',
        'legend.textStyle.padding': '图例文字内边距',
        'legend.top': '图表离容器上册的距离',
        'animation': '是否开启动画',
        'areaStyle.normal.opacity': '图形透明度',
        'itemStyle.barBorderRadius': '圆角半径',
        'itemStyle.normal.color.colorStops': '渐变色配置',
        'itemStyle.normal.labelLine.color': '渐变色渐变类型',
        'itemStyle.normal.color.x': '渐变色颜色x',
        'itemStyle.normal.color.x2': '渐变色颜色x2',
        'itemStyle.normal.color.y': '渐变色颜色y',
        'itemStyle.normal.color.y2': '渐变色颜色y2',
        'label.normal.backgroundColor': '文字背景颜色',
        'label.normal.borderRadius': '文字边框圆角度',
        'label.normal.distance': '距离图形元素的距离',
        'label.normal.formatter': '标签内容格式器',
        'label.normal.height': '文字边框高度',
        'label.normal.lineHeight': '文字边框行高',
        'label.normal.position': '文字位置设置',
        'label.normal.rich.a.align': 'rich a对齐方式',
        'label.normal.rich.a.color': 'rich a颜色',
        'label.normal.rich.b.align': 'rich b对齐方式',
        'label.normal.rich.b.color': 'rich b颜色',
        'label.normal.rich.b.borderColor': 'rich b边框颜色',
        'label.normal.rich.b.borderWidth': 'rich b边框宽度',
        'label.normal.rich.b.height': 'rich b高度',
        'label.normal.rich.b.width': 'rich b宽度',
        'label.normal.rich.d.color': '文字前点点颜色',
        'label.normal.width': '文字整体宽度',
        'legend.textStyle.color': '图例文字颜色',
        'itemStyle.normal.label.color': '图形文字颜色',
        'itemStyle.normal.label.position': '标签的位置',
        'itemStyle.normal.label.show': '是否显示标签',
        'itemStyle.normal.labelLine.show': '是否显示标签前线条',
        'xAxis.axisLabel.show': '是否显示X轴文字',
        'xAxis.axisLine.lineStyle.color': 'X轴线条颜色',
        'xAxis.axisLine.show': '是否显示X轴线条',
        'title.textStyle.color': '标题字体颜色',
        'title.textStyle.fontSize': '标题字体字号',
        'title.x': '标题水平对齐方式',
        'title.y': '标题垂直对齐方式',
        'dataZoom': 'XY轴缩放滚动条设置',
        'visualMap.left': '视觉映射组件靠左距离',
        'visualMap.max': '视觉映射组件最大值',
        'visualMap.min': '视觉映射组件最小值',
        'visualMap.showLabe': '视觉映射组件是否显示标签',
        'visualMap.splitNumber': '视觉映射组件分割段数',
        'visualMap.text': '视觉映射组件显示文字',
        'visualMap.type': '视觉映射组件连续型',
        'endLine': '线条结尾坐标配置',
        'backgroundColor': '背景颜色',
        'title.text': '标题',
        'title.left': '标题位置',
        'tooltip.show': '显示提示框',
        'tooltip.trigger': '提示框触发类型',
        'legend.icon': '图例icon',
        'legend.show': '图例是否显示',
        'legend.data': '图例数据',
        'yAxis.axisLabel.textStyle.color': 'Y轴颜色',
        'yAxis.axisLabel.textStyle.fontSize': 'Y轴字体',
        'yAxis.splitLine.show': '是否显示Y轴分割线',
        'yAxis.splitLine.lineStyle.color': 'Y轴分割线颜色',
        'xAxis.data': 'X轴数据',
        'xAxis.boundaryGap': 'X轴是否留白',
        'xAxis.axisLabel.textStyle.color': 'X轴颜色',
        'xAxis.axisLabel.textStyle.fontSize': 'X轴字体',
        'stripe': '是否显示斑马线',
        'border': '是否带有纵向边框	',
        'size': '尺寸',
        'fit': '列的宽度是否自撑开	',
        'showheader': '是否显示表头',
        'highlightCurrentRow': '是否要高亮当前行',
        'data': '数据',
        'headerKey': '表头数据',
        'sortable': '是否排序',
        'sortableIndex': '按照第几行数据排序',
        'fontSize': '字体大小',
        'fontWeight': '字体粗细',
        'color': '颜色',
        'fontFamily': '字体',
        'liHeight': '行高',
        'liBackgroundColor': '行背景颜色',
        'background': '背景图',
        'Animationtime': '动画时间',
        'tooltip.formatter': '提示格式',
        'legend.left': '图例靠左距离',
        'src': '路径',
        'alt': '图像的替代文本',
        'isloading': '是否显示加载',
        'isShowError': '是否显示失败',
        'class': '类名',
        'imgText': '图片文本',
        'selectShape': '请选择形状',
        'selectFit': '请选择缩放方式',
        'selectType': '请选择类型',
        'closable': '是否显示关闭按钮',
        'selectEffect': '请选择风格',
        'editable': '是否可编辑',
        'readonly': '是否只读',
        'disabled': '是否禁用',
        'selectSize': '请选择尺寸',
        'startPlaceholder': '开始日期placeholder',
        'endPlaceholder': '结束日期placeholder',
        'format': '时间格式',
        'align': '对齐方式',
        'rangeSeparator': '时间范围间隔符',
        'defaultValue': '默认值',
        'defaultTime': '默认时间',
        'activeColor': '开启颜色',
        'activeText': '开启文本',
        'inactiveColor': '关闭颜色',
        'inactiveText': '关闭文本',
        'noMatchText': '无数据时文本',
        'isCustom': '右侧是否显示value',
        'dataList': '数据列表',
        'isButtonRadio': '是否为按钮模式',
        'min': '最少选中个数',
        'max': '最多选中个数',
        'textColor': '文本颜色',
        'fill': '按钮风格填充颜色',
        'round': '是否开启圆角',
        'plain': '是否为简洁模式',
        'icon': 'icon类名',
        'justifyContent': '左右对齐方式（flex）',
        'alignItems': '上线对齐方式（flex)',
        'circle': '是否为圆形',
        'isHref': '是否为超链接',
        'href': '超链接地址href',
        'target': '超链接打开方式target',
        'showHeader': '是否显示表头',
        'clearable': '是否显示清空按钮',
        'multiple': '是否允许多选',
        'emptyText': '空数据显示的文本',
        'filterable': '是否开启过滤功能',
        'collapsetags': '多选时是否将选中值按文字的形式展示',
        'hit': '是否有边框描边',
        'disableTransitions': '是否禁用渐变动画',
        'title': '标题',
        'tooltip': '提示设置(tooltip)',
        'legend': '图例设置(legend)',
        'visualMap': '地图左侧滚动条设置(visualMap)',
        'series': '系列设置(series)',
        'yAxis': 'Y轴设置(yAxis)',
        'xAxis': 'X轴设置(xAxis)',
        'geo': '地理位置设置(geo)',
        'radar': '雷达设置(radar)',
        'xAxis3D': 'X轴(xAxis3D)',
        'yAxis3D': 'Y轴(yAxis3D)',
        'zAxis3D': 'Z轴(zAxis3D)',
        'grid3D': '3D网格(grid3D)',
        'dataset': '数据设置(dataset)',
        'grid': '网格(grid)',
        'toolbox': '工具箱(toolbox)',
        'descriptionFontSize': '描述字号',
        'activeFontColor': '激活字体颜色',
        'activeProgressColor': '激活进度条颜色',
        'fontColor': '字体颜色',
        'progressColor': '进度条颜色',
        'titleColor': '标题颜色',
        'indexFontSize': '序号字号',
        'leftFontSize': '左侧文字字号',
        'rightFontSize': '右侧文字字号',
        'selectStyle': '选择样式',
        'titleFontSize': '标题字号',
        'fromColor': '来源颜色',
        'indexBorderColor': '序号边框颜色',
        'indexColor': '序号颜色',
        'timeColor': '时间颜色',
        'activeFontSize': '激活字体字号',
        'borderColor': '边框颜色',
        'detailsFontColor': '详情字体颜色',
        'headerBackgroundColor': '表头背景颜色',
        'indexIsHaveBorder': '序号边框',
        'headerFontColor': '表头字体颜色',
        'isHaveActiveImg': '滚动图片',
        'isHaveHeader': '表头',
        'isHaveIndex': '序号',
        'maxLength': '最大长度',
        'height': '高度',
        'marginBottom': '距离底部距离',
        'statusFontSize': '状态字号',
        'authorColor': '作者颜色',
        'detailsColor': '详情颜色',
        'detailsFireColor': '详情热度颜色',
        'detailsFireFontSize': '详情热度字号',
        'detailsFireIconColor': '详情热度图标颜色',
        'detailsFontSize': '详情字号',
        'detailsFromColor': '详情来源颜色',
        'detailsFromFontSize': '详情来源字号',
        'detailsTimeColor': '详情时间颜色',
        'detailsTimeFontSize': '详情时间字号',
        'detailsTitleColor': '详情标题颜色',
        'detailsTitleFontSize': '详情标题字号',
        'fireColor': '热度颜色',
        'fireFontSize': '热度字号',
        'fireIconColor': '热度图标颜色',
        'timeFontSize': '时间字号',
        'pageSize': '单页个数',
        'total': '总量',
        'fromFontSize': '来源字号',
        'authorFontSize': '作者字号',
        'xAxis.show': '是否显示X轴',
        'yAxis.show': '是否显示Y轴',
        'geoJSON': '默认显示地址位置',
        'border1Color': '边框1颜色',
        'buildsOpacity': '建筑物透明度',
        'duration': '线条持续时间',
        'heightFactor': '建筑物高度',
        'interval': '线条间隔',
        'lineBlur': '线条虚化度',
        'lineOpacity': '线条透明度',
        'lineWidth': '线条宽度',
        'radius': '扫描线范围',
        'rotateSpeed': '旋转速度',
        'trailLength': '线条轨迹长度',
        'fontStyle': '字体样式',
        'selectFontFamily': '请选择字体',
        'selectPosition': '对齐方式',
        'rotateX': 'X旋转速度',
        'rotateY': 'Y旋转速度',
        'rotateZ': 'Z旋转速度',
        'selectStatus': '请选择样式',
        'centerCity': '城市范围',
        'systemCode': '表单CODE',
        'longitude': '中心经度',
        'latitude': '中心纬度',
        'site': '站点CODE',
        'selectMapStyle': '地图风格',
        'selectBorderStyle': '边框样式'
    }
    if (keyList[0] === 'series' && !isNaN(keyListTwo)) {
        keyList.shift() // 去掉series
        keyList.shift() // 去掉
        const tempKey = keyList.join('.')
        result = `系列${keyListTwo}设置-${list[tempKey] || tempKey}`
    } else {
        result = list[key] || key
    }


    return result
}


export function fixType(key, value) {
    // 根据value的类型自动生成应该需要的type
    // Object Array: array
    // number,
    // string:text
    // Boolean switch
    switch (Object.prototype.toString.call(value)) {
        case '[object Object]':
            if (key.substring(0, 10) === 'selectMult') {
                return 'selectMult';
            }
            if (key.substring(0, 6) === 'select') {
                return 'select';
            }
            return 'array';
            break;
        case '[object Array]':
            return 'array';
            break;
        case '[object Number]':
            return 'number';
            break;
        case '[object String]':
            if (key.substring(key.length - 5).toLowerCase() === 'color') {
                return 'color';
            }
            return 'text';
            break;
        case '[object Boolean]':
            return 'switch';
            break;
    }
}
export function fixEditor(key, value) {
    // 根据value的类型自动生成应该需要的editor
    // Object Array Number String: input
    // Boolean switch
    switch (Object.prototype.toString.call(value)) {
        case '[object Object]':
            if (key.substring(0, 6) === 'select') {
                return 'select';
            }
            return 'input';

            break;
        case '[object Array]':
            return 'input';
            break;
        case '[object Number]':
            return 'input';
            break;
        case '[object String]':
            return 'input';
            break;
        case '[object Boolean]':
            return 'switch';
            break;
        case '[object Boolean]':
            return 'switch';
            break;
    }
}