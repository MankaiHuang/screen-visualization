import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import { Link } from 'umi';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    formatMessage,
    ...props,
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        {/* <div className={styles.lang}>
        <SelectLang />
      </div> */}
        <div className={styles.content}>
          <div className={styles.login}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link>
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>SKY PAD(spd))</span>
                </Link>
              </div>
              <div className={styles.desc}>成都新加坡工业园最佳SKY PAD(spd))</div>
            </div>

            {children}
          </div>
        </div>
        {/* <DefaultFooter /> */}
      </div>
    </>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
