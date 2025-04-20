import { ISize, WebResource } from '@/types/base';
import { sideAllMenu } from '@/route/routes';
import { defineStore } from 'pinia';

function sideMenu(resource: Set<string>, isOldConsole: boolean) {
  var items = [];
  for (var item of sideAllMenu) {
    var subItems = [];
    for (var subItem of item.children || []) {
      if (resource.has(subItem.path)) {
        subItems.push(subItem);
      } else if (isOldConsole && subItem.path != '/manage/user') {
        subItems.push(subItem);
      }
    }
    let newItem = { ...item };
    if (subItems.length == 0) {
      if (!item.path) {
        continue;
      }
    }
    newItem.children = subItems;
    items.push(newItem);
  }
  return items;
}

export const useWebResources = defineStore('webResources', {
  state: () => ({
    resource: new Set(),
    isOldConsole: true,
    fromRequest: false,
    username: '',
    version: 'x',
    canUpdateNamespace: true,
    canUpdateApp: true,
    canUpdateJob: true,
    canUpdateUser: true,
    sideMenu: sideMenu(new Set(), true)
  }),
  getters: {},
  actions: {
    update(webResource: WebResource) {
      let resource = new Set(webResource.resources);
      this.resource = resource;
      this.isOldConsole = webResource.from === 'OLD_CONSOLE';
      this.fromRequest = true;
      this.canUpdateNamespace = this.resource.has('NAMESPACE_UPDATE');
      this.canUpdateApp = this.resource.has('APP_UPDATE');
      this.canUpdateJob = this.resource.has('JOB_UPDATE');
      this.canUpdateUser = this.resource.has('USER_UPDATE');
      this.version = 'v' + webResource.version;
      this.username = webResource.username || '';
      this.sideMenu = sideMenu(resource, this.isOldConsole);
      return this.sideMenu;
    },
    clear() {
      this.resource = new Set();
      this.isOldConsole = true;
      this.fromRequest = false;
      this.canUpdateNamespace = true;
      this.canUpdateApp = true;
      this.canUpdateJob = true;
      this.canUpdateUser = true;
      this.username = '';
      this.version = 'x';
    }
  }
});
