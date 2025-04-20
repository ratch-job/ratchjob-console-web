<template>
  <div class="wrap">
    <div class="header">
      <div class="title">
        <span>{{ t('user.list') }}</span>
      </div>
    </div>
    <div class="content-wrap">
      <div class="form-container">
        <div class="query-params">
          <n-form label-placement="left" label-width="auto">
            <div class="paramWrap">
              <n-form-item :label="t('user.username')" path="param.username">
                <n-input
                  v-model:value="param.username"
                  :placeholder="t('common.preInput') + t('user.username')"
                  clearable
                  @keydown.enter.prevent
                  @keyup.enter="queryList"
                />
              </n-form-item>
            </div>
          </n-form>
          <div class="queryButton">
            <span class="query-button-item">
              <n-button tertiary @click="queryList">{{
                t('common.query')
              }}</n-button>
            </span>
            <span class="query-button-item">
              <n-button type="info" @click="showCreate">{{
                t('common.add')
              }}</n-button>
            </span>
          </div>
        </div>
        <n-data-table
          remote
          ref="table"
          :scroll-x="600"
          :bordered="false"
          :columns="columns"
          :data="data"
          :loading="loading"
          :pagination="pagination"
          :row-key="rowKey"
          @update:page="handlePageChange"
        />
      </div>
    </div>
    <n-drawer
      to="#main_content"
      :block-scroll="false"
      :trap-focus="false"
      v-model:show="useForm"
      default-width="600"
      resizable
    >
      <n-drawer-content :title="getDetailTitle" closable>
        <UserDetail
          :model="model"
          :namespaceOptions="namespaceOptions"
          :appList="appList"
        />
        <template #footer>
          <n-space align="baseline">
            <n-button text @click="closeForm">{{
              t('common.return')
            }}</n-button>
            <n-button type="primary" @click="submitForm">{{
              t('common.confirm')
            }}</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { userApi } from '@/api/user';
import * as constant from '@/types/constant';
import { NButton } from 'naive-ui';
import { createColumns, defaultPrivilege } from '@/pages/User/UserColumns';
import UserDetail from '@/pages/User/UserDetail.vue';
import { roleOptions } from '@/data/role';
import { useI18n } from 'vue-i18n';
import { namespaceStore } from '@/data/namespace';
import {
  handleApiResult,
  printApiError,
  printApiSuccess
} from '@/utils/request';
import { appApi } from '@/api/app';

const { t } = useI18n();
const data = ref([]);
const loading = ref(false);
const param = ref({
  username: '',
  pageNo: 1,
  pageSize: 20
});
const pagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    handlePageChange(1);
  },
  prefix({ itemCount }) {
    return t('common.total') + `: ${itemCount}`;
  }
});
const useForm = ref(false);
const model = ref({
  mode: '',
  username: '',
  nickname: '',
  password: null,
  gmtCreate: null,
  gmtModified: null,
  enable: true,
  roles: [],
  namespacePrivilege: { ...defaultPrivilege },
  appPrivilege: { ...defaultPrivilege },
  roleOptions
});
const defaultApp = {
  value: '',
  label: ''
};
const appList = ref([defaultApp]);

const initAppList = function () {
  appApi
    .getAppList({})
    .then(handleApiResult)
    .then((page) => {
      //console.log('initAppList result', page);
      let options = [];
      for (var item of page.list) {
        options.push({
          value: item.appName,
          label: item.label || item.appName
        });
      }
      if (options.length == 0) {
        options.push(defaultApp);
      }
      appList.value = options;
    })
    .catch(printApiError);
};

const showUpdate = (row) => {
  model.value = {
    mode: constant.FORM_MODE_UPDATE,
    username: row.username,
    nickname: row.nickname,
    password: null,
    enable: row.enable,
    roles: row.roles,
    appPrivilege: row.appPrivilege || {
      ...defaultPrivilege
    },
    namespacePrivilege: row.namespacePrivilege || {
      ...defaultPrivilege
    },
    roleOptions
  };
  useForm.value = true;
};

const showDetail = (row) => {
  model.value = {
    mode: constant.FORM_MODE_DETAIL,
    username: row.username,
    nickname: row.nickname,
    password: null,
    enable: row.enable,
    roles: row.roles,
    namespacePrivilege: row.namespacePrivilege || {
      ...defaultPrivilege
    },
    appPrivilege: row.appPrivilege || {
      ...defaultPrivilege
    },
    roleOptions
  };
  useForm.value = true;
};

const removeItem = (row) => {
  userApi
    .removeUser({ username: row.username })
    .then(handleApiResult)
    .then(printApiSuccess)
    .then(() => {
      useForm.value = false;
      handlePageChange(1);
    })
    .catch(printApiError);
};

const showCreate = () => {
  model.value = {
    mode: constant.FORM_MODE_CREATE,
    username: '',
    nickname: '',
    password: null,
    gmtCreate: null,
    gmtModified: null,
    enable: true,
    roles: [],
    namespacePrivilege: { ...defaultPrivilege },
    appPrivilege: { ...defaultPrivilege },
    roleOptions
  };
  useForm.value = true;
};

const doQueryList = () => {
  return userApi.getUserList({
    likeUsername: param.value.username,
    pageNo: pagination.page,
    pageSize: pagination.pageSize
  });
};

const handlePageChange = (currentPage) => {
  pagination.page = currentPage;
  if (!loading.value) {
    loading.value = true;
    doQueryList()
      .then(handleApiResult)
      .then((page) => {
        loading.value = false;
        let count = page.totalCount;
        let pageSize = pagination.pageSize;
        data.value = page.list;
        pagination.itemCount = count;
        pagination.pageCount = Math.round((count + pageSize - 1) / pageSize);
      })
      .catch((err) => {
        printApiError(err);
        data.value = [];
        loading.value = false;
      });
  }
};

let columns = createColumns(showDetail, showUpdate, removeItem);

const queryList = () => {
  handlePageChange(1);
};

const rowKey = (row) => {
  return row.username;
};

const closeForm = () => {
  useForm.value = false;
};

const submitForm = () => {
  let mode = model.value.mode;
  if (mode === constant.FORM_MODE_DETAIL) {
    useForm.value = false;
    return;
  }
  let userinfo = {
    username: model.value.username,
    nickname: model.value.nickname,
    password: model.value.password,
    enable: model.value.enable,
    namespacePrivilegeParam: model.value.namespacePrivilege,
    appPrivilegeParam: model.value.appPrivilege,
    roles: model.value.roles.join(',')
  };
  if (mode === constant.FORM_MODE_CREATE) {
    userApi
      .addUser(userinfo)
      .then(handleApiResult)
      .then(printApiSuccess)
      .then(() => {
        useForm.value = false;
        handlePageChange(1);
      })
      .catch(printApiError);
  } else {
    userApi
      .updateUser(userinfo)
      .then(handleApiResult)
      .then(printApiSuccess)
      .then(() => {
        useForm.value = false;
        handlePageChange(1);
      })
      .catch(printApiError);
  }
};

const getDetailTitle = computed(() => {
  if (model.value.mode === constant.FORM_MODE_UPDATE) {
    return t('common.edit') + t('user.name');
  } else if (model.value.mode === constant.FORM_MODE_CREATE) {
    return t('common.add') + t('user.name');
  }
  return t('user.name');
});

const namespaceOptions = namespaceStore.optionList;

onMounted(() => {
  namespaceStore.initLoad();
  initAppList();
  queryList();
});
</script>

<style scoped>
.wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #efefef;
}

.content-wrap {
  padding: 10px 10px 10px 10px;
  background: #efefef;
}

.form-container {
  display: flex;
  flex-direction: column;
  position: relative;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px 8px;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  border-bottom: #ccc 1px solid;
  background: #fff;
  padding-right: 3px;
}

.title {
  flex: 1 1 auto;
  font: 14/1.25;
  line-height: 30px;
  padding-left: 15px;
}

.header-button {
  flex: 0 0 auto;
}

.namespace {
  flex: 0 0 auto;
}

.query-params {
  flex: 0 0 auto;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-direction: row;
}

.paramWrap {
  display: flex;
  gap: 8px;
  flex-direction: row;
  flex-wrap: wrap;
}

.queryButton {
  display: flex;
  align-items: center;
}

.query-button-item {
  margin-left: 10px;
}
</style>
