import { Input, Form } from 'antd';
import React from 'react';
import ItemMap from './map';
import LoginContext from './LoginContext';


const FormItem = Form.Item;

const getFormItemOptions = ({
  onChange,
  defaultValue,
  customProps = {},
  rules,
}) => {
  const options = {
    rules: rules || customProps.rules
  };
  if (onChange) {
    options.onChange = onChange;
  }
  if (defaultValue) {
    options.initialValue = defaultValue;
  }
  return options;
};

const LoginItem = props => {

  // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules
  const {
    customProps,
    name,
    ...restProps
  } = props;
  if (!name) {
    return null;
  }
  const options = getFormItemOptions(props);
  const otherProps = restProps || {};

  return (
    <FormItem name={name} {...options}>
      <Input {...customProps} {...otherProps} />
    </FormItem>
  );
};

const LoginItems = {};

Object.keys(ItemMap).forEach(key => {
  const item = ItemMap[key];
  LoginItems[key] = props => (
    <LoginContext.Consumer>
      {context => (
        <LoginItem
          customProps={item.props}
          rules={item.rules}
          {...props}
          type={key}
          {...context}
        />
      )}
    </LoginContext.Consumer>
  );
});

export default LoginItems;
