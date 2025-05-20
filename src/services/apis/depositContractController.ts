// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /depositContract/confirmDepositContract */
export async function confirmDepositContract(
  body: API.DepositContractDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseString>('/depositContract/confirmDepositContract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /depositContract/createDepositContract */
export async function createDepositContract(
  body: API.DepositContractDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseDepositContractDTO>('/depositContract/createDepositContract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /depositContract/deleteDepositContract/${param0} */
export async function deleteDepositContract(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteDepositContractParams,
  options?: { [key: string]: any },
) {
  const { templateId: param0, ...queryParams } = params;
  return request<API.ResponseString>(`/depositContract/deleteDepositContract/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /depositContract/getAllDepositContract */
export async function getAllDepositContract(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllDepositContractParams,
  body: API.DepositContractDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListDepositContractDTO>('/depositContract/getAllDepositContract', {
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

/** 此处后端没有提供注释 GET /depositContract/getDepositContractById/${param0} */
export async function getDepositContractById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDepositContractByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResponseDepositContractDTO>(
    `/depositContract/getDepositContractById/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 POST /depositContract/rejectDepositContract */
export async function rejectDepositContract(
  body: API.DepositContractDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseString>('/depositContract/rejectDepositContract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /depositContract/searchDepositContract */
export async function searchDepositContract(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchDepositContractParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListDepositContractDTO>('/depositContract/searchDepositContract', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
