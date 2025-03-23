import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { IApiResult } from '@/types/base';
let axios = request;

export interface IClusterNode {
  nodeId: number;
  addr: string;
  currentNode: boolean;
  raftLeader: boolean;
  distroValid: boolean;
}

class ClusterApi {
  queryNodeList(): Promise<AxiosResponse<IApiResult<Array<IClusterNode>>>> {
    return axios.request({
      method: 'get',
      url: '/ratchjob/api/console/v1/cluster/cluster_node_list'
    });
  }
}
export const clusterApi = new ClusterApi();
