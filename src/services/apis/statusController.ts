// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /status/getAllStatus */
export async function getAllStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllStatusParams,
  body: API.StatusDTO,
  options?: { [key: string]: any },
) {
  return request<API.PageStatusDTO>('/status/getAllStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      // size has a default value: 20
      size: '20',
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}
