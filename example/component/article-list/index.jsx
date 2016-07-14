import React, { Component, PropTypes } from 'react'
import { Table } from 'antd'
import { wrapper } from '../../../src'
import * as action from '../../action/article-list'

@wrapper(action)
class ArticleList extends Component {
  static propTypes = {
    articles: PropTypes.array.isRequired,
    totalSize: PropTypes.number.isRequired,
    pageInfo: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    action: PropTypes.object.isRequired,
  }

  getColumns() {
    const columns = [{
      title: 'number',
      dataIndex: 'number',
    }, {
      title: 'title',
      dataIndex: 'title',
    }, {
      title: 'body',
      dataIndex: 'body',
      render: body => body.slice(0, 20),
    }, {
      title: 'created_at',
      dataIndex: 'created_at',
    }, {
      title: 'updated_at',
      dataIndex: 'updated_at',
    }]
    return columns
  }


  render() {
    const { articles, totalSize, pageInfo, loading } = this.props
    const { pageSize, pageNum } = pageInfo
    const { changePageInfo } = this.props.action
    const columns = this.getColumns()
    const pagination = {
      current: pageNum,
      total: totalSize,
      pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共${total}个记录`,
      onChange: num => changePageInfo({ pageNum: num }),
      onShowSizeChange: (current, size) => changePageInfo({ pageSize: size }),
    }
    return (
      <div id="article-list">
        <Table columns={columns} dataSource={articles} pagination={pagination} loading={loading} />
      </div>
    )
  }
}

export default ArticleList
