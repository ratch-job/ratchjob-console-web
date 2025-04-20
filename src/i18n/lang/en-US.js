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
    create: 'Create',
    edit: 'Edit',
    detail: 'Detail',
    history: 'History',
    operation: 'Operation',
    clone: 'Clone',
    trigger: 'Trigger',
    empty: 'Empty',
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
  passwordpanel: {
    input_old_password: 'Input Old Password',
    input_new_password: 'Input New Password',
    old_password: 'Old Password',
    new_password: 'New Password',
    new_password_confirm: 'New Password Confirm',
    input_new_password_confirm: 'Input New Password And Confirm',
    need_input_new_password: 'You need Input New Password',
    need_input_old_password: 'You need Input Old Password',
    you_will_need_to_enter_a_new_password_for_a_second_confirmation:
      'You will need to enter a new password for a second confirmation',
    confirm_that_the_content_does_not_match_the_new_password:
      'Confirm that the content does not match the new password',
    reset_password: 'Modify Password',
    logout: 'Logout',
    logout_success: 'Logout Success',
    reset_password_success: 'Modify Password Success！',
    the_input_cannot_be_empty: 'The input cannot be empty'
  },
  role: {
    admin: 'Admin',
    developer: 'Developer',
    guest: 'Guest'
  },
  login: {
    password: 'Password',
    captcha: 'captcha',
    login: 'Login',
    need_username: 'Need Username',
    need_password: 'Need Password',
    need_captcha: 'Need captcha',
    get_captcha_fail: 'Get captcha fail',
    USER_CHECK_ERROR: 'User or Password Error',
    CAPTCHA_CHECK_ERROR: 'captcha error',
    LOGIN_LIMITE_ERROR: 'login error too more times',
    LOGIN_UNKNOWN_ERROR: 'login fail unknown error'
  },
  menu: {
    index: 'Index',
    app_management: 'ExecutorManagement',
    app_list: 'AppList',
    job_management: 'JobManagement',
    job_list: 'JobList',
    job_task_list: 'JobTaskList',
    task_latest_list: 'LatestTaskList',
    system_management: 'System',
    user_management: 'User list',
    system_monitor: 'Monitor',
    cluster_info: 'Cluster Info',
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
  about: {
    intro_title: 'System introduction',
    version_title: 'System version',
    user_title: 'Current user'
  },
  cluster: {
    node: 'Node',
    address: 'Address',
    masternode: 'Master Node',
    cluster_info: 'Cluster Info'
  },
  monitor: {
    system_monitor: 'System Monitor',
    service_node: 'Service Node',
    interval_type: 'Interval Type',
    auto_refresh: 'Auto Refresh',
    app_cpu_usage: 'Cpu Usage',
    app_cpu_usage_percent: 'Cpu Usage Percent(%)',
    app_memory_usage: 'Memory Usage',
    app_memory_usage_percent: 'Memory Usage Percent(%)',
    app_rss_memory: 'RSS Memory',
    app_rss_memory_m: 'RSS Memory(M)',
    http_request_rps: 'http request rps',
    http_request_count: 'http request count',
    http_request_rt: 'http request avg time',
    http_request_rt_ms: 'http request avg time(ms)',
    http_request_handle_rt_summary: 'http request avg handle time',
    http_request_handle_rt_summary_percent_ms:
      'http request avg handle time percent(ms)',
    job_size: 'Number of jobs',
    job_enable_size: 'Number of enabled jobs',
    task_trigger_rps: 'Task trigger rps',
    task_trigger_size: 'Task trigger count',
    task_redo_size: 'Task retries count',
    task_status_size: 'Task instance statuses',
    task_success_size: 'Success count',
    task_fail_size: 'Failures count',
    task_pending_size: 'Waiting call count',
    task_running_size: 'Running count',
    LEAST: 'LEAST',
    MINUTE: 'MINUTE',
    HOUR: 'HOUR',
    DIRECT_NODE: 'DIRECT NODE'
  },
  app: {
    app: 'App',
    name: 'app name',
    label: 'app label',
    inputName: 'input app name',
    searchName: 'search app name(support fuzzy query)',
    emptyAddrs: 'empty address',
    instanceAddr: 'instance address',
    instanceAddrs: 'instance address list',
    instanceCount: 'instance count',
    registerType: 'register type',
    autoRegister: 'auto register',
    manualRegister: 'manual register',
    confirm_delete_action:
      'Are you sure you want to delete the application named <%:=appName%>?'
  },
  job: {
    _name: 'Job',
    id: 'JobID',
    appName: 'app name',
    description: 'job description',
    scheduleType: 'schedule type',
    scheduleParam: 'schedule param',
    cronValue: 'cron value',
    delaySecond: 'delay second',
    intervalSecond: 'interval second',
    runMode: 'run mode',
    handleName: 'handle name',
    triggerParam: 'trigger param',
    routerStrategy: 'router strategy',
    pastDueStrategy: 'past due strategy',
    blockingStrategy: 'blocking strategy',
    timeoutSecond: 'timeout second',
    tryTimes: 'try times',
    retryInterval: 'retry interval',
    confirm_delete_action:
      'Are you sure you want to delete the task whose id is <%:=id%>?',
    confirm_trigger_action:
      'Are you sure you want to trigger the task with id <%:=id%>?',
    task_list: 'Task list',
    enableStatus: 'EnableStatus',
    select_executor: 'Select executor',
    types: {
      scheduleType: {
        none: 'None',
        cron: 'Cron',
        interval: 'Interval',
        delay: 'Delay'
      },
      runMode: {
        bean: 'Bean',
        glueGroovy: 'Glue Groovy',
        glueShell: 'Glue Shell',
        gluePython: 'Glue Python',
        gluePhp: 'Glue PHP',
        glueNodejs: 'Glue Node.js',
        gluePowerShell: 'Glue PowerShell'
      },
      routerStrategy: {
        first: 'First',
        last: 'Last',
        roundRobin: 'Round Robin',
        random: 'Random',
        consistentHash: 'Consistent Hash',
        shardingBroadcast: 'Sharding Broadcast'
      },
      pastDueStrategy: {
        default: 'Default',
        ignore: 'Ignore',
        execute: 'Execute'
      },
      executorBlockStrategy: {
        serialExecution: 'Serial Execution',
        discardLater: 'Discard Later',
        coverEarly: 'Cover Early',
        other: 'Other'
      }
    }
  },
  task: {
    taskId: 'TaskID',
    jobId: 'JobID',
    triggerTime: 'TriggerTime',
    instanceAddr: 'InstanceAddr',
    triggerMessage: 'TriggerMessage',
    status: 'Status',
    finishTime: 'FinishTime',
    retryCount: 'RetryCount',
    callbackMessage: 'CallbackMessage'
  },
  error: {
    NO_PERMISSION: 'NO_PERMISSION',
    NO_APP_PERMISSION: 'NO_APP_PERMISSION',
    NO_NAMESPACE_PERMISSION: 'NO_NAMESPACE_PERMISSION',
    SYSTEM_ERROR: 'SYSTEM_ERROR'
  }
};
export default {
  ...message,
  ...enUS
};
