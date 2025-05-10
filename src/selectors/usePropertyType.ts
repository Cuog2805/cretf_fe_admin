import { useModel } from "@umijs/max";
import { useEffect, useMemo } from "react";

const usePropertyType = (body: API.PropertyTypeDTO = {}) => {
    const {propertyTypeList, loadPropertyTypeList} = useModel('collection');
    
    useEffect(() => {
        loadPropertyTypeList();
    }, [])


    return {propertyTypeList}
}

export default usePropertyType;