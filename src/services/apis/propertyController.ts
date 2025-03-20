// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /property/createMultiProperty */
export async function createMultiProperty(
  body: API.PropertyDTO[],
  options?: { [key: string]: any },
) {
  return request<API.PropertyDTO[]>('/property/createMultiProperty', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /property/createProperty */
export async function createProperty(body: API.PropertyDTO, options?: { [key: string]: any }) {
  return request<API.PropertyDTO>('/property/createProperty', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /property/getAllProperties */
export async function getAllProperties(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllPropertiesParams,
  options?: { [key: string]: any },
) {
  return request<API.PropertyDTO[]>('/property/getAllProperties', {
    method: 'GET',
    params: {
      ...params,
      propertyDTO: undefined,
      ...params['propertyDTO'],
    },
    ...(options || {}),
  });
}
