<template>
  <div class="wrap">
    <div class="header">
      <div class="title">
        <span> {{ t('menu.job_task_list') }} </span>
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
              <n-form-item
                class="trigger-time-range"
                :label="t('task.triggerTimeRange')"
                path="param.triggerTimeRange"
              >
                <n-date-picker
                  v-model:value="param.triggerTimeRange"
                  type="datetimerange"
                  clearable
                />
              </n-form-item>
              <n-form-item
                class="task-status"
                :label="t('task.status')"
                path="param.status"
              >
                <n-select
                  v-model:value="param.status"
                  :options="taskStatusOptions"
                  :placeholder="t('common.all')"
                  clearable
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
              <n-button tertiary @click="resetQuery">{{
                t('common.reset')
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
      <n-drawer-content :title="jobDetailTitle" closable>
        <JobDetail :model="modelRef" :appList="[]" />
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
import { useI18n } from 'vue-i18n';
//import { createJobTaskColumns } from '@/pages/JobPage/JobTaskColumns.jsx';
import { createJobTaskColumns } from '@/pages/JobPage/JobColumns.jsx';
import { namespaceStore } from '@/data/namespace';
import { jobApi } from '@/api/job';
import { appApi } from '@/api/app';
import { handleApiResult, printApiError } from '@/utils/request';
import JobDetail from '@/pages/JobPage/JobDetail.vue';
import * as constant from '@/types/constant';

const { t } = useI18n();

const param = ref({
  appName: '',
  triggerTimeRange: null,
  status: null
});

const taskStatusOptions = computed(() => [
  {
    value: 'RUNNING',
    label: t('task.statusRunning')
  },
  {
    value: 'SUCCESS',
    label: t('task.statusSuccess')
  },
  {
    value: 'FAIL',
    label: t('task.statusFail')
  }
]);

const defaultApp = {
  value: '',
  label: ''
};

const appList = ref([defaultApp]);

const defaultModel = {
  id: 0,
  appName: '',
  enable: true,
  namespace: '',
  description: '',
  scheduleType: '',
  cronValue: '',
  delaySecond: 0,
  intervalSecond: 0,
  runMode: '',
  handleName: '',
  triggerParam: '',
  routerStrategy: '',
  pastDueStrategy: '',
  blockingStrategy: '',
  timeoutSecond: 0,
  tryTimes: 0,
  mode: constant.FORM_MODE_DETAIL
};

const modelRef = ref({ ...defaultModel });

const useForm = ref(false);

const loadingRef = ref(false);

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
  return rowData.taskId;
};

const queryPage = function (pageNo) {
  const triggerTimeRange = param.value.triggerTimeRange;
  return jobApi.getJobTaskHistoryList({
    namespace: namespaceStore.current.value.namespaceId,
    appName: param.value.appName,
    startTriggerTime: triggerTimeRange
      ? Math.floor(triggerTimeRange[0] / 1000)
      : undefined,
    endTriggerTime: triggerTimeRange
      ? Math.floor(triggerTimeRange[1] / 1000)
      : undefined,
    status: param.value.status || undefined,
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

const resetQuery = function () {
  param.value = {
    appName: '',
    triggerTimeRange: null,
    status: null
  };
  queryList();
};

const jobDetailTitle = computed(function () {
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
  useForm.value = false;
};

const showJobDetail = function (jobId) {
  jobApi
    .getJobInfo({
      id: jobId
    })
    .then(handleApiResult)
    .then((row) => {
      if (row == null) {
        printApiError({ message: '找不到任务' });
        return;
      }
      modelRef.value = {
        mode: constant.FORM_MODE_DETAIL,
        ...row
      };
      useForm.value = true;
    })
    .catch(printApiError);
};

const columns = createJobTaskColumns({ showJobDetail });

const initAppList = function () {
  appApi
    .getAppList({
      namespace: namespaceStore.current.value.namespaceId
    })
    .then(handleApiResult)
    .then((page) => {
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
  line-height: 40px;
  padding-left: 15px;
}

.header-button {
  flex: 0 0 auto;
}

.app-name {
  width: 260px;
}

.trigger-time-range {
  width: 500px;
}

.task-status {
  width: 220px;
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
  margin-bottom: 10px;
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
