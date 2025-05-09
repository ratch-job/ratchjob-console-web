import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';
import template from 'template_js';
import { toDatetime } from '@/utils/date';
import router from '@/route/router.js';

export const createColumns = function ({
  showDetail,
  showUpdate,
  showClone,
  remove,
  trigger,
  showTrigger,
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
  const triggerConfirmSlots = {
    trigger: () => {
      return (
        <NButton size="tiny" quaternary type="error">
          {t('common.trigger')}
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
      title: t('job.scheduleParam'),
      key: 'scheduleParam',
      render(row) {
        let value = row.cronValue;
        if (row.scheduleType === 'INTERVAL') {
          value = row.intervalSecond;
        }
        return <span>{value}</span>;
      }
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
        let cloneButton;
        let triggerPopconfirm;
        let triggerButton;
        if (webResources.canUpdateJob) {
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
          cloneButton = (
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => showClone(row)}
            >
              {t('common.clone')}
            </NButton>
          );
          /*
          triggerPopconfirm = (
            <NPopconfirm
              onPositiveClick={() => trigger(row)}
              v-slots={triggerConfirmSlots}
            >
              <span>
                {template(t('job.confirm_trigger_action'), {
                  id: row.id
                })}
              </span>
            </NPopconfirm>
          );
           */
          triggerButton = (
            <NButton
              size="tiny"
              quaternary
              type="error"
              onClick={() => showTrigger(row)}
            >
              {t('common.trigger')}
            </NButton>
          );
          removePopconfirm = (
            <NPopconfirm
              onPositiveClick={() => remove(row)}
              v-slots={removeConfirmSlots}
            >
              <span>
                {template(t('job.confirm_delete_action'), {
                  id: row.id
                })}
              </span>
            </NPopconfirm>
          );
        } else {
          editButton = <span></span>;
          removePopconfirm = editButton;
          triggerButton = editButton;
          triggerPopconfirm = editButton;
        }
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
            {cloneButton}
            {triggerButton}
            {removePopconfirm}
          </div>
        );
      }
    }
  ];
  return columns;
};

export const createJobTaskColumns = function ({ showJobDetail }) {
  const { t } = useI18n();
  const columns = [
    {
      title: t('task.taskId'),
      key: 'taskId',
      width: 80
    },
    {
      title: t('task.jobId'),
      key: '_jobId',
      width: 80,
      render(row) {
        if (showJobDetail !== undefined) {
          return (
            <NButton
              size="tiny"
              quaternary
              type="info"
              onClick={() => showJobDetail(row.jobId)}
            >
              {row.jobId}
            </NButton>
          );
        } else {
          return <span>{row.jobId}</span>;
        }
      }
    },
    {
      title: t('task.triggerTime'),
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
      title: t('task.instanceAddr'),
      key: 'instanceAddr',
      width: 200
    },
    {
      title: t('task.status'),
      key: 'status',
      width: 100,
      render(row) {
        var value = row.status;
        let tagType = 'info';
        if (value === 'SUCCESS') {
          tagType = 'success';
        } else if (value === 'ERROR' || value === 'FAIL') {
          tagType = 'error';
        } else if (value === 'RUNNING') {
          tagType = 'warning';
        }
        return (
          <NTag size="small" type={tagType} round>
            {value}
          </NTag>
        );
      }
    },
    {
      title: t('task.finishTime'),
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
      title: t('task.retryCount'),
      key: 'retryCount',
      width: 100
    },
    {
      title: t('task.triggerMessage'),
      key: 'triggerMessage',
      width: 200
    },
    {
      title: t('task.callbackMessage'),
      key: 'callbackMessage',
      width: 200
    }
  ];
  return columns;
};
