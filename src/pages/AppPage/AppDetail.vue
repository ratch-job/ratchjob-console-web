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
      <n-form-item path="instanceAddrs" :label="t('app.instanceAddrs')">
        <ul class="addr-group" v-for="item in model.instanceAddrs">
          <li class="addr-item">{{ item }}</li>
        </ul>
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

// Computed properties
const isReadonly = computed(
  () => props.model.mode === constant.FORM_MODE_DETAIL
);
const isKeyReadonly = computed(
  () => props.model.mode !== constant.FORM_MODE_CREATE
);

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
.addr-group {
  list-style-type: none; /* 去掉默认的列表样式 */
  padding: 0; /* 去掉默认的内边距 */
  margin: 0; /* 去掉默认的外边距 */
}

.addr-item {
  background-color: #f0f0f0; /* 灰色背景 */
  margin: 5px 5px 5px 0; /* 每个li元素之间的间隔 */
  padding: 5px; /* 内边距，使内容不贴边 */
  border-radius: 4px; /* 可选：圆角 */
}
</style>
