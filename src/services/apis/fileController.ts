// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /files/${param0} */
export async function getFileInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFileInfoParams,
  options?: { [key: string]: any },
) {
  const { fileId: param0, ...queryParams } = params;
  return request<API.FilesDTO>(`/files/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /files/${param0} */
export async function deleteFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteFileParams,
  options?: { [key: string]: any },
) {
  const { fileId: param0, ...queryParams } = params;
  return request<any>(`/files/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /files/${param0}/url */
export async function getFileUrl(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFileUrlParams,
  options?: { [key: string]: any },
) {
  const { fileId: param0, ...queryParams } = params;
  return request<Record<string, any>>(`/files/${param0}/url`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /files/upload */
export async function uploadFile(body: {}, file?: File, options?: { [key: string]: any }) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.FilesDTO>('/files/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /files/uploadMulti */
export async function uploadFileMulti(body: {}, files?: File[], options?: { [key: string]: any }) {
  const formData = new FormData();

  if (files) {
    files.forEach((f) => formData.append('files', f || ''));
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.FilesDTO[]>('/files/uploadMulti', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}
