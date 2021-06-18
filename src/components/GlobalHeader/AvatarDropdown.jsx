import { Avatar, Menu, Spin } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { replaceRequestConf } from '@/utils/utils'
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { baseUrl, severUrl } from '@/utils/request.js';

class AvatarDropdown extends React.Component {
  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
      return;
    }

    router.push(`/account/${key}`);
  };

  render() {
    const { currentUser, menu, } = this.props;
    const { avatar = '', headpic = '', name = '', nickName = '', } = currentUser || {};
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
       
      </Menu>
    );
    return currentUser ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={replaceRequestConf(headpic) || avatar} alt="avatar" />
          <span className={styles.name}>{nickName || name}</span>
        </span>
      </HeaderDropdown>
    ) : (
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
