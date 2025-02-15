import enUS from 'naive-ui/lib/locales/common/enUS.js';
const message = {
  common: {
    query: 'Query',
    status: 'Status',
    yes: 'Yes',
    no: 'No',
    enabled: 'Enabled',
    disabled: 'Disabled',
    confirm: 'Confirm',
    title: 'Title',
    return: 'Return',
    back: 'Back',
    confirm_action: 'Do you want to confirm the action?',
    delete: 'Delete',
    edit: 'Edit',
    detail: 'Detail',
    history: 'History',
    operation: 'Operation',
    clone: 'Clone',
    updatedtime: 'Updated Time',
    recover: 'Recover',
    request_fail: 'Request Fail',
    refresh: 'Refresh',
    total: 'Total',
    add: 'Add',
    preInput: 'Input ',
    join: ' ',
    whitelist: 'Whitelist',
    blacklist: 'Blacklist',
    all: 'All',
    part: 'Part',
    permission: 'permission',
    submitSuccess: 'Submit success',
    success: 'Success',
    home: 'Home'
  },
  user: {
    name: 'User',
    username: 'Username',
    nickname: 'Nickname',
    password: 'Password',
    resetPassword: 'Reset password',
    list: 'User list',
    gmtCreate: 'CreateTime',
    gmtModified: 'ModifiedTime',
    roles: 'Roles',
    enable: 'Enable'
  },
  menu: {
    app_management: 'AppManagement',
    app_list: 'AppList',
    system_management: 'System',
    system_monitor: 'Monitor',
    about: 'About'
  },
  namespace: {
    namespace: 'Namespace',
    the_namespace_id_has_been_copied: 'The namespace id has been copied!',
    namespaceName: 'Namespace Name',
    namespaceId: 'Namespace Id',
    new_namespace: 'New Namespace',
    add_namespace: 'Add Namespace',
    edit_namespace: 'Edit Namespace',
    retain_space: 'Retain Namespace',
    confirm_delete_info:
      "Are you sure you want to delete the '<%:=name%>'(ID: <%:=id%>) namespace?",
    namespaceId_or: 'Namespace Id,null then auto create'
  },
  app: {
    code: 'app code',
    name: 'app name',
    inputCode: 'input app code',
    searchCode: 'search app code(support fuzzy query)'
  },
  error: {
    NO_PERMISSION: 'NO_PERMISSION',
    NO_NAMESPACE_PERMISSION: 'NO_NAMESPACE_PERMISSION',
    SYSTEM_ERROR: 'SYSTEM_ERROR'
  }
};
export default {
  ...message,
  ...enUS
};
