// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /auth/change-password */
export async function changePassword(body: API.UsersDTO, options?: { [key: string]: any }) {
  return request<API.ResponseString>('/auth/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/login */
export async function login(body: API.UsersDTO, options?: { [key: string]: any }) {
  return request<API.ResponseUsersDTO>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<API.ResponseString>('/auth/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/register */
export async function register(body: API.UsersDTO, options?: { [key: string]: any }) {
  return request<API.ResponseUsersDTO>('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
