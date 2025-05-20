// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /role/createRole */
export async function createRole(body: API.RoleDTO, options?: { [key: string]: any }) {
  return request<API.ResponseRoleDTO>('/role/createRole', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /role/getAllRoles */
export async function getAllRoles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllRolesParams,
  body: API.RoleDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListRoleDTO>('/role/getAllRoles', {
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

/** 此处后端没有提供注释 POST /role/lockRole/${param0} */
export async function lockRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.lockRoleParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResponseString>(`/role/lockRole/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /role/unlockRole/${param0} */
export async function unlockRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.unlockRoleParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResponseString>(`/role/unlockRole/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /role/updateRole */
export async function updateRole(body: API.RoleDTO, options?: { [key: string]: any }) {
  return request<API.ResponseRoleDTO>('/role/updateRole', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
