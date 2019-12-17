const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = function override(config, env) {
    // do stuff with the webpack config...
    return config;
};
module.exports = override(
    // 针对antd实现按需打包 根据import来打包(使用balel-plugin-import)
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true, //自动打包相关样式
    }),
    // 使用less-loader 对源码中的less的变量进行重新指定
    addLessLoader({
        // adtd 定制主题
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#1DA57A' }
    })
);