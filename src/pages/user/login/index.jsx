import { Alert } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { Base64 } from 'js-base64';
import LoginFrom from './components/Login';
import styles from './style.less';

const { UserName, Password, Submit } = LoginFrom;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

export const Login = props => {

  const { userLogin = {}, submitting } = props;
  const { status } = userLogin;

  // 提交
  const handleSubmit = values => {
    const { dispatch } = props;
    const params = {
      loginName: values.userName,
      passWord: values.password
    };
    dispatch({
      type: 'adminLogin/login',
      payload: {params},
    });
  };

  return (
    <div className={styles.main}>
      <LoginFrom onSubmit={handleSubmit}>
        {status === 'error' && !submitting && (
          <LoginMessage content="账户或密码错误！" />
        )}
        <UserName
          name="userName"
          placeholder="请输入用户名"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <Password
          name="password"
          placeholder="请输入密码"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        <Submit loading={submitting}>登录</Submit>
      </LoginFrom>
    </div>
  )

};

export default connect(state => {
  return {
    userLogin: state.login,
    submitting: state.loading.effects['adminLogin/login'],
  }
})(Login);
