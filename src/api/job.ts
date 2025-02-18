import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { IApiResult, IPageResult } from '@/types/base';

let axios = request;

export interface IJobInfoParam {
  id?: number;
  enable?: boolean;
  namespace?: string;
  appName?: string;
  description?: string;
  scheduleType?: string;
  cronValue?: string;
  delaySecond?: number;
  intervalSecond?: number;
  runMode?: string;
  handleName?: string;
  triggerParam?: string;
  routerStrategy?: string;
  pastDueStrategy?: string;
  blockingStrategy?: string;
  timeoutSecond?: number;
  tryTimes?: number;
}

export interface IJobInfo {
  id: number;
  enable: boolean;
  appName: string;
  namespace: string;
  description: string;
  scheduleType: string; // Assuming ScheduleType is a string for simplicity
  cronValue: string;
  delaySecond: number;
  intervalSecond: number;
  runMode: string; // Assuming JobRunMode is a string for simplicity
  handleName: string;
  triggerParam: string;
  routerStrategy: string; // Assuming RouterStrategy is a string for simplicity
  pastDueStrategy: string; // Assuming PastDueStrategy is a string for simplicity
  blockingStrategy: string; // Assuming ExecutorBlockStrategy is a string for simplicity
  timeoutSecond: number;
  tryTimes: number;
  versionId: number;
  lastModifiedMillis: number;
  registerTime: number;
}

export interface IJobPageParam {
  namespace: string;
  appName?: string;
  likeDescription?: string;
  likeHandleName?: string;
  pageNo: number;
  pageSize: number;
}

export interface IJobTaskInfo {
  taskId: number;
  jobId: number;
  triggerTime: number;
  instanceAddr: string;
  triggerMessage: string;
  status: string; // Assuming TaskStatusType is a string for simplicity
  finishTime: number;
  callbackMessage: string;
}

export interface IJobTaskPageParam {
  jobId?: number;
  pageNo: number;
  pageSize: number;
}

class JobApi {
  getJobList(
    param: IJobPageParam
  ): Promise<AxiosResponse<IApiResult<IPageResult<IJobInfo>>>> {
    return axios.request({
      method: 'get',
      url: '/ratchjob/api/console/v1/job/list',
      params: {
        ...param
      }
    });
  }

  getJobInfo(
    param: IJobPageParam
  ): Promise<AxiosResponse<IApiResult<IJobInfo>>> {
    return axios.request({
      method: 'get',
      url: '/ratchjob/api/console/v1/job/info',
      params: {
        ...param
      }
    });
  }

  getJobTaskList(
    param: IJobTaskPageParam
  ): Promise<AxiosResponse<IApiResult<IJobTaskPageParam>>> {
    return axios.request({
      method: 'get',
      url: '/ratchjob/api/console/v1/job/task/list',
      params: {
        ...param
      }
    });
  }

  getJobTaskHistoryList(
    param: IJobTaskPageParam
  ): Promise<AxiosResponse<IApiResult<IJobTaskPageParam>>> {
    return axios.request({
      method: 'get',
      url: '/ratchjob/api/console/v1/job/task/latest-history',
      params: {
        ...param
      }
    });
  }

  createJob(param: IJobInfoParam): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/ratchjob/api/console/v1/job/create',
      data: param
    });
  }

  updateJob(param: IJobInfoParam): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/ratchjob/api/console/v1/job/update',
      data: param
    });
  }

  removeJob(param: IJobInfoParam): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/ratchjob/api/console/v1/job/remove',
      data: param
    });
  }
}

export const jobApi = new JobApi();
