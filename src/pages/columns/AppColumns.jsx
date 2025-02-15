import { NButton, NPopconfirm } from 'naive-ui';
import { toDatetime } from '@/utils/date';
import { useI18n } from 'vue-i18n';
import template from 'template_js';

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
      title: t('app.code'),
      key: 'appName'
    },
    {
      title: t('app.name'),
      key: 'label'
    },
    {
      title: t('common.operation'),
      key: 'type',
      fixed: 'right',
      render(row) {
        let editButton;
        let removePopconfirm;
        if (webResources.canUpdateConfig) {
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
                {template(t('config.confirm_delete_config_action'), {
                  group: row.group,
                  dataId: row.dataId
                })}
              </span>
            </NPopconfirm>
          );
        } else {
          editButton = <span></span>;
          removePopconfirm = editButton;
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
            {editButton}
            {removePopconfirm}
          </div>
        );
      }
    }
  ];
  return columns;
};
