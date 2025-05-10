// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /location/getAllLocation */
export async function getAllLocation(options?: { [key: string]: any }) {
  return request<API.ResponseListLocationDTO>('/location/getAllLocation', {
    method: 'GET',
    ...(options || {}),
  });
}
