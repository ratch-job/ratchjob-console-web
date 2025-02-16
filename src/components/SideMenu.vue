<template>
  <ul class="wrap">
    <template v-for="(item, index) in webResources.sideMenu" :key="index">
      <template v-if="item.children">
        <li
          v-if="item.active"
          :class="{ select: this.path === item.path }"
          class="group-item"
        >
          <router-link class="link" :to="{ path: item.path }">
            <span class="icon">
              <n-icon size="16" color="#2f6cf7" :component="item.icon" />
            </span>
            <span>{{ item.name }}</span>
          </router-link>
        </li>
        <li v-if="!item.active" class="group-item">
          <div class="parent_item">
            <span class="icon">
              <n-icon size="16" color="#2f6cf7" :component="item.icon" />
            </span>
            <span>{{ item.name }}</span>
          </div>
        </li>
        <li
          class="item"
          :class="{ select: this.path === subitem.path }"
          v-for="(subitem, subindex) in item.children || []"
          :key="index + subindex"
        >
          <router-link class="link" :to="{ path: subitem.path }">
            {{ subitem.name }}
          </router-link>
        </li>
      </template>

      <li
        v-else
        class="group-item"
        :class="{ select: this.path === item.path }"
      >
        <router-link class="link" :to="{ path: item.path }">
          {{ item.name }}
        </router-link>
      </li>
    </template>
  </ul>
</template>

<script>
//import {manageMenu} from '@/route/routes.js'
import { useWebResources } from '@/data/resources';
import { ServerOutline, CubeOutline, AppsSharp } from '@vicons/ionicons5';
import { userApi } from '@/api/user';
import { handleApiResult } from '@/utils/request';

export default {
  components: {
    ServerOutline,
    CubeOutline,
    AppsSharp
  },
  setup() {
    const webResources = useWebResources();
    let updateWebResources = function () {
      if (!this.webResources.fromRequest) {
        userApi
          .getUserWebResources()
          .then(handleApiResult)
          .then((data) => {
            this.webResources.update(data);
          });
      }
    };
    let pathRef = ref('/');
    let changeRoute = function (route) {
      pathRef.value = route.path;
    };
    return {
      path: pathRef,
      name: 'side nemu',
      webResources,
      changeRoute,
      updateWebResources
    };
  },
  mounted() {},
  watch: {
    $route(newRoute, old) {
      this.changeRoute(newRoute);
    }
  },
  created() {
    this.updateWebResources();
    this.changeRoute(this.$route);
  }
};
</script>

<style scoped>
.wrap {
  background: #ffffff;
  padding: 15px 8px;
}

.group-item {
  padding-left: 10px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  height: 36px;
  line-height: 36px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 2px;
  /*
        border-width: 0 0 1px 0;
        cursor: pointer;
        */
}

.group-item .icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  padding-right: 10px;
}

.item {
  padding-left: 32px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  height: 36px;
  line-height: 36px;
  text-align: left;
  /*
        border-width: 0 0 1px 0;;
        border: 1px solid #324155;
        border-width: 0 0 1px 0;;
        */
}

.item:hover,
.group-item:hover {
  background: #f4f5f8;
}

.select {
  color: #2f6cf7;
  background: #ecf3ff;
}

.select .link {
  color: #2f6cf7;
}

.parent_item,
.link {
  /*
  display: block;
   */
  width: 100%;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #595959;
}
</style>
