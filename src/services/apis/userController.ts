// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 DELETE /users/deleteUser/${param0} */
export async function deleteUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserParams,
  options?: { [key: string]: any },
) {
  const { userId: param0, ...queryParams } = params;
  return request<API.ResponseString>(`/users/deleteUser/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /users/getAllUsers */
export async function getAllUsers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllUsersParams,
  body: API.UsersDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListUsersDTO>('/users/getAllUsers', {
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

/** 此处后端没有提供注释 GET /users/getUserById/${param0} */
export async function getUserById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserByIdParams,
  options?: { [key: string]: any },
) {
  const { userId: param0, ...queryParams } = params;
  return request<API.ResponseUsersDTO>(`/users/getUserById/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /users/lockUser/${param0} */
export async function lockUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.lockUserParams,
  options?: { [key: string]: any },
) {
  const { userId: param0, ...queryParams } = params;
  return request<API.ResponseString>(`/users/lockUser/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /users/me */
export async function getCurrentUser(options?: { [key: string]: any }) {
  return request<API.ResponseUsersDTO>('/users/me', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /users/restoreUser/${param0} */
export async function restoreUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.restoreUserParams,
  options?: { [key: string]: any },
) {
  const { userId: param0, ...queryParams } = params;
  return request<API.ResponseString>(`/users/restoreUser/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /users/unlockUser/${param0} */
export async function unlockUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.unlockUserParams,
  options?: { [key: string]: any },
) {
  const { userId: param0, ...queryParams } = params;
  return request<API.ResponseString>(`/users/unlockUser/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /users/updateUser */
export async function updateUser(body: API.UsersDTO, options?: { [key: string]: any }) {
  return request<API.ResponseUsersDTO>('/users/updateUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
