<template>
  <div class="wrap">
    <div class="header">
      <div class="title">
        <span> {{ t('menu.job_list') }} </span>
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
              <n-form-item
                class="app-name"
                :label="t('job.appName')"
                path="param.appName"
              >
                <n-select
                  class="app-name"
                  v-model:value="param.appName"
                  :options="appList"
                />
              </n-form-item>
              <n-form-item :label="t('job.key')" path="param.key">
                <n-input
                  v-model:value="param.key"
                  :placeholder="t('job.key')"
                  clearable
                  @keydown.enter.prevent
                  @keyup.enter="queryList"
                />
              </n-form-item>
              <div class="paramWrap">
                <n-form-item
                  :label="t('job.description')"
                  path="param.description"
                >
                  <n-input
                    v-model:value="param.description"
                    :placeholder="t('job.description')"
                    clearable
                    @keydown.enter.prevent
                    @keyup.enter="queryList"
                  />
                </n-form-item>
              </div>
              <div class="paramWrap">
                <n-form-item
                  :label="t('job.handleName')"
                  path="param.handleName"
                >
                  <n-input
                    v-model:value="param.handleName"
                    :placeholder="t('job.handleName')"
                    clearable
                    @keydown.enter.prevent
                    @keyup.enter="queryList"
                  />
                </n-form-item>
              </div>
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
    <SubContentFullPage
      v-show="useForm"
      :title="detailTitle"
      :submitDisabled="submitDisabled"
      @close="closeForm"
      @submit="submitForm"
    >
      <JobDetail ref="jobDetailRef" :model="modelRef" :appList="appList" />
    </SubContentFullPage>
    <n-modal
      v-model:show="showTriggerModal"
      preset="dialog"
      :title="t('job.manualTrigger')"
      content=""
      :positive-text="t('common.confirm')"
      :negative-text="t('common.return')"
      @positive-click="submitTrigger"
      @negative-click="cancelTrigger"
    >
      <div class="trigger-modal-content">
        <div class="trigger-task-summary">
          <div>
            <strong>{{ t('job.id') }}:</strong> {{ triggerValue.jobId }}
          </div>
          <div>
            <strong>{{ t('job.description') }}:</strong>
            {{ triggerValue.description || triggerValue.handleName }}
          </div>
          <div>
            <strong>{{ t('job.appName') }}:</strong> {{ triggerValue.appName }}
            <span class="trigger-namespace">
              ({{ t('namespace.namespace') }}: {{ triggerValue.namespace }})
            </span>
          </div>
          <div>
            <strong>{{ t('job.handleName') }}:</strong>
            {{ triggerValue.handleName }}
          </div>
        </div>
        <n-form-item :label="t('job.select_executor')">
          <n-select
            v-model:value="triggerValue.instanceAddr"
            :options="triggerInstanceAddrs"
          />
        </n-form-item>
        <n-form-item :label="t('job.manualTriggerParam')">
          <div class="trigger-param-field">
            <n-input
              v-model:value="triggerValue.triggerParam"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 8 }"
              :placeholder="t('job.triggerParam')"
            />
            <div class="trigger-param-hint">
              {{ t('job.manualTriggerParamHint') }}
            </div>
          </div>
        </n-form-item>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { createColumns } from '@/pages/JobPage/JobColumns.jsx';
import { useWebResources } from '@/data/resources';
import { namespaceStore } from '@/data/namespace';
import { jobApi } from '@/api/job';
import { appApi } from '@/api/app';
import SubContentFullPage from '@/components/common/SubContentFullPage';
import {
  handleApiResult,
  printApiSuccess,
  printApiError
} from '@/utils/request';
import JobDetail from '@/pages/JobPage/JobDetail.vue';
import * as constant from '@/types/constant';
import { ScheduleTypeOptions } from '@/pages/JobPage/SeleteType.js';

const { t } = useI18n();
const webResources = useWebResources();

const param = ref({
  description: '',
  handleName: '',
  appName: '',
  key: ''
});

const defaultModel = {
  id: 0,
  appName: '',
  enable: true,
  namespace: '',
  key: '',
  description: '',
  scheduleType: '',
  cronValue: '',
  delaySecond: 0,
  intervalSecond: 0,
  runMode: '',
  handleName: '',
  triggerParam: '',
  glueSource: '',
  routerStrategy: '',
  pastDueStrategy: '',
  blockingStrategy: '',
  timeoutSecond: 0,
  tryTimes: 0,
  retryInterval: 0,
  mode: constant.FORM_MODE_CREATE
};

const loadingRef = ref(false);
const useForm = ref(false);

const modelRef = ref({ ...defaultModel });

const dataRef = ref([]);

const triggerInstanceAddrs = ref([]);
const triggerValue = ref({
  jobId: 0,
  description: '',
  appName: '',
  namespace: '',
  handleName: '',
  instanceAddr: '',
  triggerParam: ''
});
const showTriggerModal = ref(false);

const defaultApp = {
  value: '',
  label: ''
};

const appList = ref([defaultApp]);

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
  return rowData.id;
};

const queryPage = function (pageNo) {
  return jobApi.getJobList({
    namespace: namespaceStore.current.value.namespaceId,
    appName: param.value.appName,
    likeDescription: param.value.description,
    likeHandleName: param.value.handleName,
    likeKey: param.value.key,
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

const isGlueRunMode = function (runMode) {
  return String(runMode || '').startsWith('GLUE_');
};

// Legacy GLUE without glueSource still keeps the script in triggerParam.
// Manual trigger must not send that value as executorParams.
const resolveManualTriggerParam = function (row) {
  if (isGlueRunMode(row.runMode) && !String(row.glueSource ?? '').trim()) {
    return '';
  }
  return row.triggerParam ?? '';
};

// Old GLUE tasks stored script in triggerParam; migrate into glueSource in the form only.
const applyGlueSourceMigration = function (model) {
  if (!isGlueRunMode(model.runMode)) {
    return model;
  }
  const glueSource = model.glueSource ?? '';
  const triggerParam = model.triggerParam ?? '';
  if (!String(glueSource).trim() && String(triggerParam).trim()) {
    return {
      ...model,
      glueSource: triggerParam,
      triggerParam: ''
    };
  }
  return model;
};

const showUpdate = function (row) {
  modelRef.value = applyGlueSourceMigration({
    mode: constant.FORM_MODE_UPDATE,
    ...row,
    glueSource: row.glueSource ?? '',
    triggerParam: row.triggerParam ?? ''
  });
  useForm.value = true;
};

const showClone = function (row) {
  let description = row.description || '';
  description += '_clone';
  modelRef.value = applyGlueSourceMigration({
    mode: constant.FORM_MODE_CREATE,
    ...row,
    id: 0,
    description: description,
    glueSource: row.glueSource ?? '',
    triggerParam: row.triggerParam ?? ''
  });
  useForm.value = true;
};

const remove = function (row) {
  jobApi
    .removeJob({
      id: row.id
    })
    .then(handleApiResult)
    .then(printApiSuccess)
    .then(() => {
      queryList();
    })
    .catch(printApiError);
};

const showTrigger = function (row) {
  appApi
    .getAppInfo({
      namespace: row.namespace,
      appName: row.appName
    })
    .then(handleApiResult)
    .then((obj) => {
      let instanceAddrs = obj.instanceAddrs;
      let items = [
        {
          value: '',
          label: 'Auto'
        }
      ];
      for (const item of instanceAddrs) {
        items.push({
          value: item,
          label: item
        });
      }
      return items;
    })
    .then((items) => {
      triggerValue.value = {
        jobId: row.id,
        description: row.description || '',
        appName: row.appName || '',
        namespace: row.namespace || '',
        handleName: row.handleName || '',
        instanceAddr: '',
        triggerParam: resolveManualTriggerParam(row)
      };
      triggerInstanceAddrs.value = items;
      showTriggerModal.value = true;
    })
    .catch(printApiError);
};

const submitTrigger = function () {
  jobApi
    .triggerJob({
      jobId: triggerValue.value.jobId,
      instanceAddr: triggerValue.value.instanceAddr,
      triggerParam: triggerValue.value.triggerParam ?? ''
    })
    .then(handleApiResult)
    .then(() => {
      showTriggerModal.value = false;
    })
    .then(printApiSuccess)
    .catch(printApiError);
};

const cancelTrigger = function () {
  showTriggerModal.value = false;
};

const trigger = function (row) {
  jobApi
    .triggerJob({
      jobId: row.id,
      triggerParam: resolveManualTriggerParam(row)
    })
    .then(handleApiResult)
    .then(printApiSuccess)
    .catch(printApiError);
};

const showDetail = function (row) {
  modelRef.value = applyGlueSourceMigration({
    mode: constant.FORM_MODE_DETAIL,
    ...row,
    glueSource: row.glueSource ?? '',
    triggerParam: row.triggerParam ?? ''
  });
  useForm.value = true;
};

const jobDetailRef = ref(null);

const submitDisabled = computed(function () {
  if (modelRef.value.mode === constant.FORM_MODE_DETAIL) {
    return false;
  }
  if (
    isGlueRunMode(modelRef.value.runMode) &&
    !String(modelRef.value.glueSource || '').trim()
  ) {
    return true;
  }
  return false;
});

const detailTitle = computed(function () {
  if (modelRef.value.mode === constant.FORM_MODE_UPDATE) {
    return t('job._name') + t('common.join') + t('common.edit');
  } else if (modelRef.value.mode === constant.FORM_MODE_CREATE) {
    return t('job._name') + t('common.join') + t('common.create');
  }
  return t('job._name') + t('common.join') + t('common.detail');
});

const closeForm = function () {
  useForm.value = false;
};

const submitForm = function () {
  if (modelRef.value.mode === constant.FORM_MODE_DETAIL) {
    useForm.value = false;
    return;
  }

  const doSubmit = function () {
    if (
      isGlueRunMode(modelRef.value.runMode) &&
      !String(modelRef.value.glueSource || '').trim()
    ) {
      if (window.$message) {
        window.$message.error(t('job.glueSourceRequired'));
      }
      return;
    }

    let param = {
      id: modelRef.value.id,
      namespace:
        modelRef.value.namespace || namespaceStore.current.value.namespaceId,
      enable: modelRef.value.enable,
      appName: modelRef.value.appName,
      key: modelRef.value.key,
      description: modelRef.value.description,
      scheduleType: modelRef.value.scheduleType,
      cronValue: modelRef.value.cronValue,
      delaySecond: modelRef.value.delaySecond,
      intervalSecond: modelRef.value.intervalSecond,
      runMode: modelRef.value.runMode,
      handleName: modelRef.value.handleName,
      triggerParam: modelRef.value.triggerParam ?? '',
      glueSource: modelRef.value.glueSource ?? '',
      routerStrategy: modelRef.value.routerStrategy,
      pastDueStrategy: modelRef.value.pastDueStrategy,
      blockingStrategy: modelRef.value.blockingStrategy,
      timeoutSecond: modelRef.value.timeoutSecond,
      tryTimes: modelRef.value.tryTimes,
      retryInterval: modelRef.value.retryInterval
    };
    let api =
      modelRef.value.mode === constant.FORM_MODE_CREATE
        ? jobApi.createJob
        : jobApi.updateJob;
    api(param)
      .then(handleApiResult)
      .then(printApiSuccess)
      .then(() => {
        useForm.value = false;
        queryList();
      })
      .catch(printApiError);
  };

  const validatePromise = jobDetailRef.value?.validate?.();
  if (validatePromise && typeof validatePromise.then === 'function') {
    validatePromise.then(doSubmit).catch(() => {});
  } else {
    doSubmit();
  }
};

const initAppList = function () {
  appApi
    .getAppList({
      namespace: namespaceStore.current.value.namespaceId
    })
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

const columns = createColumns({
  showUpdate,
  showClone,
  showDetail,
  remove,
  trigger,
  showTrigger,
  webResources
});

onMounted(() => {
  namespaceStore.initLoad();
  setTimeout(() => initAppList(), 100);
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

.app-name {
  width: 260px;
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

.trigger-task-summary {
  margin-bottom: 16px;
  line-height: 1.8;
}

.trigger-namespace {
  margin-left: 8px;
}

.trigger-param-field {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.trigger-param-hint {
  color: #888;
  font-size: 12px;
  margin-top: 4px;
}
</style>
