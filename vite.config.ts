import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import eslint from 'vite-plugin-eslint';
import legacy from '@vitejs/plugin-legacy';
// import { visualizer } from 'rollup-plugin-visualizer'; // 打包内容分析
import IBizVitePlugin from './vite-plugins/ibiz-vite-plugin';

/**
 * 判断是否为自定义标签
 *
 * @author chitanda
 * @date 2023-01-03 16:01:00
 * @param {string} tag
 * @return {*}  {boolean}
 */
function isCustomElement(tag: string): boolean {
  return tag.startsWith('ion-');
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    entries: [
      '@floating-ui/dom',
      '@ibiz-template/core',
      '@ibiz-template/model-helper',
      '@ibiz-template/runtime',
      '@ibiz-template/them',
      '@ibiz-template/vue3-components',
      '@ibiz-template/vue3-util',
      '@ibiz-template/web-theme',
      '@ibiz/model-core',
      '@imengyu/vue3-context-menu',
      '@monaco-editor/loader',
      '@wangeditor/editor',
      '@wangeditor/editor-for-vue',
      'async-validator',
      'cherry-markdown',
      'dayjs',
      'echarts',
      'element-plus',
      'file-saver',
      'lodash-es',
      'monaco-editor',
      'nprogress',
      'path-browserify',
      'vue-grid-layout',
      'pinia',
      'qs',
      'qx-util',
      'ramda',
      'vue',
      'vue-i18n',
      'vue-router',
      'vue-text-format',
      'vuedraggable',
      'xlsx',
      'interactjs',
      '@ibiz-template-plugin/ai-chat',
    ],
  },
  build: {
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        'vue-i18n',
        'element-plus',
        'async-validator',
        'dayjs',
        'interactjs',
        'echarts',
        'axios',
        'qs',
        'ramda',
        'lodash-es',
        'qx-util',
        'vuedraggable',
        'pinia',
        '@floating-ui/dom',
        'vue-grid-layout',
        '@imengyu/vue3-context-menu',
        '@wangeditor/editor',
        '@wangeditor/editor-for-vue',
        '@ibiz-template/core',
        '@ibiz-template/runtime',
        '@ibiz-template/vue3-util',
        '@ibiz-template/model-helper',
        '@ibiz-template/vue3-components',
        '@ibiz-template-plugin/ai-chat',
      ],
    },
  },
  server: {
    proxy: {
      // 子系统代理
      '/api/c85a9cfc76024ede4c6200b3f82eac9d__plmweb__formdesign': {
        target: 'https://plm.ibizlab.cn',
        changeOrigin: true,
      },
      '/api/f268d51400e62c982974b66a561bbe28__plmweb__plmcomweb': {
        target: 'https://plm.ibizlab.cn',
        changeOrigin: true,
      },
      '/api/333a5fe850a5a9235744a63bcee17b40__plmweb__formdesign': {
        target: 'https://plm.ibizlab.cn',
        changeOrigin: true,
      },
      '/api/bee3e98b47a6ae07936311e25460a636__plmweb__logicdesign': {
        target: 'https://plm.ibizlab.cn',
        changeOrigin: true,
      },
      '/api/8d6b7a540f03688de6c2fafee39b339e__plmweb__logicdesign': {
        target: 'https://plm.ibizlab.cn',
        changeOrigin: true,
      },
      '/api/0887f742467822fadc6d27196587a993__plmweb__plmcomweb': {
        target: 'https://plm.ibizlab.cn',
        changeOrigin: true,
      },
      '/api/ibizplm__plmweb/appdata': {
        target: 'https://plm.ibizlab.cn',
        changeOrigin: true,
      },
      '/api/ibizplm__plmweb': {
        target: 'https://plm.ibizlab.cn',
        changeOrigin: true,
      },

      // nacos代理
      // '/api/ibizplm__plmweb/uaa/': {
      //   target: 'http://nacos.ibizcloud.cn:30086',
      //   changeOrigin: true,
      //   rewrite(path) {
      //     return path.replace('/api/', '/');
      //   },
      // },
      // '/api/ibizplm__plmweb/v7': {
      //   target: 'http://nacos.ibizcloud.cn:30086',
      //   rewrite(path) {
      //     return path.replace('/api/', '/');
      //   },
      //   changeOrigin: true,
      // },
      // '/api/ibizplm__plmweb/extension': {
      //   target: 'http://nacos.ibizcloud.cn:30086',
      //   changeOrigin: true,
      //   rewrite(path) {
      //     return path.replace('/api/', '/');
      //   },
      // },
      // '/api/ibizplm__plmweb/dictionaries': {
      //   target: 'http://nacos.ibizcloud.cn:30086',
      //   changeOrigin: true,
      //   rewrite(path) {
      //     return path.replace('/api/', '/');
      //   },
      // },
      // '/api/ibizplm__plmweb/configs': {
      //   target: 'http://nacos.ibizcloud.cn:30086',
      //   changeOrigin: true,
      //   rewrite(path) {
      //     return path.replace('/api/', '/');
      //   },
      // },
      // '/api/ibizplm__plmweb/ibizutil': {
      //   target: 'http://nacos.ibizcloud.cn:30086',
      //   changeOrigin: true,
      //   rewrite(path) {
      //      return path.replace('/api/', '/');
      //   },
      // },
      // '/api/ibizplm__plmweb/portal': {
      //   target: 'http://nacos.ibizcloud.cn:30086',
      //   changeOrigin: true,
      //   rewrite(path) {
      //      return path.replace('/api/', '/');
      //   },
      // },
      // '/api/ibizplm__plmweb/portal/mqtt/mqtt': {
      //   target: 'ws://nacos.ibizcloud.cn:30086',
      //   changeOrigin: true,
      //   rewrite(path) {
      //     return path.replace('/api/', '/');
      //   },
      // },
      // '/api/ibizplm__plmweb/jsonschema': {
      //   target: 'http://nacos.ibizcloud.cn:30086',
      //   changeOrigin: true,
      //   rewrite(path) {
      //     return path.replace('/api/', '/');
      //   },
      // },

      // 前端依赖网关代理的已启动的serviceRunner服务
      //
      // '/api/ibizplm__plmweb': {
      //   target: 'http://nacos.ibizcloud.cn:30086',
      //   changeOrigin: true,
      //   rewrite(path) {
      //     return path.replace('/api/', '/');
      //   },
      // },
      //
      ///////////////////////////////

      // 前端依赖本地已启动的后台代码服务
      // '/api/ibizplm__plmweb/appdata': {
      //   target: 'http://127.0.0.1:18080',
      //   rewrite(path) {
      //     return path.replace('/api/ibizplm__plmweb', '/ibizplm');
      //   },
      //   changeOrigin: true,
      // },
      // '/api/ibizplm__plmweb': {
      //   target: 'http://127.0.0.1:18080',
      //   rewrite(path) {
      //     return path.replace('/api/ibizplm__plmweb', '/ibizplm/serviceapi');
      //   },
      //   changeOrigin: true,
      // },
      //
      ///////////////////////////////

    },
    cors: true,
    fs: {
      strict: false,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@ibiz-template/theme/style/global.scss";',
      },
    },
  },
  plugins: [
    // eslint({
    //   include: 'src/**/*.{ts,tsx,js,jsx}',
    // }),
    vue({
      template: {
        compilerOptions: {
          isCustomElement,
        },
      },
    }),
    vueJsx({
      isCustomElement,
    }),
    legacy({ externalSystemJS: true }),
    IBizVitePlugin(),
    // visualizer(),
  ],
});
