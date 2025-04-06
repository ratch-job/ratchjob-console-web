<template>
  <div class="detailWrap">
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="appName" :label="t('app.name')">
        <n-input
          :disabled="isKeyReadonly"
          :placeholder="t('app.name')"
          v-model:value="model.appName"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="label" :label="t('app.label')">
        <n-input
          :disabled="isReadonly"
          :placeholder="t('app.label')"
          v-model:value="model.label"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="registerType" :label="t('app.registerType')">
        <n-radio-group
          :disabled="isReadonly"
          v-model:value="model.registerType"
          name="registerType"
        >
          <n-space>
            <n-radio
              v-for="item in registerTypes"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item path="instanceAddrs" :label="t('app.instanceAddrs')">
        <div class="addr-group">
          <n-dynamic-input
            :disabled="isReadonly || isAutoRegister"
            v-model:value="model.instanceAddrs"
            :placeholder="t('app.instanceAddr')"
          />
          <div class="addr-btn">
            <n-button
              v-show="!isAutoRegister"
              :disabled="isReadonly"
              type="info"
              @click="emptyAddrs"
              >{{ t('app.emptyAddrs') }}</n-button
            >
          </div>
        </div>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
import * as constant from '@/types/constant';
import { useI18n } from 'vue-i18n';

// Props
const props = defineProps({
  model: Object
});

const { t } = useI18n();
let registerTypes = [
  {
    label: t('app.autoRegister'),
    value: 'AUTO'
  },
  {
    label: t('app.manualRegister'),
    value: 'MANUAL'
  }
];

let emptyAddrs = function () {
  props.model.instanceAddrs = [];
};

// Computed properties
const isReadonly = computed(
  () => props.model.mode === constant.FORM_MODE_DETAIL
);
const isKeyReadonly = computed(
  () => props.model.mode !== constant.FORM_MODE_CREATE
);
const isAutoRegister = computed(() => props.model.registerType === 'AUTO');

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
</script>

<style scoped>
.detailWrap {
  background: #fff;
  padding: 3px;
  border-radius: 5px;
}

.addr-group {
  width: 100%;
}

.addr-btn {
  margin-top: 10px;
}
</style>
