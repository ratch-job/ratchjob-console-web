import { AxiosResponse } from 'axios';
import request from '../utils/request';
import {
  IApiResult,
  WebResource,
  IPrivilegeGroup,
  IPageResult
} from '@/types/base';
let axios = request;

export interface ILoginParam {
  username: string;
  password: string;
  captcha: string;
}

export interface IResetPasswordParam {
  oldPassword: string;
  newPassword: string;
}

export interface IUserPageParam {
  likeUsername?: string;
  pageNo: Number;
  pageSize: Number;
  isRev: boolean;
}

export interface IUserInfo {
  username: string;
  nickname: string;
  password?: string;
  gmtCreate: number;
  gmtModified: number;
  enable: boolean;
  roles: Array<String>;
  extendInfo?: Map<String, String>;
  namespacePrivilege?: IPrivilegeGroup;
}

export interface IUpdateUserParam {
  username: string;
  nickname?: string;
  password?: string;
  enable?: boolean;
  roles?: string;
  namespacePrivilegeParam?: IPrivilegeGroup;
}

class UserApi {
  login(info: ILoginParam): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.request({
      method: 'post',
      url: '/ratchjob/api/console/v1/login/login',
      data: info
    });
  }
  genCaptcha(): Promise<AxiosResponse<IApiResult<string>>> {
    return axios.request({
      method: 'get',
      url: '/ratchjob/api/console/v1/login/captcha'
    });
  }
  logout(): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.request({
      method: 'post',
      url: '/ratchjob/api/console/v1/login/logout'
    });
  }
  resetPassword(
    info: IResetPasswordParam
  ): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/ratchjob/api/console/v1/user/reset_password',
      data: info
    });
  }
  getUserList(
    param: IUserPageParam
  ): Promise<AxiosResponse<IApiResult<IPageResult<IUserInfo>>>> {
    return axios.request({
      method: 'get',
      url: '/ratchjob/api/console/v1/user/list',
      params: {
        ...param
      }
    });
  }
  getUserWebResources(): Promise<AxiosResponse<IApiResult<WebResource>>> {
    return axios.request({
      method: 'get',
      url: '/ratchjob/api/console/v1/user/web_resources',
      params: {}
    });
  }
  addUser(info: IUpdateUserParam): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/ratchjob/api/console/v1/user/add',
      data: info
    });
  }
  updateUser(
    info: IUpdateUserParam
  ): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/ratchjob/api/console/v1/user/update',
      data: info
    });
  }
  removeUser(
    info: IUpdateUserParam
  ): Promise<AxiosResponse<IApiResult<boolean>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/ratchjob/api/console/v1/user/remove',
      data: info
    });
  }
}

export const userApi = new UserApi();
