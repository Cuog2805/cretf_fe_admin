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

/** 此处后端没有提供注释 POST /role/deleteRole/${param0} */
export async function deleteRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRoleParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResponseString>(`/role/deleteRole/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
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

/** 此处后端没有提供注释 POST /role/restoreRole/${param0} */
export async function restoreRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.restoreRoleParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResponseString>(`/role/restoreRole/${param0}`, {
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
