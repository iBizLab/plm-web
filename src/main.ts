import 'vue';
// import { IApiAppHubService } from '@ibiz-template/runtime';
// import { AppHooks } from '@ibiz-template/vue3-util';
import { runApp } from '@ibiz-template/vue3-components';
import VueTextFormat from 'vue-text-format';
import gridLayout from 'vue-grid-layout';
import UserRegister from './user-register';
import ComponentsRegister from './components/index';
import { StaticAuthGuard } from './guard/auth-guard/auth-guard';
import '@/publish/sys.css';

// AppHooks.appResorceInited.tap((ctx: IApiAppHubService) => {
//   ctx.microAppConfigCenter.registerMicroApps([
//     {
//       name: 'plmcomweb',
//       entry: 'http://localhost:4173',
//       baseUrl: '4178bef3e0e0f43479aea070a3ee4188__plmweb__plmcomweb',
//     },
//   ]);
// });
runApp([VueTextFormat, gridLayout, ComponentsRegister, UserRegister], {
  getAuthGuard: () => new StaticAuthGuard(),
});
