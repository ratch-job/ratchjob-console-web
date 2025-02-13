import MainLayout from '@/components/layout/MainLayout.vue';
import NotFound from '@/pages/NotFound.vue';
import Tmp from '@/pages/Tmp.vue';
import { ServerOutline, CubeOutline, AppsSharp } from '@vicons/ionicons5';
import { getMessage as t } from '@/i18n';

export const routes = [
  {
    path: '/',
    name: 'index',
    meta: { title: 'index' },
    component: Tmp
  },
  {
    path: '/404',
    name: 'not found',
    meta: { title: '404' },
    component: NotFound
  },
  {
    path: '/manage',
    name: 'manage',
    meta: { title: 'manage title' },
    component: MainLayout,
    children: [
      {
        path: '/manage/tmp',
        name: 'manange tmp',
        meta: { title: 'index' },
        component: Tmp
      },
    ]
  }
];

function buildManageMenu(routes) {
  var manageMenu = [];
  for (var manage of routes) {
    if (manage.path === '/manage') {
      for (var item of manage.children || []) {
        manageMenu.push({ ...item });
      }
    }
  }
  return manageMenu;
}

//const manageMenu = buildManageMenu(routes)

export const manageMenu = buildManageMenu(routes);

export const sideAllMenu = [
  {
    name: t('menu.system_management'),
    icon: markRaw(AppsSharp),
    children: [
      {
        name: t('menu.about'),
        path: '/manage/tmp'
      }
    ]
  }
];

//export default routes ;
/*
    routes,
    manageMenu
};
*/
