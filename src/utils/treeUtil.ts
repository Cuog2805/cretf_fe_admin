export const flatToTree = (dataFrom: readonly any[], key: string, parentKey: string, root : string | undefined | null) => {
    let hashTable = Object.create(null)
    dataFrom?.forEach(data => hashTable[data[key]] = {...data})
    let dataTree: any[] = [];
    dataFrom?.forEach(data => {
        if (data[parentKey] !== root) {
            if (hashTable[data[parentKey]] && !hashTable[data[parentKey]]?.children) {
                hashTable[data[parentKey]].children = [];
            }
            hashTable[data[parentKey]]?.children?.push(hashTable[data[key]]);
        } else {
            dataTree.push(hashTable[data[key]])
        }
    })
    return dataTree;
}

export const flatToTreeCustom = (
    dataFrom: readonly any[],
    key: string,
    parentKey: string,
    root: string | number | undefined | null,
    childrenKey: string = "children"
): any[] => {
    const hashTable: Record<string | number, any> = {};
    const tree: any[] = [];

    dataFrom.forEach(item => {
        hashTable[item[key]] = { ...item };
    });

    dataFrom.forEach(item => {
        const current = hashTable[item[key]];
        const parent = hashTable[item[parentKey]];

        if (item[parentKey] !== root && parent) {
            if (!parent[childrenKey]) {
                parent[childrenKey] = [];
            }
            parent[childrenKey].push(current);
        } else {
            tree.push(current);
        }
    });

    return tree;
};


export const treeToFlat = (tree?: readonly any[]): any[] => (tree ?? []).flatMap((item: any) => {
    const {children, ...rest} = item;
    return [
        rest,
        ...treeToFlat(children || [])
    ]
}
);