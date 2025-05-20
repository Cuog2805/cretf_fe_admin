// hooks/usePagination.ts - Hook phân trang và sắp xếp
import { useCallback, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SorterResult } from "antd/es/table/interface";

declare type PaginationType = {
    page?: number,
    size?: number,
    sort?: string;
    dontUseParam?: boolean // = true nếu muốn thay đổi Pagination mà k cập nhật param trên url
}

const defaultState: PaginationType = {
    page: 1,
    size: 10,
    dontUseParam: false
}

const convertSearchParamsToObject = (searchParams: any): { [key: string]: string } => {
    const params: any = {};
    for (let [key, value] of searchParams.entries()) {
        params[key] = value;
    }
    return params;
}

const usePagination = (initialState?: PaginationType) => {
    const defaultPageSize = useRef<number>(10);
    const defaultSort = useRef<string | undefined>(initialState?.sort);
    const [searchParams, setSearchParams] = useSearchParams(window.location.search);
    const initState = (): PaginationType => {
        const initValue: PaginationType = {
            page: initialState?.page ?? defaultState.page,
            size: initialState?.size ?? defaultState.size,
            sort: initialState?.sort
        };
        defaultPageSize.current = initValue.size!;

        if(!initialState?.dontUseParam) {
            const queryPage = searchParams.get('page');
            const querySize = searchParams.get('size');
            const querySort = searchParams.get('sort');

            if (queryPage) {
                initValue.page = +queryPage
            }
            if (querySize) {
                initValue.size = +querySize
            }
            if (querySort) {
                initValue.sort = querySort;
            }
        }
        return initValue;
    }
    const [pagination, setPagination] = useState<PaginationType>(initState());

    const onChangePagination = useCallback((page: number, size: number) => {
        setPagination(prev => {
            const newPagination: PaginationType = {...prev, page, size}

            if(!initialState?.dontUseParam) {
                const params = convertSearchParamsToObject(new URLSearchParams(window.location.search));
                if (newPagination.page !== 1) {
                    params['page'] = newPagination.page + "";
                } else {
                    searchParams.delete("page");
                    delete params['page'];
                }
                if (newPagination.size !== defaultPageSize.current) {
                    params['size'] = newPagination.size + "";
                } else {
                    delete params['size'];
                }

                setSearchParams(params)
            }
            return newPagination;
        })
    }, [searchParams, initialState?.dontUseParam, setSearchParams])

    const onResetPage = useCallback(() => {
        setPagination(prev => {
            const newPagination: PaginationType = {...prev, page: 1}
            if(!initialState?.dontUseParam) {
                const params = convertSearchParamsToObject(new URLSearchParams(window.location.search));
                delete params['page'];
                delete params['size'];
                setSearchParams(params)
            }
            return newPagination;
        })
    }, [searchParams, initialState?.dontUseParam, setSearchParams])

    const paginationQuery = useMemo(() => ({
        page: (pagination.page ?? 1) - 1,
        size: pagination.size ?? 10,
        sort: pagination.sort ? pagination.sort : undefined
    }), [pagination]);

    const paginationProps = useMemo(() => ({
        current: pagination.page,
        pageSize: pagination.size,

        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: onChangePagination,
    }), [pagination, onChangePagination]);

    const onChange = (pagination: any, filters: any, sorter: SorterResult<any> | SorterResult<any>[]) => {
        setPagination(prev => {
            const firstSort: SorterResult<any> = sorter instanceof Array ? sorter[0] : sorter;
            const {field, columnKey, order} = firstSort;
            const columnName = columnKey ?? field;

            let sort = undefined;
            if(!initialState?.dontUseParam) {
                const params = convertSearchParamsToObject(new URLSearchParams(window.location.search));
                if (columnName && order) {
                    sort = `${columnName},${order === 'ascend' ? 'asc' : 'desc'}`;
                    if (field !== defaultSort.current) {
                        params['sort'] = sort;
                    } else {
                        delete params['sort'];
                    }
                } else {
                    delete params['sort'];
                }
                setSearchParams(params)
            } else {
                if (columnName) {
                    sort = `${columnName},${order === 'ascend' ? 'asc' : 'desc'}`;
                }
            }
            sort = sort ?? defaultSort.current;
            return {...prev, sort: sort}
        })
    }

    const tableProps = useCallback((total?: number) => ({
        pagination: {
            current: pagination.page,
            pageSize: pagination.size,

            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: onChangePagination,
            total: total ?? 0,
            locale: {
                items_per_page: '/ trang',
            },
            showTotal: (total: number) => total === 0 ? `` : `Số lượng: ${total}`
        },
        onChange: onChange
    }), [pagination, onChangePagination]);

    return {paginationQuery, onChangePagination, paginationProps, onResetPage, tableProps}
}

export default usePagination;