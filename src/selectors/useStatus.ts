//import { useModel } from "@umijs/max";
import { useEffect, useMemo, useState } from "react";
import {useModel} from '@@/exports';

const useStatus = (body: API.StatusDTO = {}) => {
    const {statusList, loadStatusList} = useModel('collection');
    
    useEffect(() => {
        loadStatusList(body);
    }, [])

    const retVal = useMemo(() => ({
        propertyStatusList: statusList,
        propertySoldStatusList: statusList.filter(item => item.type === 'PROPERTY_SOLD_STATUS'),
        propertyRentStatusList: statusList.filter(item => item.type === 'PROPERTY_RENT_STATUS'),
        userStatusList: statusList.filter(item => item.type === 'USER_STATUS'),
        transactionStatusList: statusList.filter(item => item.type === 'TRANSACTION_STATUS'),
        depositStatusList: statusList.filter(item => item.type === 'DEPOSIT_STATUS'),
        appointmentStatusList: statusList.filter(item => item.type === 'APPOINTMENT_STATUS'),
    }), [statusList])

    return retVal
}

export default useStatus;