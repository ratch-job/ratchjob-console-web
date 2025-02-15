import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { IApiResult, IPageResult } from '@/types/base';
let axios = request;

export interface IAppInfo {
  appName: string;
  label: string;
  namespace: string;
  registerType: string;
}

export interface IAppPageParam {
  namespace: string;
  appName?: string;
  likeAppName?: string;
  pageNo: Number;
  pageSize: Number;
}

interface IAppInfoParam {
  namespace?: string;
  app_name?: string;
  label?: string;
  register_type?: string;
  instance_addrs?: string[];
}

class AppApi {
  getAppList(
    param: IAppPageParam
  ): Promise<AxiosResponse<IApiResult<IPageResult<IAppInfo>>>> {
    return axios.request({
      method: 'get',
      url: '/ratchjob/api/console/v1/app/list',
      params: {
        ...param
      }
    });
  }

  updateApp(param: IAppInfoParam): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/ratchjob/api/console/v1/app/update',
      data: param
    });
  }

  removeApp(param: IAppInfoParam): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/ratchjob/api/console/v1/app/remove',
      data: param
    });
  }
}

export const appApi = new AppApi();
