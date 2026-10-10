<template>
  <div class="cron-field-panel">
    <div v-if="isWeekField" class="week-hint">
      {{ t('job.cronField.weekHint') }}
    </div>
    <n-radio-group
      :value="model.mode"
      :disabled="disabled"
      :name="`cron-field-${fieldKey}`"
      @update:value="setMode"
    >
      <n-space vertical :size="14">
        <div class="option-row">
          <n-radio value="every">
            {{ t('job.cronField.every', { unit: unitLabel }) }}
          </n-radio>
        </div>

        <div class="option-row">
          <n-radio value="range">{{ t('job.cronField.range') }}</n-radio>
          <n-space
            align="center"
            :wrap="false"
            :size="6"
            class="option-controls"
            @click.stop
          >
            <span>{{ t('job.cronField.rangeFrom') }}</span>
            <n-input-number
              :value="model.rangeStart"
              :min="min"
              :max="max"
              :disabled="disabled"
              size="small"
              style="width: 96px"
              @update:value="onRangeStartChange"
              @focus="setMode('range')"
            />
            <span>{{ t('job.cronField.rangeTo') }}</span>
            <n-input-number
              :value="model.rangeEnd"
              :min="min"
              :max="max"
              :disabled="disabled"
              size="small"
              style="width: 96px"
              @update:value="onRangeEndChange"
              @focus="setMode('range')"
            />
          </n-space>
        </div>

        <div class="option-row">
          <n-radio value="step">{{ t('job.cronField.step') }}</n-radio>
          <n-space
            align="center"
            :wrap="false"
            :size="6"
            class="option-controls"
            @click.stop
          >
            <span>{{ t('job.cronField.stepFrom') }}</span>
            <n-input-number
              :value="model.stepStart"
              :min="min"
              :max="max"
              :disabled="disabled"
              size="small"
              style="width: 96px"
              @update:value="onStepStartChange"
              @focus="setMode('step')"
            />
            <span>{{ t('job.cronField.stepEvery') }}</span>
            <n-input-number
              :value="model.step"
              :min="1"
              :max="max - min + 1"
              :disabled="disabled"
              size="small"
              style="width: 96px"
              @update:value="onStepChange"
              @focus="setMode('step')"
            />
            <span>{{ unitLabel }}</span>
          </n-space>
        </div>

        <div class="option-row list-row">
          <n-radio value="list">{{ t('job.cronField.list') }}</n-radio>
          <div class="list-block" @click.stop @mousedown.stop>
            <n-checkbox-group
              :value="model.list"
              :disabled="disabled"
              @update:value="onListChange"
            >
              <n-grid :cols="gridCols" :x-gap="4" :y-gap="4">
                <n-gi v-for="n in options" :key="`${fieldKey}-${n}`">
                  <n-checkbox :value="n" :label="optionLabel(n)" />
                </n-gi>
              </n-grid>
            </n-checkbox-group>
          </div>
        </div>
      </n-space>
    </n-radio-group>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { rangeOptions } from './cronExpr.js';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  fieldKey: {
    type: String,
    required: true
  },
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  unitLabel: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();

const model = computed(() => props.modelValue);
const isWeekField = computed(() => props.fieldKey === 'week');
const options = computed(() => rangeOptions(props.min, props.max));
const gridCols = computed(() => {
  if (isWeekField.value) {
    return 4;
  }
  return props.max - props.min + 1 > 31 ? 10 : 8;
});

function optionLabel(n) {
  if (isWeekField.value) {
    return `${n}(${t(`job.cronField.weekdays.${n}`)})`;
  }
  return String(n);
}

function patch(partial) {
  emit('update:modelValue', { ...props.modelValue, ...partial });
}

function setMode(mode) {
  if (props.disabled || !mode) {
    return;
  }
  if (props.modelValue.mode !== mode) {
    patch({ mode });
  }
}

function onRangeStartChange(value) {
  patch({ mode: 'range', rangeStart: value ?? props.min });
}

function onRangeEndChange(value) {
  patch({ mode: 'range', rangeEnd: value ?? props.max });
}

function onStepStartChange(value) {
  patch({ mode: 'step', stepStart: value ?? props.min });
}

function onStepChange(value) {
  patch({ mode: 'step', step: value ?? 1 });
}

function onListChange(list) {
  const next = (list || [])
    .map((n) => Number(n))
    .filter((n) => Number.isInteger(n))
    .sort((a, b) => a - b);
  patch({
    mode: 'list',
    list: next.length ? next : [props.min]
  });
}
</script>

<style scoped>
.cron-field-panel {
  padding: 4px 0;
}

.week-hint {
  margin-bottom: 12px;
  padding: 8px 10px;
  font-size: 13px;
  line-height: 1.5;
  color: #666;
  background: #f7f7f7;
  border-radius: 4px;
}

.option-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
}

.option-controls {
  margin-left: 4px;
}

.list-row {
  align-items: flex-start;
}

.list-row :deep(.n-radio) {
  margin-top: 4px;
}

.list-block {
  flex: 1;
  min-width: 280px;
  max-width: 100%;
}
</style>
