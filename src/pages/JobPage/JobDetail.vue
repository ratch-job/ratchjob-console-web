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
            <n-input-group>
              <n-input
                :disabled="isReadonly"
                :placeholder="t('job.cronValue')"
                v-model:value="model.cronValue"
                @keydown.enter.prevent
              />
              <n-button ghost @click="cronPlan">
                <template #icon>
                  <n-icon><Eye /></n-icon>
                </template>
              </n-button>
            </n-input-group>
          </n-form-item>
          <n-form-item
            v-if="isDelay"
            path="delaySecond"
            :label="t('job.delaySecond')"
          >
            <n-input-number
              :disabled="isReadonly"
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
              v-model:value="model.intervalSecond"
              style="width: 100%"
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
              style="width: 100%"
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
              style="width: 100%"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="retryInterval" :label="t('job.retryInterval')">
            <n-input-number
              :disabled="isReadonly"
              :placeholder="t('job.retryInterval')"
              v-model:value="model.retryInterval"
              style="width: 100%"
              @keydown.enter.prevent
            />
          </n-form-item>
        </n-gi>
      </n-grid>
      <n-grid :cols="3" :x-gap="12">
        <n-gi>
          <n-form-item path="enable" :label="t('job.enableStatus')">
            <n-switch :disabled="isReadonly" v-model:value="model.enable" />
          </n-form-item>
        </n-gi>
      </n-grid>
    </n-form>
    <n-modal v-model:show="showCronPlan">
      <n-card
        style="width: 220px"
        title="最近计划"
        :bordered="false"
        role="dialog"
        aria-modal="true"
      >
        <ul>
          <!-- 使用 v-for 循环渲染数组 -->
          <li v-for="(item, index) in cronPlanItems" :key="index">
            {{ item }}
          </li>
        </ul>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as constant from '@/types/constant';
import { toDatetime } from '@/utils/date';
import { CronExpressionParser } from 'cron-parser';
import { Eye } from '@vicons/ionicons5';
import {
  ScheduleTypeOptions,
  JobRunModeOptions,
  RouterStrategyOptions,
  PastDueStrategyOptions,
  ExecutorBlockStrategyOptions
} from './SeleteType.js';

const showCronPlan = ref(false);
const cronPlanItems = ref([]);

// Props
const props = defineProps({
  model: Object,
  appList: Object
});

function getNextCronExecutions(cronExpression, count = 5) {
  try {
    // 创建一个解析器选项对象
    const options = {
      currentDate: new Date(), // 当前时间为起始点
      iterator: true // 启用迭代器模式
    };

    // 解析 cron 表达式
    const interval = CronExpressionParser.parse(cronExpression, options);

    const executions = [];

    // 获取未来 count 次的执行时间
    for (let i = 0; i < count; i++) {
      const next = interval.next(); // 获取下一次执行时间
      if (next) {
        executions.push(toDatetime(next.toDate())); // 转换为 JavaScript Date 对象
      } else {
        break; // 如果没有更多执行时间，则退出循环
      }
    }

    return executions;
  } catch (error) {
    console.error('Error parsing cron expression:', error.message);
    return [];
  }
}

const cronPlan = function () {
  let items = getNextCronExecutions(props.model.cronValue, 5);
  cronPlanItems.value = items;
  showCronPlan.value = true;
};

//console.log('JobDetail model', props.model);

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
