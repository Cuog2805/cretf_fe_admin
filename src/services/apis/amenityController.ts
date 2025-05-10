// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /amenity/getAllAmenities */
export async function getAllAmenities(body: API.AmenityDTO, options?: { [key: string]: any }) {
  return request<API.ResponseListAmenityDTO>('/amenity/getAllAmenities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /amenity/getAllPropertyAmenities */
export async function getAllPropertyAmenities(
  body: API.AmenityDTO,
  options?: { [key: string]: any },
) {
  return request<API.ResponseListAmenityDTO>('/amenity/getAllPropertyAmenities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
