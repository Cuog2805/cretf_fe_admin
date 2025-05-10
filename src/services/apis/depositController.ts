// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /deposit/getAllDeposits */
export async function getAllDeposits(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllDepositsParams,
  body: API.DepositDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListDepositDTO>('/deposit/getAllDeposits', {
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

/** 此处后端没有提供注释 GET /deposit/getDepositsById/${param0} */
export async function getDepositsById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDepositsByIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResponseDepositDTO>(`/deposit/getDepositsById/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
