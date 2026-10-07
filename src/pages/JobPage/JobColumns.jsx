import { NButton, NPopconfirm, NTag, NTooltip } from 'naive-ui';
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
      title: t('job.key'),
      key: 'key',
      width: 200
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
        let value = '';
        if (row.scheduleType === 'CRON') {
          value = row.cronValue;
        } else if (row.scheduleType === 'INTERVAL') {
          value = row.intervalSecond;
        } else if (row.scheduleType === 'DELAY') {
          value = row.delaySecond;
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

export const createJobTaskColumns = function ({ showJobDetail, showTaskLog }) {
  const { t } = useI18n();
  const renderMessageCell = function (value) {
    if (!value) {
      return <span></span>;
    }
    const triggerSlot = {
      trigger: () => (
        <span
          style={{
            display: 'block',
            maxWidth: '180px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {value}
        </span>
      )
    };
    return (
      <NTooltip
        placement="top-start"
        trigger="hover"
        width={500}
        v-slots={triggerSlot}
      >
        {value}
      </NTooltip>
    );
  };
  const columns = [
    {
      title: t('task.taskId'),
      key: 'taskId',
      width: 80
    },
    {
      title: t('task.namespace'),
      key: 'namespace',
      width: 150
    },
    {
      title: t('task.appName'),
      key: 'appName',
      width: 150
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
      width: 120,
      minWidth: 120,
      ellipsis: false,
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
      width: 220,
      render(row) {
        return renderMessageCell(row.triggerMessage);
      }
    },
    {
      title: t('task.callbackMessage'),
      key: 'callbackMessage',
      width: 220,
      render(row) {
        return renderMessageCell(row.callbackMessage);
      }
    },
    {
      title: t('common.operation'),
      key: 'operation',
      fixed: 'right',
      width: 100,
      render(row) {
        const retryLogs = Array.isArray(row.tryLogs) ? row.tryLogs : [];
        const hasLogAddress =
          Boolean(row.instanceAddr) ||
          retryLogs.some((item) => Boolean(item.addr));
        return (
          <NButton
            size="tiny"
            quaternary
            type="info"
            disabled={!hasLogAddress || showTaskLog === undefined}
            onClick={() => showTaskLog?.(row)}
          >
            {t('task.executionLog')}
          </NButton>
        );
      }
    }
  ];
  return columns;
};
