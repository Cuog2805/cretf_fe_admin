//import { useModel } from "@umijs/max";
import { useEffect, useMemo, useState } from "react";
import {useModel} from '@@/exports';

const useRole = (body: API.RoleDTO = {}) => {
    const {roleList, loadRoleList} = useModel('collection');
    
    useEffect(() => {
        loadRoleList(body);
    }, [])

    return {roleList}
}

export default useRole;