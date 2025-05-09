<template>
  <div class="wrap">
    <div class="header">
      <div class="title">
        <span> {{ t('menu.app_list') }} </span>
      </div>
      <div class="namespace">
        <NamespacePopSelect @change="queryList" />
      </div>
    </div>
    <div class="content-wrap">
      <div class="form-container">
        <div class="query-params">
          <n-form label-placement="left" label-width="auto">
            <div class="paramWrap">
              <n-form-item :label="t('app.name')" path="param.appName">
                <n-input
                  v-model:value="param.appName"
                  :placeholder="t('app.searchName')"
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
            <span v-if="webResources.canUpdateApp" class="query-button-item">
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
          :data="dataRef"
          :loading="loadingRef"
          :pagination="pagination"
          :row-key="rowKey"
          @update:page="doHandlePageChange"
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
        <AppDetail :model="modelRef" />
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
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { createColumns } from '@/pages/AppPage/AppColumns.jsx';
import { useWebResources } from '@/data/resources';
import { namespaceStore } from '@/data/namespace';
import { appApi } from '@/api/app';
import {
  handleApiResult,
  printApiSuccess,
  printApiError
} from '@/utils/request';
import AppDetail from '@/pages/AppPage/AppDetail.vue';
import * as constant from '@/types/constant';

const { t } = useI18n();
const webResources = useWebResources();

const param = ref({
  appName: ''
});

const defaultModel = {
  appName: '',
  label: '',
  instanceAddrs: [],
  instanceCount: 0,
  registerType: 'AUTO',
  mode: constant.FORM_MODE_CREATE
};

const loadingRef = ref(false);
const useForm = ref(false);

const modelRef = ref({ ...defaultModel });

const dataRef = ref([]);

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
    queryPage(1);
  },
  prefix({ itemCount }) {
    return t('common.total') + `: ${itemCount}`;
  }
});

const rowKey = function (rowData) {
  return rowData.name;
};

const queryPage = function (pageNo) {
  return appApi.getAppList({
    namespace: namespaceStore.current.value.namespaceId,
    likeAppName: param.value.appName,
    pageNo: pageNo,
    pageSize: pagination.pageSize
  });
};

const doHandlePageChange = function (currentPage) {
  pagination.page = currentPage;
  if (!loadingRef.value) {
    queryPage(currentPage)
      .then(handleApiResult)
      .then((page) => {
        loadingRef.value = false;
        let count = page.totalCount;
        let pageSize = pagination.pageSize;
        dataRef.value = page.list;
        pagination.itemCount = count;
        pagination.pageCount = Math.round((count + pageSize - 1) / pageSize);
      })
      .catch((err) => {
        printApiError(err);
        dataRef.value = [];
        loadingRef.value = false;
      });
  }
};

const queryList = function () {
  doHandlePageChange(1);
};

const showCreate = function () {
  modelRef.value = {
    mode: constant.FORM_MODE_CREATE,
    ...defaultModel
  };
  useForm.value = true;
};

const showUpdate = function (row) {
  appApi
    .getAppInfo({
      namespace: row.namespaceId,
      appName: row.appName
    })
    .then(handleApiResult)
    .then((obj) => {
      modelRef.value = {
        mode: constant.FORM_MODE_UPDATE,
        ...obj
      };
      useForm.value = true;
    })
    .catch(printApiError);
};

const remove = function (row) {
  appApi
    .removeApp({
      namespace: row.namespaceId,
      appName: row.appName
    })
    .then(handleApiResult)
    .then(printApiSuccess)
    .then(() => {
      queryList();
    })
    .catch(printApiError);
};
const showDetail = function (row) {
  appApi
    .getAppInfo({
      namespace: row.namespaceId,
      appName: row.appName
    })
    .then(handleApiResult)
    .then((obj) => {
      modelRef.value = {
        mode: constant.FORM_MODE_DETAIL,
        ...obj
      };
      useForm.value = true;
    })
    .catch(printApiError);
};

const closeForm = function () {
  useForm.value = false;
};

const submitForm = function () {
  if (modelRef.value.mode === constant.FORM_MODE_DETAIL) {
    useForm.value = false;
    return;
  }
  let instanceAddrs = null;
  if (modelRef.value.registerType === 'MANUAL') {
    instanceAddrs = modelRef.value.instanceAddrs;
  }
  let param = {
    namespace:
      modelRef.value.namespace || namespaceStore.current.value.namespaceId,
    appName: modelRef.value.appName,
    label: modelRef.value.label,
    registerType: modelRef.value.registerType,
    instanceAddrs: instanceAddrs
  };
  appApi
    .updateApp(param)
    .then(handleApiResult)
    .then(printApiSuccess)
    .then(() => {
      useForm.value = false;
      queryList();
    })
    .catch(printApiError);
};

const columns = createColumns({ showUpdate, remove, showDetail, webResources });

onMounted(() => {
  namespaceStore.initLoad();
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
  line-height: 40px;
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
