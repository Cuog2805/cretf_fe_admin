// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /publicFacility/createPublicFacility */
export async function createPublicFacility(
  body: API.PublicFacilityDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponsePublicFacilityDTO>('/publicFacility/createPublicFacility', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /publicFacility/getAllPublicFacility */
export async function getAllPublicFacility(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllPublicFacilityParams,
  body: API.PublicFacilityDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListPublicFacilityDTO>('/publicFacility/getAllPublicFacility', {
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

/** 此处后端没有提供注释 POST /publicFacility/lockPublicFacility */
export async function lockPublicFacility(
  body: API.PublicFacilityDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseString>('/publicFacility/lockPublicFacility', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /publicFacility/unLockPublicFacility */
export async function unLockPublicFacility(
  body: API.PublicFacilityDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseString>('/publicFacility/unLockPublicFacility', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
