import zhCN from 'naive-ui/lib/locales/common/zhCN.js';
const message = {
  common: {
    query: '查询',
    status: '状态',
    yes: '是',
    no: '否',
    enabled: '启用',
    disabled: '禁用',
    confirm: '确认',
    title: '标题',
    return: '返回',
    back: '返回',
    confirm_action: '是否确认操作?',
    delete: '删除',
    create: '创建',
    edit: '编辑',
    detail: '详情',
    history: '历史记录',
    operation: '操作',
    clone: '克隆',
    trigger: '触发',
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
    index: '首页',
    app_management: '执行器管理',
    app_list: '应用列表',
    job_management: '任务管理',
    job_list: '任务列表',
    job_task_list: '任务实例列表',
    task_latest_list: '最近任务执行记录',
    system_management: '系统管理',
    system_monitor: '系统监控',
    about: '关于'
  },
  namespace: {
    namespace: '命名空间',
    the_namespace_id_has_been_copied: '已复制命名空间id!',
    namespaceName: '命名空间名称',
    namespaceId: '命名空间Id',
    new_namespace: '创建命名空间',
    add_namespace: '新增命名空间',
    edit_namespace: '修改命名空间',
    retain_space: '保留空间',
    confirm_delete_info: "确认要删除 '<%:=name%>'(ID: <%:=id%>) 命名空间吗？",
    namespaceId_or: '命名空间ID,不填则自动生成'
  },
  about: {
    intro_title: '系统简介',
    version_title: '系统版本号',
    user_title: '当前用户'
  },
  app: {
    name: '应用名称',
    label: '应用标签',
    inputName: '输入应用名称',
    searchName: '查询应用名称(支持模糊查询)',
    instanceAddrs: '实例地址列表',
    confirm_delete_action: '确认要删应用名为<%:=appName%>的应用吗？'
  },
  job: {
    _name: '任务',
    id: '任务ID',
    appName: '应用名称',
    description: '任务描述',
    scheduleType: '调度类型',
    scheduleParam: '调度参数',
    cronValue: 'cron 表达式',
    delaySecond: '延迟秒数',
    intervalSecond: '间隔秒数',
    runMode: '运行模式',
    handleName: '处理名称',
    triggerParam: '触发参数',
    routerStrategy: '路由策略',
    pastDueStrategy: '逾期策略',
    blockingStrategy: '阻塞策略',
    timeoutSecond: '超时秒数',
    tryTimes: '重试次数',
    retryInterval: '重试间隔',
    confirm_delete_action: '确认要删除id为<%:=id%>的任务吗？',
    confirm_trigger_action: '确认要触发id为<%:=id%>的任务吗？',
    task_list: '执行实例',
    enableStatus: '启动状态',
    types: {
      scheduleType: {
        none: '无',
        cron: 'CRON',
        interval: '间隔',
        delay: '延迟'
      },
      runMode: {
        bean: 'Bean',
        glueGroovy: 'Groovy',
        glueShell: 'Shell',
        gluePython: 'Python',
        gluePhp: 'PHP',
        glueNodejs: 'Node.js',
        gluePowerShell: 'PowerShell'
      },
      routerStrategy: {
        first: '第一个',
        last: '最后一个',
        roundRobin: '轮询',
        random: '随机',
        consistentHash: '一致性哈希',
        shardingBroadcast: '分片广播'
      },
      pastDueStrategy: {
        default: '默认',
        ignore: '忽略',
        execute: '执行'
      },
      executorBlockStrategy: {
        serialExecution: '串行执行',
        discardLater: '丢弃后续',
        coverEarly: '覆盖早期',
        other: '其他'
      }
    }
  },
  task: {
    taskId: '任务实例ID',
    jobId: '任务ID',
    triggerTime: '触发时间',
    instanceAddr: '实例地址',
    triggerMessage: '触发消息',
    status: '状态',
    finishTime: '完成时间',
    callbackMessage: '回调消息'
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
