import { getMessage as t } from '@/i18n';

export const ScheduleTypeOptions = [
  {
    value: '',
    label: t('job.types.scheduleType.none')
  },
  {
    value: 'CRON',
    label: t('job.types.scheduleType.cron')
  },
  {
    value: 'INTERVAL',
    label: t('job.types.scheduleType.interval')
  }
  /*
  {
    value: 'DELAY',
    label: t('job.types.scheduleType.delay'),
  },
   */
];

export const JobRunModeOptions = [
  {
    value: 'BEAN',
    label: t('job.types.runMode.bean')
  },
  {
    value: 'GLUE_GROOVY',
    label: t('job.types.runMode.glueGroovy')
  },
  {
    value: 'GLUE_SHELL',
    label: t('job.types.runMode.glueShell')
  },
  {
    value: 'GLUE_PYTHON',
    label: t('job.types.runMode.gluePython')
  },
  {
    value: 'GLUE_PHP',
    label: t('job.types.runMode.gluePhp')
  },
  {
    value: 'GLUE_NODEJS',
    label: t('job.types.runMode.glueNodejs')
  },
  {
    value: 'GLUE_POWERSHELL',
    label: t('job.types.runMode.gluePowerShell')
  }
];

export const RouterStrategyOptions = [
  {
    value: 'FIRST',
    label: t('job.types.routerStrategy.first')
  },
  {
    value: 'LAST',
    label: t('job.types.routerStrategy.last')
  },
  {
    value: 'ROUND_ROBIN',
    label: t('job.types.routerStrategy.roundRobin')
  },
  {
    value: 'RANDOM',
    label: t('job.types.routerStrategy.random')
  },
  {
    value: 'CONSISTENT_HASH',
    label: t('job.types.routerStrategy.consistentHash')
  },
  {
    value: 'SHARDING_BROADCAST',
    label: t('job.types.routerStrategy.shardingBroadcast')
  }
];

export const PastDueStrategyOptions = [
  {
    value: 'DEFAULT',
    label: t('job.types.pastDueStrategy.default')
  },
  {
    value: 'IGNORE',
    label: t('job.types.pastDueStrategy.ignore')
  },
  {
    value: 'EXECUTE',
    label: t('job.types.pastDueStrategy.execute')
  }
];

export const ExecutorBlockStrategyOptions = [
  {
    value: 'SERIAL_EXECUTION',
    label: t('job.types.executorBlockStrategy.serialExecution')
  },
  {
    value: 'DISCARD_LATER',
    label: t('job.types.executorBlockStrategy.discardLater')
  },
  {
    value: 'COVER_EARLY',
    label: t('job.types.executorBlockStrategy.coverEarly')
  },
  {
    value: 'OTHER',
    label: t('job.types.executorBlockStrategy.other')
  }
];

/*
export const JobStatusOptions = [
  {
    value: 'ENABLE',
    label: t('job.types.status.enable'),
  },
  {
    value: 'DISABLE',
    label: t('job.types.status.disable'),
  },
];
 */
