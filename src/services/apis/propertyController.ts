// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /property/addToFavourite */
export async function addToFavourite(body: API.PropertyDTO, options?: { [key: string]: any }) {
  return request<API.ResponseString>('/property/addToFavourite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /property/approveProperty */
export async function approveProperty(body: API.PropertyDTO, options?: { [key: string]: any }) {
  return request<API.ResponseString>('/property/approveProperty', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

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
  return request<API.ResponsePropertyDTO>('/property/createProperty', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /property/createPropertyComment */
export async function createPropertyComment(
  body: API.PropertyCommentDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponsePropertyCommentDTO>('/property/createPropertyComment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /property/deleteProperty/${param0} */
export async function deleteProperty(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePropertyParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResponseString>(`/property/deleteProperty/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /property/deletePropertyComment/${param0} */
export async function deletePropertyComment(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePropertyCommentParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResponseString>(`/property/deletePropertyComment/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /property/getAllProperties */
export async function getAllProperties(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllPropertiesParams,
  body: API.PropertyDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListPropertyDTO>('/property/getAllProperties', {
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

/** 此处后端没有提供注释 POST /property/getFavouriteProperties */
export async function getFavouriteProperties(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFavouritePropertiesParams,
  body: API.PropertyDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListPropertyDTO>('/property/getFavouriteProperties', {
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

/** 此处后端没有提供注释 POST /property/getOneDetailProperty */
export async function getOneDetailProperty(
  body: API.PropertyDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponsePropertyDTO>('/property/getOneDetailProperty', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /property/lockProperty */
export async function lockProperty(body: API.PropertyDTO, options?: { [key: string]: any }) {
  return request<API.ResponseString>('/property/lockProperty', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /property/removeToFavourite */
export async function removeToFavourite(body: API.PropertyDTO, options?: { [key: string]: any }) {
  return request<API.ResponseString>('/property/removeToFavourite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /property/unLockProperty */
export async function unLockProperty(body: API.PropertyDTO, options?: { [key: string]: any }) {
  return request<API.ResponseString>('/property/unLockProperty', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /property/updateProperty */
export async function updateProperty(body: API.PropertyDTO, options?: { [key: string]: any }) {
  return request<API.ResponsePropertyDTO>('/property/updateProperty', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
