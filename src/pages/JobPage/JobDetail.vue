<template>
  <div class="detailWrap">
    <n-form ref="formRef" :model="model" :rules="rules">
      <!--<n-divider title-placement="left">基础配置</n-divider>-->
      <n-grid :cols="2" :x-gap="12">
        <n-gi>
          <n-form-item path="appName" :label="t('job.appName')">
            <n-select
              :disabled="isKeyReadonly"
              class="app-name"
              v-model:value="model.appName"
              :options="appList"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="description" :label="t('job.description')">
            <n-input
              :disabled="isReadonly"
              :placeholder="t('job.description')"
              v-model:value="model.description"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
      </n-grid>
      <!--      <n-divider title-placement="left">调度配置</n-divider>-->
      <n-grid :cols="2" :x-gap="12">
        <n-gi>
          <n-form-item path="scheduleType" :label="t('job.scheduleType')">
            <n-select
              :disabled="isReadonly"
              v-model:value="model.scheduleType"
              :options="ScheduleTypeOptions"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item
            v-if="isCron"
            path="cronValue"
            :label="t('job.cronValue')"
          >
            <n-input
              :disabled="isReadonly"
              :placeholder="t('job.cronValue')"
              v-model:value="model.cronValue"
              @keydown.enter.prevent
            />
          </n-form-item>
          <n-form-item
            v-if="isDelay"
            path="delaySecond"
            :label="t('job.delaySecond')"
          >
            <n-input-number
              :disabled="isReadonly"
              :placeholder="t('job.delaySecond')"
              v-model:value="model.delaySecond"
              @keydown.enter.prevent
            />
          </n-form-item>
          <n-form-item
            v-if="isInterval"
            path="intervalSecond"
            :label="t('job.intervalSecond')"
          >
            <n-input-number
              :disabled="isReadonly"
              :placeholder="t('job.intervalSecond')"
              v-model:value="model.intervalSecond"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
      </n-grid>
      <!--      <n-divider title-placement="left">任务配置</n-divider>-->
      <n-grid :cols="2" :x-gap="12">
        <n-gi>
          <n-form-item path="runMode" :label="t('job.runMode')">
            <n-select
              :disabled="isReadonly"
              v-model:value="model.runMode"
              :options="JobRunModeOptions"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="handleName" :label="t('job.handleName')">
            <n-input
              :disabled="isReadonly"
              :placeholder="t('job.handleName')"
              v-model:value="model.handleName"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
      </n-grid>
      <n-form-item path="triggerParam" :label="t('job.triggerParam')">
        <n-input
          :disabled="isReadonly"
          :placeholder="t('job.triggerParam')"
          v-model:value="model.triggerParam"
          type="textarea"
          :rows="5"
          :autosize="{
            minRows: 3,
            maxRows: 10
          }"
        />
      </n-form-item>
      <!--      <n-divider title-placement="left">高级配置</n-divider>-->
      <n-grid :cols="3" :x-gap="12">
        <n-gi>
          <n-form-item path="routerStrategy" :label="t('job.routerStrategy')">
            <n-select
              :disabled="isReadonly"
              v-model:value="model.routerStrategy"
              :options="RouterStrategyOptions"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="pastDueStrategy" :label="t('job.pastDueStrategy')">
            <n-select
              :disabled="isReadonly"
              v-model:value="model.pastDueStrategy"
              :options="PastDueStrategyOptions"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item
            path="blockingStrategy"
            :label="t('job.blockingStrategy')"
          >
            <n-select
              :disabled="isReadonly"
              v-model:value="model.blockingStrategy"
              :options="ExecutorBlockStrategyOptions"
            />
          </n-form-item>
        </n-gi>
      </n-grid>
      <n-grid :cols="3" :x-gap="12">
        <n-gi>
          <n-form-item path="timeoutSecond" :label="t('job.timeoutSecond')">
            <n-input-number
              :disabled="isReadonly"
              :placeholder="t('job.timeoutSecond')"
              v-model:value="model.timeoutSecond"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="tryTimes" :label="t('job.tryTimes')">
            <n-input-number
              :disabled="isReadonly"
              :placeholder="t('job.tryTimes')"
              v-model:value="model.tryTimes"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="enable" :label="t('job.enableStatus')">
            <n-switch :disabled="isReadonly" v-model:value="model.enable" />
          </n-form-item>
        </n-gi>
      </n-grid>
    </n-form>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import * as constant from '@/types/constant';
import {
  ScheduleTypeOptions,
  JobRunModeOptions,
  RouterStrategyOptions,
  PastDueStrategyOptions,
  ExecutorBlockStrategyOptions
} from './SeleteType.js';

// Props
const props = defineProps({
  model: Object,
  appList: Object
});

console.log('JobDetail model', props.model);

// Computed properties
const isReadonly = computed(
  () => props.model.mode === constant.FORM_MODE_DETAIL
);
const isKeyReadonly = computed(
  () => props.model.mode !== constant.FORM_MODE_CREATE
);

const isCron = computed(() => props.model.scheduleType === 'CRON');
const isInterval = computed(() => props.model.scheduleType === 'INTERVAL');
const isDelay = computed(() => props.model.scheduleType === 'DELAY');

// Rules for form validation
const rules = reactive({
  appName: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('需要名称');
        }
        return true;
      },
      trigger: ['input', 'blur']
    }
  ]
});

const { t } = useI18n();
</script>

<style scoped>
.detailWrap {
  background: #fff;
  padding: 3px;
  border-radius: 5px;
}

.group-title {
  padding-left: 40px;
}

.group-title span {
  font: 14/1.25;
  line-height: 28px;
  height: 28px;
  color: #333333;
}
</style>
