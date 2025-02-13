import zhCN from 'naive-ui/lib/locales/common/zhCN.js';
const message = {
  common: {
    query: '查询',
    status: '状态',
    yes: '是',
    no: '否',
    enabled: '正常',
    disabled: '失效',
    confirm: '确认',
    title: '标题',
    return: '返回',
    back: '返回',
    confirm_action: '是否确认操作?',
    delete: '删除',
    edit: '编辑',
    detail: '详情',
    history: '历史记录',
    operation: '操作',
    clone: '克隆',
    updatedtime: '更新时间',
    recover: '恢复',
    request_fail: '请求失败',
    refresh: '刷新',
    total: '总行数',
    add: '新建',
    preInput: '输入',
    join: '',
    whitelist: '白名单',
    blacklist: '黑名单',
    all: '全部',
    part: '部分',
    permission: '权限',
    submitSuccess: '提交成功',
    success: '成功',
    home: '首页'
  },
  user: {
    name: '用户',
    username: '用户名',
    nickname: '用户昵称',
    password: '密码',
    resetPassword: '重置密码(空则不调整)',
    list: '用户列表',
    gmtCreate: '创建时间',
    gmtModified: '更新时间',
    roles: '角色',
    enable: '是否启用',
    confirm_delete_user_action: '确认要删服务名称为:<%:=username%> 的用户吗？'
  },
  menu: {
    system_monitor: '系统监控',
    about: '关于'
  },
  error: {
    NO_PERMISSION: '没有权限',
    NO_NAMESPACE_PERMISSION: '没有命名空间权限',
    SYSTEM_ERROR: '系统异常'
  }
};
export default {
  ...message,
  ...zhCN
};
