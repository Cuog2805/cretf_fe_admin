// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /propertyType/getAllPropertyType */
export async function getAllPropertyType(options?: { [key: string]: any }) {
  return request<API.ResponseListPropertyTypeDTO>('/propertyType/getAllPropertyType', {
    method: 'GET',
    ...(options || {}),
  });
}
