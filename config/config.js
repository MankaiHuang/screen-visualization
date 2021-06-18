import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import proxy from './proxy';
import { webpackPlugin, plugins } from './plugin.config';
const { REACT_APP_ENV } = process.env;
export default {
    plugins,
    hash: true,
    targets: {
        ie: 11,
    },
    // umi routes: https://umijs.org/zh/guide/router.html
    routes: [{
            path: '/user',
            component: '../layouts/UserLayout',
            routes: [{
                name: 'login',
                path: '/user/login',
                component: './user/login',
            }, ],
        },
        {
            path: '/workspace',
            component: '../layouts/SecurityLayout',
            routes: [{
                path: '/workspace',
                name: 'workspace',
                icon: 'sketch',
                component: './Workspace/index.jsx',
            }, ],
        },
        {
            path: '/',
            component: '../layouts/SecurityLayout',
            routes: [{
                    path: '/',
                    component: '../layouts/BasicLayout',
                    authority: ['admin', 'user'],
                    routes: [
                        //我的大屏
                        {
                            path: '/screen',
                            name: 'screen',
                            icon: 'crown',
                            authority: ['user'],
                            component: './screen/Mine.jsx',
                        }, //数据源管理
                        {
                            component: './404',
                        },
                    ],
                },
                {
                    component: './404',
                },
            ],
        },
        {
            component: './404',
        },
    ],
    // Theme for antd: https://ant.design/docs/react/customize-theme-cn
    theme: {
        // ...darkTheme,
        'primary-color': defaultSettings.primaryColor,
    },
    define: {
        REACT_APP_ENV: REACT_APP_ENV || false,
    },
    ignoreMomentLocale: true,
    lessLoaderOptions: {
        javascriptEnabled: true,
    },
    disableRedirectHoist: true,
    cssLoaderOptions: {
        modules: true,
        getLocalIdent: (context, _, localName) => {
            if (
                context.resourcePath.includes('node_modules') ||
                context.resourcePath.includes('ant.design.pro.less') ||
                context.resourcePath.includes('global.less')
            ) {
                return localName;
            }

            const match = context.resourcePath.match(/src(.*)/);

            if (match && match[1]) {
                const antdProPath = match[1].replace('.less', '');
                const arr = slash(antdProPath)
                    .split('/')
                    .map(a => a.replace(/([A-Z])/g, '-$1'))
                    .map(a => a.toLowerCase());
                return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
            }

            return localName;
        },
    },
    manifest: {
        basePath: '/',
    },
    base: '/screen/',
    publicPath: './',
    history: 'hash',
    proxy: proxy[REACT_APP_ENV || 'dev'],
    chainWebpack: webpackPlugin,
    treeShaking: true,
};