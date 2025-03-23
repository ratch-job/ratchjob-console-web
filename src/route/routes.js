import MainLayout from '@/components/layout/MainLayout.vue';
import NotFound from '@/pages/NotFound.vue';
import Tmp from '@/pages/Tmp.vue';
import About from '@/pages/About.vue';
import Index from '@/pages/IndexPage/Index.vue';
import AppListPage from '@/pages/AppPage/AppListPage.vue';
import JobListPage from '@/pages/JobPage/JobListPage.vue';
import JobTaskListPage from '@/pages/JobPage/JobTaskListPage.vue';
import JobTaskLatestHistoryPage from '@/pages/JobPage/JobTaskLatestHistoryPage.vue';
import { AppsSharp, List, HomeSharp } from '@vicons/ionicons5';
import { getMessage as t } from '@/i18n';

export const routes = [
  {
    path: '/',
    redirect: '/manage/index'
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
        path: '/manage/index',
        name: 'manage index',
        meta: { title: t('menu.index') },
        component: Index
      },
      {
        path: '/manage/app',
        name: 'manage app',
        meta: { title: t('menu.app_list') },
        component: AppListPage
      },
      {
        path: '/manage/job',
        name: 'manage job',
        meta: { title: t('menu.job_list') },
        component: JobListPage
      },
      {
        path: '/manage/job/task',
        name: 'manage job task',
        meta: { title: t('menu.job_task_list') },
        component: JobTaskListPage
      },
      {
        path: '/manage/task/latest',
        name: 'manage task latest',
        meta: { title: t('menu.task_latest_list') },
        component: JobTaskLatestHistoryPage
      },
      {
        path: '/manage/about',
        name: 'manage about',
        meta: { title: t('menu.about') },
        component: About
      },
      {
        path: '/manage/appmonitor',
        name: 'monitor',
        meta: { title: t('menu.system_monitor') },
        component: () => import('@/pages/AppMonitor.vue')
      }
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
    name: t('menu.index'),
    icon: markRaw(HomeSharp),
    path: '/manage/index'
  },
  {
    name: t('menu.app_management'),
    icon: markRaw(AppsSharp),
    path: '/manage/app'
  },
  {
    name: t('menu.job_management'),
    icon: markRaw(List),
    children: [
      {
        name: t('menu.job_list'),
        path: '/manage/job'
      },
      {
        name: t('menu.task_latest_list'),
        path: '/manage/task/latest'
      }
    ]
  },
  {
    name: t('menu.system_management'),
    icon: markRaw(AppsSharp),
    children: [
      {
        name: t('menu.system_monitor'),
        path: '/manage/appmonitor'
      },
      {
        name: t('menu.about'),
        path: '/manage/about'
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
