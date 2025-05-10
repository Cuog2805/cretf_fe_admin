import { UNPAGED } from "@/core/constant";
import { getAllAmenities } from "@/services/apis/amenityController";
import { getAllCategoryShared } from "@/services/apis/categorySharedController";
import { getAllLocation } from "@/services/apis/locationController";
import { getAllPropertyType } from "@/services/apis/propertyTypeController";
import { getAllScale } from "@/services/apis/scaleController";
import { getAllStatus } from "@/services/apis/statusController";
import { useCallback, useRef, useState } from "react"

export default () => {
    //Danh mục CategoryShared
    const [categoryShareds, setCategoryShareds] = useState<API.CategorySharedDTO[]>([]);
    const isLoadedCategoryShared = useRef<boolean>(false);
    const loadCategoryShareds = useCallback((body?: API.CategorySharedDTO) => {
        if(!isLoadedCategoryShared.current) {
            isLoadedCategoryShared.current = true;
            getAllCategoryShared(body ?? {}).then(resp => {
                setCategoryShareds(resp ?? []);
            })
        }
    }, [])

    //Danh mục Status
    const [statusList, setStatusList] = useState<API.StatusDTO[]>([]);
    const isLoadedStatusList = useRef<boolean>(false);
    const loadStatusList = useCallback((body?: API.StatusDTO) => {
        if(!isLoadedStatusList.current) {
            isLoadedStatusList.current = true;
            getAllStatus(UNPAGED, body ?? {}).then(resp => {
                setStatusList(resp.content ?? []);
            })
        }
    }, [])

    //Danh mục Scale
    const [scaleList, setScaleList] = useState<API.ScaleDTO[]>([]);
    const isLoadedtScaleList = useRef<boolean>(false);
    const loadtScaleList = useCallback((body?: API.ScaleDTO) => {
        if(!isLoadedtScaleList.current) {
            isLoadedtScaleList.current = true;
            getAllScale(UNPAGED, body ?? {}).then(resp => {
                setScaleList(resp.data ?? []);
            })
        }
    }, [])

    //Danh mục Amenity
    const [amenityList, setAmenityList] = useState<API.AmenityDTO[]>([]);
    const isLoadedtAmenityList = useRef<boolean>(false);
    const loadtAmenityList = useCallback((body?: API.AmenityDTO) => {
        if(!isLoadedtAmenityList.current) {
            isLoadedtAmenityList.current = true;
            getAllAmenities(body ?? {}).then(resp => {
                setAmenityList(resp.data ?? []);
            })
        }
    }, [])

    //Danh mục PropertyType
    const [propertyTypeList, setPropertyTypeList] = useState<API.PropertyTypeDTO[]>([]);
    const isLoadedPropertyTypeList = useRef<boolean>(false);
    const loadPropertyTypeList = useCallback(() => {
        if(!isLoadedPropertyTypeList.current) {
            isLoadedPropertyTypeList.current = true;
            getAllPropertyType().then(resp => {
                setPropertyTypeList(resp?.data ?? []);
            })
        }
    }, [])

    //Danh mục Location
    const [locationList, setLocationList] = useState<API.LocationDTO[]>([]);
    const isLoadedLocationList = useRef<boolean>(false);
    const loadLocationList = useCallback(() => {
        if(!isLoadedLocationList.current) {
            isLoadedLocationList.current = true;
            getAllLocation().then(resp => {
                setLocationList(resp?.data ?? []);
            })
        }
    }, [])

    return {
        categoryShareds, loadCategoryShareds,
        statusList, loadStatusList,
        scaleList, loadtScaleList,
        amenityList, loadtAmenityList,
        propertyTypeList, loadPropertyTypeList,
        locationList, loadLocationList,
    }
}