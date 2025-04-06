import { NButton, NPopconfirm } from 'naive-ui';
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
      title: t('app.name'),
      key: 'appName'
    },
    {
      title: t('app.label'),
      key: 'label'
    },
    {
      title: t('app.registerType'),
      key: '_registerType',
      render(row) {
        if (row.registerType == 'MANUAL') {
          return <span>{t('app.manualRegister')}</span>;
        } else {
          return <span>{t('app.autoRegister')}</span>;
        }
      }
    },
    {
      title: t('app.instanceCount'),
      key: 'instanceCount'
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
              {template(t('app.confirm_delete_action'), {
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
            {editButton}
            {removePopconfirm}
          </div>
        );
      }
    }
  ];
  return columns;
};
