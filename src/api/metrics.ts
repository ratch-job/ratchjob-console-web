import { AxiosResponse } from 'axios';
import request from '../utils/request';
import { IApiResult } from '@/types/base';
let axios = request;

export interface TimelineSummary {
  boundKeys: Array<string>;
  bounds: Array<number>;
  rpsData: Array<number>;
  averageData: Array<number>;
  countData: Array<number>;
  itemsData: Map<string, Array<number>>;
}

export interface TimelineQueryResponse {
  lastTime: number;
  fromNodeId: number;
  intervalSecond: number;
  timeIndex: Array<number>;
  gaugeData: Map<string, Array<number>>;
  summeryData: Map<string, TimelineSummary>;
}

export interface TimelineQueryParam {
  startTime: number;
  timelineGroupName: String; //LEAST | MINUTE
  keys: Array<string>;
  nodeId: number;
}

class MetricsApi {
  queryTimeLine(
    param: TimelineQueryParam
  ): Promise<AxiosResponse<IApiResult<TimelineQueryResponse>>> {
    return axios.requestJSON({
      method: 'post',
      url: '/ratchjob/api/console/v1/metrics/timeline',
      data: JSON.stringify(param)
    });
  }
}
export const metricsApi = new MetricsApi();
