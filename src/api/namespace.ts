import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { INamespace } from '@/types/namespace';
import { IApiResult } from '@/types/base';
let axios = request;

class NamespaceApi {
  queryList(): Promise<AxiosResponse<IApiResult<Array<INamespace>>>> {
    return axios.request({
      method: 'get',
      url: '/ratchjob/api/console/v1/namespaces/list'
    });
  }
  add(namespace: INamespace): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/ratchjob/api/console/v1/namespaces/add',
      data: {
        ...namespace
      }
    });
  }
  update(namespace: INamespace): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/ratchjob/api/console/v1/namespaces/update',
      data: {
        ...namespace
      }
    });
  }
  delete(namespace: INamespace): Promise<AxiosResponse<IApiResult<any>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/ratchjob/api/console/v1/namespaces/remove',
      data: {
        namespaceId: namespace.namespaceId
      }
    });
  }
}
const namespaceApi = new NamespaceApi();
export default namespaceApi;
