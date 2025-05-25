//import { useModel } from "@umijs/max";
import { useEffect, useMemo, useState } from "react";
import {useModel} from '@@/exports';

const useCategoryShareds = () => {
    const {categoryShareds, loadCategoryShareds} = useModel('collection');
    
    useEffect(() => {
        loadCategoryShareds();
    }, [])

    const retVal = useMemo(() => ({
        dmMainMenu: categoryShareds.filter(item => item.categoryType === 'MAIN_MENU'),
        dmAdminMenu: categoryShareds.filter(item => item.categoryType === 'ADMIN_MENU'),
        dmDirection: categoryShareds.filter(item => item.categoryType === 'DIRECTION'),
        dmAmenityType: categoryShareds.filter(item => item.categoryType === 'AMENITY_TYPE'),
        dmGender: categoryShareds.filter(item => item.categoryType === 'GENDER'),
    }), [categoryShareds])

    return retVal
}

export default useCategoryShareds;