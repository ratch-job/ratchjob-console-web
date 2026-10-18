<template>
  <n-modal
    :show="show"
    preset="card"
    :title="t('job.cronEditorTitle')"
    style="width: 720px; max-width: 95vw"
    :mask-closable="false"
    @update:show="onUpdateShow"
  >
    <div class="cron-editor-body">
      <n-alert v-if="parseHint" type="warning" :bordered="false" class="hint">
        {{ parseHint }}
      </n-alert>
      <n-tabs v-model:value="activeTab" type="line" animated>
        <n-tab-pane
          v-for="(def, index) in fieldDefs"
          :key="def.key"
          :name="def.key"
          :tab="t(`job.cronField.${def.key}`)"
        >
          <CronFieldPanel
            :model-value="fields[index]"
            :field-key="def.key"
            :min="def.min"
            :max="def.max"
            :unit-label="t(`job.cronField.unit.${def.key}`)"
            :disabled="disabled"
            @update:model-value="(value) => updateField(index, value)"
          />
        </n-tab-pane>
      </n-tabs>

      <div class="cron-preview">
        <span class="cron-preview-label">{{ t('job.cronValue') }}:</span>
        <code>{{ draftCron }}</code>
      </div>
      <div v-if="previewItems.length" :key="draftCron" class="cron-next">
        <div class="cron-next-title">{{ t('job.cronRecentPlan') }}</div>
        <ul>
          <li v-for="item in previewItems" :key="`${draftCron}-${item}`">
            {{ item }}
          </li>
        </ul>
      </div>
      <div v-else-if="draftCron && !errorMsg" class="cron-next empty">
        {{ t('job.cronField.previewEmpty') }}
      </div>
      <div v-if="errorMsg" class="cron-error">{{ errorMsg }}</div>
    </div>
    <template #footer>
      <n-space justify="end">
        <n-button @click="close">{{ t('common.return') }}</n-button>
        <n-button
          type="primary"
          :disabled="disabled || !!errorMsg || !draftCron"
          @click="confirm"
        >
          {{ t('common.confirm') }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { CronExpressionParser } from 'cron-parser';
import { toDatetime } from '@/utils/date';
import CronFieldPanel from './CronFieldPanel.vue';
import {
  DEFAULT_CRON,
  FIELD_DEFS,
  buildCronExpression,
  createDefaultFieldState,
  parseCronExpression
} from './cronExpr.js';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  value: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:show', 'confirm']);

const { t } = useI18n();
const fieldDefs = FIELD_DEFS;
const activeTab = ref('second');
const parseHint = ref('');
const errorMsg = ref('');
const previewItems = ref([]);
const fields = ref(
  FIELD_DEFS.map((def) => createDefaultFieldState(def.min, def.max))
);

const draftCron = computed(() => buildCronExpression(fields.value));

function updateField(index, value) {
  const next = fields.value.slice();
  next[index] = { ...value };
  fields.value = next;
}

function getNextCronExecutions(cronExpression, count = 5) {
  try {
    const interval = CronExpressionParser.parse(cronExpression, {
      currentDate: new Date(),
      iterator: true
    });
    const executions = [];
    for (let i = 0; i < count; i++) {
      const next = interval.next();
      if (!next) {
        break;
      }
      executions.push(toDatetime(next.toDate()));
    }
    return executions;
  } catch {
    return [];
  }
}

function refreshPreview(expression) {
  previewItems.value = getNextCronExecutions(expression, 5);
}

function validateDraft(expression = draftCron.value) {
  if (!expression) {
    errorMsg.value = t('job.cronField.invalid');
    previewItems.value = [];
    return false;
  }
  try {
    CronExpressionParser.parse(expression);
    errorMsg.value = '';
    refreshPreview(expression);
    return true;
  } catch {
    errorMsg.value = t('job.cronField.invalid');
    previewItems.value = [];
    return false;
  }
}

function initFromValue(value) {
  const trimmed = (value || '').trim();
  const parsed = parseCronExpression(trimmed || DEFAULT_CRON);
  if (parsed.ok) {
    fields.value = parsed.fields.map((item) => ({
      ...item,
      list: [...item.list]
    }));
    parseHint.value = '';
  } else {
    const fallback = parseCronExpression(DEFAULT_CRON);
    fields.value = fallback.fields.map((item) => ({
      ...item,
      list: [...item.list]
    }));
    parseHint.value = t('job.cronField.fallbackHint');
  }
  activeTab.value = 'second';
  validateDraft();
}

function onUpdateShow(visible) {
  emit('update:show', visible);
}

function close() {
  emit('update:show', false);
}

function confirm() {
  if (!validateDraft()) {
    return;
  }
  emit('confirm', draftCron.value);
  emit('update:show', false);
}

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      initFromValue(props.value);
    }
  }
);

watch(draftCron, (expression) => {
  if (props.show) {
    validateDraft(expression);
  }
});
</script>

<style scoped>
.cron-editor-body {
  min-height: 220px;
}

.hint {
  margin-bottom: 12px;
}

.cron-preview {
  margin-top: 16px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  word-break: break-all;
}

.cron-preview-label {
  margin-right: 8px;
  color: #666;
}

.cron-preview code {
  font-family: Consolas, Monaco, 'Courier New', monospace;
  color: #2080f0;
}

.cron-next {
  margin-top: 12px;
  font-size: 13px;
  color: #666;
}

.cron-next.empty {
  color: #999;
}

.cron-next-title {
  margin-bottom: 4px;
}

.cron-next ul {
  margin: 0;
  padding-left: 18px;
}

.cron-error {
  margin-top: 8px;
  color: #d03050;
  font-size: 13px;
}
</style>
