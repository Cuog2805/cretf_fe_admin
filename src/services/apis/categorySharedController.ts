// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /categoryShared/createCategoryShared */
export async function createCategoryShared(
  body: API.CategorySharedDTO,
  options?: { [key: string]: any },
) {
  return request<API.CategorySharedDTO>('/categoryShared/createCategoryShared', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /categoryShared/createMultiCategoryShared */
export async function createMultiCategoryShared(
  body: API.CategorySharedDTO[],
  options?: { [key: string]: any },
) {
  return request<API.CategorySharedDTO[]>('/categoryShared/createMultiCategoryShared', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /categoryShared/getAllCategoryShared */
export async function getAllCategoryShared(
  body: API.CategorySharedDTO,
  options?: { [key: string]: any },
) {
  return request<API.CategorySharedDTO[]>('/categoryShared/getAllCategoryShared', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
