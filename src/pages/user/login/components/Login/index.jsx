import { Form } from 'antd';
import React from 'react';
import classNames from 'classnames';
import LoginItem from './LoginItem';
import LoginSubmit from './LoginSubmit';
import styles from './index.less';


const Login = props => {
  const { className } = props;

  return (
    <div className={classNames(className, styles.login)}>
      <Form
        form={props.from}
        onFinish={values => {
          if (props.onSubmit) {
            props.onSubmit(values);
          }
        }}
      >
        {props.children}
      </Form>
    </div>
  );
};

Login.Submit = LoginSubmit;

Login.UserName = LoginItem.UserName;
Login.Password = LoginItem.Password;

export default Login;
