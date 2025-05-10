//import { useModel } from "@umijs/max";
import { useEffect, useMemo, useState } from "react";
import {useModel} from '@@/exports';

const useAmenity = (body: API.AmenityDTO = {}) => {
    const {amenityList, loadtAmenityList} = useModel('collection');
    
    useEffect(() => {
        loadtAmenityList(body);
    }, [])

    const retVal = useMemo(() => ({
        amenityRoomList: amenityList.filter(item => item.amenityType === 'AMENITY_TYPE_01'),
        amenityOtherList: amenityList.filter(item => item.amenityType === 'AMENITY_TYPE_02'),
        amenityInfoList: amenityList.filter(item => item.amenityType === 'AMENITY_TYPE_03'),
    }), [amenityList])

    return retVal
}

export default useAmenity;