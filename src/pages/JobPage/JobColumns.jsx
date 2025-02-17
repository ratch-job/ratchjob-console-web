import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';
import template from 'template_js';
import { toDatetime } from '@/utils/date';
import router from '@/route/router.js';

export const createColumns = function ({
  showDetail,
  showUpdate,
  remove,
  webResources
}) {
  const { t } = useI18n();
  const removeConfirmSlots = {
    trigger: () => {
      return (
        <NButton size="tiny" quaternary type="error">
          {t('common.delete')}
        </NButton>
      );
    }
  };

  const columns = [
    {
      title: t('job.id'),
      key: 'id'
    },
    {
      title: t('job.description'),
      key: 'description'
    },
    {
      title: t('job.scheduleType'),
      key: 'scheduleType'
    },
    {
      title: t('job.cronValue'),
      key: 'cronValue'
    },
    {
      title: t('job.enableStatus'),
      key: 'enable',
      width: 100,
      render(row) {
        var value = row.enable ? t('common.enabled') : t('common.disabled');
        let tagType = 'info';
        if (row.enable) {
          tagType = 'success';
        }
        return (
          <NTag type={tagType} round>
            {value}
          </NTag>
        );
      }
    },
    {
      title: t('common.operation'),
      key: 'type',
      fixed: 'right',
      render(row) {
        let editButton;
        let removePopconfirm;
        editButton = (
          <NButton
            size="tiny"
            quaternary
            type="info"
            onClick={() => showUpdate(row)}
          >
            {t('common.edit')}
          </NButton>
        );
        removePopconfirm = (
          <NPopconfirm
            onPositiveClick={() => remove(row)}
            v-slots={removeConfirmSlots}
          >
            <span>
              {template(t('job.confirm_delete_action'), {
                appName: row.appName
              })}
            </span>
          </NPopconfirm>
        );
        return (
          <div>
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => showDetail(row)}
            >
              {t('common.detail')}
            </NButton>
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() =>
                router.push({
                  path: '/manage/job/task',
                  query: {
                    jobId: row.id
                  }
                })
              }
            >
              {t('job.task_list')}
            </NButton>
            {editButton}
            {removePopconfirm}
          </div>
        );
      }
    }
  ];
  return columns;
};

export const createJobTaskColumns = function () {
  const columns = [
    {
      title: 'Task ID',
      key: 'taskId',
      width: 80
    },
    {
      title: 'Job ID',
      key: 'jobId',
      width: 80
    },
    {
      title: 'Trigger Time',
      key: 'triggerTime',
      width: 200,
      render(row) {
        var value = '';
        if (row.triggerTime) {
          var date = new Date(row.triggerTime * 1000);
          value = toDatetime(date);
        }
        return <span>{value}</span>;
      }
    },
    {
      title: 'Instance Address',
      key: 'instanceAddr',
      width: 200
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render(row) {
        var value = row.status;
        let tagType = 'info';
        if (value === 'SUCCESS') {
          tagType = 'success';
        } else if (value === 'ERROR') {
          tagType = 'error';
        } else if (value === 'RUNNING') {
          tagType = 'warning';
        }
        return (
          <NTag type={tagType} round>
            {value}
          </NTag>
        );
      }
    },
    {
      title: 'Finish Time',
      key: 'finishTime',
      width: 200,
      render(row) {
        var value = '';
        if (row.finishTime) {
          var date = new Date(row.finishTime * 1000);
          value = toDatetime(date);
        }
        return <span>{value}</span>;
      }
    },
    {
      title: 'Trigger Message',
      key: 'triggerMessage',
      width: 200
    },
    {
      title: 'Callback Message',
      key: 'callbackMessage',
      width: 200
    }
  ];
  return columns;
};
