import { flatToTree } from "@/components/tree/treeUtil";
import { useModel } from "@umijs/max";
import { useEffect, useMemo } from "react";

const useLocations = (body: API.LocationDTO = {}) => {
    const {locationList, loadLocationList} = useModel('collection');
    
    useEffect(() => {
        loadLocationList();
    }, [locationList])

    const retVal = useMemo(() => ({
        locationList: locationList,
        locationTree: flatToTree(locationList, 'code', 'parentCode', null),
    }), [locationList])


    return retVal
}

export default useLocations;