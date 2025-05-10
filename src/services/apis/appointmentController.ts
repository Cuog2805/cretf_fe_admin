// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /appointment/createAppointment */
export async function createAppointment(
  body: API.AppointmentDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseAppointmentDTO>('/appointment/createAppointment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /appointment/deleteAppointment/${param0} */
export async function deleteAppointment(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAppointmentParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResponseString>(`/appointment/deleteAppointment/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /appointment/getAppointmentBySearch */
export async function getAppointmentBySearch(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAppointmentBySearchParams,
  body: API.AppointmentDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListAppointmentDTO>('/appointment/getAppointmentBySearch', {
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

/** 此处后端没有提供注释 POST /appointment/updateAppointment */
export async function updateAppointment(
  body: API.AppointmentDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseAppointmentDTO>('/appointment/updateAppointment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
