/*
 * @Descripttion: 页面编组方法单独提取便于维护, 编组逻辑较为复杂 谨慎修改
 * @Author: cbz
 * @Date: 2020-06-01 10:23:02
 * @LastEditors: cbz
 * @LastEditTime: 2020-12-29 15:51:48
 */

Vue.mixin({
  methods: {
    clickGroup (id) {
      // 点击组
      this.isMoveGroup = true
      this.nowGroupId = id;
      this.nowId = null
      this.sendMsg('updateNowGroupId', 'groupId', this.nowGroupId)
      this.sendMsg('setLayerNowId', null, { elementId: null })
    },
    cannelGroup () {
      // 取消成组
      // 根据nowGroupId 的parentId查找当前选中的组的父组 然后解散当前组
      if (!this.nowGroupId) return;
      const nowGroup = this.findGroupForId(this.nowGroupId)
      const { parentId } = nowGroup.property
      const newSpreadTemplate = []
      const find = (node, parentLeft, parentTop) => {
        // 查找当前组下所有组件并解散
        const { left, top } = node.property // 当前组的 left top 解散之后要将此数据加入到他的children组件中 保持left top 正确
        const nowParentLeft = left + parentLeft
        const nowParentTop = top + parentTop
        node.property.children.forEach(item => {
          const { type, children } = item.property
          if (type !== 'group') {
            item.property.left += nowParentLeft // 累加传给子组
            item.property.top += nowParentTop
            parentId && (item.property.groupId = parentId) // 有父组 则将groupId加入父组
            newSpreadTemplate.push(item)
          } else if (children.length > 0) {
            find(item, nowParentLeft, nowParentTop)
          }
        })
      }
      find(nowGroup, 0, 0)
      if (parentId) {
        const parentGroup = this.findGroupForId(parentId)
        parentGroup && parentGroup.property.children.push(...newSpreadTemplate)
      } else {
        this.templateList.push(...newSpreadTemplate)
      }
      nowGroup.property.children = []
      this.isHaveChildren(this.nowGroupId) // 删除当前组
      this.$nextTick(() => {
        newSpreadTemplate.forEach(item => {
          this.enableDrag(item)
          item.isLoading = this.guid()
        })
      })
      this.sendMsg('group', 'group', this.templateList) // 更新图层
      this.Toast('取消成组成功!', 'success')
      this.isGroupMenu = false
    },

    getChildGroupProperty (template) {
      // 获取下级的属性
      const result = { left: 0, top: 0 }
      function find (node) {
        const { type, left, top, children } = node.property
        if (type === 'group') {
          result.left += left
          result.top += top

        }
        if (children && children.length > 0) {
          children.forEach(item => {
            find(item)
          })
        }
      }
      template.property.children.forEach(item => {
        find(item)
      })
      return result
    },
    getGroupId (template) {
      // 获取当前组内的元素id
      const result = []
      function find (node) {
        node.property.children.forEach(item => {
          const { type, elementId } = item.property
          if (type === 'group') {
            find(item)
          } else {
            result.push(elementId)
          }
        })
      }
      find(template)
      return result;
    },

    setOutLayerProperty (template, width, height, left, top) {
      const $element = document.getElementById(`groupOutLayer${template.property.elementId}`)
      width && ($element.style.width = width)
      height && ($element.style.height = height)
      let translte3d = ''
      if (left) {
        translte3d = this.setTranslate3d($element.style.transform, 'left', left)
        $element.style.transform = translte3d
      }
      top && ($element.style.transform = this.setTranslate3d(translte3d, 'top', top))
      width && (template.property.width = width)
      height && (template.property.height = height)
      left && (template.property.left = left)
      top && (template.property.top = top)
    },
    getMaxMinProperty (template) {
      // template 当前选中的组
      // 计算成组后组内所有组件 包含子组占的最大宽高 用于给组设置宽高
      const result = {
        width: 0,
        height: 0,
        left: Infinity,
        top: Infinity
      }
      const find = (node) => {
        const upProperty = this.getParentGroupProperty(node)
        if (node.property.type === 'group') {
          node.property.children.map(child => {
            find(child)
          })
        } else {
          this.commonGetProperty(node.property, result, upProperty)
        }
      }
      find(template)
      return result;

    },
    setGroupProperty ($element) {
      // 拖动组实时更新let top
      const nowGroup = this.findGroupForId(this.nowGroupId)
      const outLayerProperty = this.getParentGroupProperty(nowGroup, false)
      if (nowGroup.property.parentId) {
        nowGroup.property.left = Math.round(($element.offset().left) / this.zoom) - outLayerProperty.left // 不是最外层的组 要减去外层组的left
        nowGroup.property.top = Math.round(($element.offset().top) / this.zoom) - outLayerProperty.top
      } else {
        nowGroup.property.left = Math.round(($element.offset().left) / this.zoom)
        nowGroup.property.top = Math.round(($element.offset().top) / this.zoom)
      }

    },
    getMaxDeepGroupTemplate (multiplyMoveList, deep = 0) {
      // 获取选中的所有元素中最深的一个元素所在的组
      // 然后所有元素编的组都在这个深度
      const deepList = []
      multiplyMoveList.forEach(item => {
        const deep = this.getPathByKey(this.templateList, 'elementId', item)
        deepList.push({
          id: item,
          deep: deep.length
        })
      })
      const max = deepList.sort((a, b) => {
        return b.deep - a.deep
      })[0]

      return max.id;
    },
    commonGetProperty (property, result, upProperty = { left: 0, top: 0 }) {
      // 提取公共函数 result 为调用者传
      const { width, height, left, top } = property
      const nowWidth = width + left + upProperty.left
      const nowheight = height + top + upProperty.top
      const nowLeft = left + upProperty.left
      const nowTop = top + upProperty.top
      if (result.width < nowWidth) {
        result.width = nowWidth
      }
      if (result.height < nowheight) {
        result.height = nowheight
      }
      if (result.left > nowLeft) {
        result.left = nowLeft
      }
      if (result.top > nowTop) {
        result.top = nowTop
      }
    },
    getMulityMaxMinProperty (multiplyMoveList) {
      // 获取多选列表组件的所有最大最小属性
      const result = {
        width: 0,
        height: 0,
        left: Infinity,
        top: Infinity
      }
      multiplyMoveList.forEach(item => {
        const nowTemplate = this.findTemplateForId(item)
        this.commonGetProperty(nowTemplate.property, result)
      })
      return result;
    },
    getTemplatePropertyInGroup (template, groupTemplate) {
      // 获取当前组件在指定组内的实际left top 属性
      // 先获取当前组件的真实left 在加上当前组件所属组的left
      let outLayerProperty = { left: 0, top: 0 }
      if (template.property.groupId) { // 如果当前组件是在组件内 则取获取父组的属性
        outLayerProperty = this.getParentGroupProperty(this.findGroupForId(template.property.groupId), true) // 获取父组的属性
      }
      const nowLeft = template.property.left + outLayerProperty.left // 得到基于页面的真实距离 而不是基于组的
      const nowTop = template.property.top + outLayerProperty.top


      const groupProperty = this.getParentGroupProperty(groupTemplate, true) // 获取当前组的属性
      const result = { left: 0, top: 0 }
      result.left = nowLeft - groupProperty.left // 得到当前组件在插入到groupTemplate之后的相对属性
      result.top = nowTop - groupProperty.top
      return result;
    },
    refreshGroup (template) {
      // 刷新边框
      if (template.property.type !== 'group') {
        if (template.property.groupId) {
          // 不是group 去获取groupId 如果有groupId 则获取将当前group去调用
          const nowGroup = this.findGroupForId(template.property.groupId)
          nowGroup && this.setGroupOutLayerProperty(nowGroup);
        }
      } else {
        const maxProperty = this.getMaxMinProperty(template) // 获取所有组件的最大属性
        const outLayerProperty = this.getParentGroupProperty(template) // 获取父组的属性
        this.setOutLayerProperty(template, maxProperty.width - outLayerProperty.left, maxProperty.height - outLayerProperty.top)
      }
    },
    setGroupOutLayerProperty (template) {
      // 设置成组之后组的外边框宽高
      if (template.property.type !== 'group') {
        if (template.property.groupId) {
          // 不是group 去获取groupId 如果有groupId 则获取将当前group去调用
          const nowGroup = this.findGroupForId(template.property.groupId)
          nowGroup && this.setGroupOutLayerProperty(nowGroup);
        }
      } else {
        /*
          获取当前组的属性 outLayerProperty
          获取组内属性 groupProperty
          获取所有组件最大属性 maxProperty
        */
        const multiplyMoveList = this.getGroupId(template)

        const maxProperty = this.getMaxMinProperty(template) // 获取所有组件的最大属性
        const outLayerProperty = this.getParentGroupProperty(template, false) // 获取父组的属性

        const left = maxProperty.left - outLayerProperty.left // 所有属性的最小left - 所有父组的left
        const top = maxProperty.top - outLayerProperty.top
        const width = maxProperty.width - outLayerProperty.left // 所有属性的最大width - 所有父组的left
        const height = maxProperty.height - outLayerProperty.top
        const bakProperty = {
          width: template.property.width,
          height: template.property.height,
          left: template.property.left,
          top: template.property.top,
        } // 修改属性前的备份属性

        this.setOutLayerProperty(template, width, height, left, top)
        multiplyMoveList.forEach(item => {
          const groupList = this.findTemplateForId(item)
          this.setValue(groupList.property, 'left', groupList.property.left - (template.property.left - bakProperty.left)) // 其他组件减去位移的距离 让其它没有拖拽的组件不动
          this.setValue(groupList.property, 'top', groupList.property.top - (template.property.top - bakProperty.top))
        })
        this.refreshGroup(template)
      }
    },
    group (multiplyMoveList) {
      // 组件成组
      // 新建一个空组 然后此空组将所有待成组的组件放到它的children中
      // 它的子组件的left top全部基于父组件进行叠加
      const maxDeepElementId = this.getMaxDeepGroupTemplate(multiplyMoveList) // 获取选中的所有组件最深的一个元素id
      const maxDeepTemplate = this.findTemplateForId(maxDeepElementId) // 根据id获取组件
      const bakMaxDeepTemplate = JSON.parse(JSON.stringify(maxDeepTemplate)) // 备份最深的组
      // 生成的组 它的left,top 为选中的所有组件的最小left,top
      //         它的width 为选中的所有组件最大的left+width的值 
      //         它的height 为选中的所有组件最大的top+height的值 
      const groupProperty = this.getMulityMaxMinProperty(multiplyMoveList) // 获取即将添加group的left top width height
      maxDeepTemplate.property = {} // 修改它的property属性改为空组的专属属性
      delete maxDeepTemplate.type // 删掉不需要的属性
      delete maxDeepTemplate.componentsType
      delete maxDeepTemplate.command
      delete maxDeepTemplate.backgroundId

      const outLayerProperty = this.getParentGroupProperty(this.findGroupForId(bakMaxDeepTemplate.property.groupId), false)
      maxDeepTemplate.property.type = 'group' // !!!!!!!属于group的特殊属性
      maxDeepTemplate.property.left = groupProperty.left - outLayerProperty.left
      maxDeepTemplate.property.top = groupProperty.top - outLayerProperty.top
      maxDeepTemplate.property.width = groupProperty.width - groupProperty.left + outLayerProperty.left
      maxDeepTemplate.property.height = groupProperty.height - groupProperty.top + outLayerProperty.top
      maxDeepTemplate.property.zIndex = 1
      maxDeepTemplate.property.groupName = '组'
      maxDeepTemplate.property.elementId = this.guid()
      maxDeepTemplate.property.parentId = bakMaxDeepTemplate.property.groupId // 如果编过组 则parentId为之前编组的id
      this.$set(maxDeepTemplate.property, 'children', [bakMaxDeepTemplate]) // 一定要用set  否则因为上面将property清空 导致直接新增children会使后续的children不是响应式

      this.$nextTick(() => {
        const $element = document.getElementById(`groupOutLayer${maxDeepTemplate.property.elementId}`)
        $element.style.transform = this.setTranslate3d($element.style.transform, 'left', groupProperty.left - outLayerProperty.left)
        $element.style.transform = this.setTranslate3d($element.style.transform, 'top', groupProperty.top - outLayerProperty.top)
        // $element.style.left = groupProperty.left - outLayerProperty.left
        // $element.style.top = groupProperty.top - outLayerProperty.top
        $element.style.width = groupProperty.width - groupProperty.left + outLayerProperty.left
        $element.style.height = groupProperty.height - groupProperty.top + outLayerProperty.top
      })

      multiplyMoveList.forEach(item => {
        const groupList = this.findTemplateForId(item)
        const realProperty = this.getTemplatePropertyInGroup(groupList, maxDeepTemplate) // 获取当前组件基于maxDeepTemplate的相对属性 left top 保证成组之后位置不变
        groupList.property.groupId = maxDeepTemplate.property.elementId // 当前组的id
        this.setValue(groupList.property, 'left', realProperty.left)
        this.setValue(groupList.property, 'top', realProperty.top)
        if (item !== maxDeepElementId) {
          this.deleteTemplateFroId(item, false); // 第二个参数false 不去刷新组边框
          maxDeepTemplate.property.children.push(groupList)
        }
        this.$nextTick(() => {
          this.enableDrag(groupList)
          groupList.isLoading = this.guid()
        })
      })
      this.nowGroupId = maxDeepTemplate.property.elementId
      this.$nextTick(() => {
        this.chartDrager.newInstance(`#groupOutLayer${maxDeepTemplate.property.elementId}`, $element => {
          // 拖拽成组生成的group组件不进行后续操作
          this.setGroupProperty($element)
        })
      })
      this.sendMsg('group', 'group', this.templateList)
      this.multiplyMoveList = []
      this.Toast('编组成功!', 'success')
      this.menuVisible = false
    },
  }
})