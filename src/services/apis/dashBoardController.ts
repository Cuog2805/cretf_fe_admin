// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /dashboard/getPriceTrendOverTime */
export async function getPriceTrendOverTime(
  body: API.DashBoardDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListDashBoardDTO>('/dashboard/getPriceTrendOverTime', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /dashboard/getPropertyTypeStatic */
export async function getPropertyTypeStatic(
  body: API.DashBoardDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListDashBoardDTO>('/dashboard/getPropertyTypeStatic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /dashboard/getSummaryPriceAvarageLocation */
export async function getSummaryPriceAvarageLocation(
  body: API.DashBoardDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListDashBoardDTO>('/dashboard/getSummaryPriceAvarageLocation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /dashboard/getSummaryPriceRange */
export async function getSummaryPriceRange(
  body: API.DashBoardDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListDashBoardDTO>('/dashboard/getSummaryPriceRange', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /dashboard/getSummaryTotalStat */
export async function getSummaryTotalStat(
  body: API.DashBoardDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListDashBoardDTO>('/dashboard/getSummaryTotalStat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /dashboard/getSummaryTransaction */
export async function getSummaryTransaction(
  body: API.DashBoardDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListDashBoardDTO>('/dashboard/getSummaryTransaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /dashboard/getTopTransactionRegions */
export async function getTopTransactionRegions(
  body: API.DashBoardDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListDashBoardDTO>('/dashboard/getTopTransactionRegions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
