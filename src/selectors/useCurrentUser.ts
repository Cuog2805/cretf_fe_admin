import {useModel} from "@@/exports";

export const useCurrentUser = (): any => {
    const { initialState } = useModel('@@initialState');
    return initialState!.currentUser! ?? {};
};