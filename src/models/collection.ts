import { UNPAGED } from "@/core/constant";
import { getAllCategoryShared } from "@/services/apis/categorySharedController";
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

    return {
        categoryShareds, loadCategoryShareds,
        statusList, loadStatusList
    }
}