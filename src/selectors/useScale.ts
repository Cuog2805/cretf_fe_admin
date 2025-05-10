//import { useModel } from "@umijs/max";
import { useEffect, useMemo, useState } from "react";
import {useModel} from '@@/exports';

const useScale = (body: API.ScaleDTO = {}) => {
    const {scaleList, loadtScaleList} = useModel('collection');
    
    useEffect(() => {
        loadtScaleList(body);
    }, [])

    const retVal = useMemo(() => ({
        moneyScaleList: scaleList.filter(item => item.type === 'MONEY_SCALE'),
        timeScaleList: scaleList.filter(item => item.type === 'TIME_SCALE'),
        primitiveScaleList: scaleList.filter(item => item.type === 'PRIMITIVE_SCALE'),
        areaScaleList: scaleList.filter(item => item.type === 'AREA_SCALE'),
    }), [scaleList])

    return retVal
}

export default useScale;