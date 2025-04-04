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
              <n-form-item :label="t('job.id')" path="param.id">
                <n-input
                  :disabled="true"
                  v-model:value="param.jobId"
                  :placeholder="t('job.id')"
                  clearable
                  @keydown.enter.prevent
                  @keyup.enter="queryList"
                />
              </n-form-item>
            </div>
          </n-form>
          <div class="queryButton">
            <span class="query-button-item">
              <n-button type="info" @click="routerBack">{{
                t('common.back')
              }}</n-button>
            </span>
            <span class="query-button-item">
              <n-button tertiary @click="queryList">{{
                t('common.query')
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
//import { createJobTaskColumns } from '@/pages/JobPage/JobTaskColumns.jsx';
import { createJobTaskColumns } from '@/pages/JobPage/JobColumns.jsx';
import { namespaceStore } from '@/data/namespace';
import { useRoute, useRouter } from 'vue-router';
import { jobApi } from '@/api/job';
import {
  handleApiResult,
  printApiSuccess,
  printApiError
} from '@/utils/request';

const { t } = useI18n();

let route = useRoute();
let router = useRouter();

const param = ref({
  jobId: route.query.jobId || '0'
});

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
  return jobApi.getJobTaskList({
    jobId: param.value.jobId,
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

const routerBack = function () {
  router.go(-1);
};

const columns = createJobTaskColumns({});

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
