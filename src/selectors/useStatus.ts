//import { useModel } from "@umijs/max";
import { useEffect, useMemo, useState } from "react";
import {useModel} from '@@/exports';

const useStatus = (body: API.StatusDTO = {}) => {
    const {statusList, loadStatusList} = useModel('collection');
    
    useEffect(() => {
        loadStatusList(body);
    }, [])

    const retVal = useMemo(() => ({
        propertyStatusList: statusList.filter(item => item.type === 'PROPERTY_STATUS'),
        userStatusList: statusList.filter(item => item.type === 'USER_STATUS'),
        transactionStatusList: statusList.filter(item => item.type === 'TRANSACTION_STATUS'),
        depositStatusList: statusList.filter(item => item.type === 'DEPOSIT_STATUS'),
    }), [statusList])

    return retVal
}

export default useStatus;