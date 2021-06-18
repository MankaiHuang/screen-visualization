import React from 'react';
import { connect } from 'dva';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import adminLogin from './BasicLayout';

const code = location.search.split('=')[1]

class SecurityLayout extends React.Component {
  render() {
    const { children, loading, currentUser } = this.props;
    if ((loading) ) {
      return <PageLoading />;
    }
    return children;
  }
}

export default connect(({ user, loading }) => ({
  user,
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
