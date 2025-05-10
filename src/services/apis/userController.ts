// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /users */
export async function getAllUsers(options?: { [key: string]: any }) {
  return request<API.ResponseListUsersDTO>('/users', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /users/${param0} */
export async function getUserById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserByIdParams,
  options?: { [key: string]: any },
) {
  const { userId: param0, ...queryParams } = params;
  return request<API.ResponseUsersDTO>(`/users/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /users/${param0} */
export async function deleteUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserParams,
  options?: { [key: string]: any },
) {
  const { userId: param0, ...queryParams } = params;
  return request<API.ResponseVoid>(`/users/${param0}`, {
    method: 'DELETE',
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
