import React, { useState, useEffect } from 'react';
import { Button, Menu, Dropdown, Pagination, Spin, Input, Select } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons'
import Grid from '../../components/Grid/Grid'; // 列表
import listData from './listData'
import './index.less';
// import TableButton from '../../components/TableButton'; // 列表上方按钮
const { Search } = Input;
const { Option } = Select
// just demo
export default () => {
  const [templateList, setTemplateList] = useState([])
  const [total, setTotal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const [sortName, setSortName] = useState('createTime')
  const initData = async (pageNum = 1, name = "", sort = "createTime") => {
    setLoading(true)
    const tempList = []
    listData.data.list.map(item => {
      tempList.push({ id: item.id, name: item.name, isSystem: item.type === 0, preview: item.preview, description: item.extend.description ,_public:item._public})
    })
    setTotal(listData.data.total)
    setTemplateList(tempList)
    setLoading(false)
  }
  const changePage = e => {
    initData(e, searchKey, sortName)
  }
  // 第二个参数里面添加了才刷新
  useEffect(() => {
    initData()
  }, [])

  const search = e => {
    setSearchKey(e)
    initData(1, e, sortName)
  }
  const sort = e => {
    setSortName(e)
    initData(1, searchKey, e)
  }
  return (
    <React.Fragment>
      <div className="top-tools">
        <Search
          placeholder="请输入大屏名称查询"
          onSearch={value => {
            search(value);
          }}
          enterButton
          className="screen-search"
        />
        <Select className="screen-select" defaultValue="按创建时间排序" bordered={false} onChange={sort}>
          <Option value="createTime">按创建时间排序</Option>
          <Option value="name">按名称排序</Option>
        </Select>
      </div>

      {templateList.length >= 0 && (<Spin delay={100} spinning={loading}><Grid
        key={loading}
        setLoading={setLoading}
        initData={initData}
        templateList={templateList}
        type={1}
      /></Spin>)}
      <Pagination className="bottomPagination" defaultCurrent={1} hideOnSinglePage pageSize={17} total={total} onChange={e => { changePage(e) }} />

    </React.Fragment>

  );
};
