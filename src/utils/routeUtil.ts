export const buildRoutesFromDB = (
    dataFrom: readonly any[],
    key: string,
    parentKey: string,
    root: string | undefined | null
): any[] => {
    const fieldsToKeep = ['path', 'name', 'icon', 'component', 'access'];
    const hashTable: Record<string | number, any> = {};
    const routeTree: any[] = [];

    //Lọc chỉ giữ các field cần
    dataFrom.forEach(item => {
        const filteredItem = fieldsToKeep.reduce((obj, field) => {
            if (item[field] !== undefined) obj[field] = item[field];
            return obj;
        }, {} as any);

        hashTable[item[key]] = filteredItem;
    });

    //Xây dựng cây với routers
    dataFrom.forEach(item => {
        const current = hashTable[item[key]];
        const parent = hashTable[item[parentKey]];

        if (item[parentKey] !== root && parent) {
            if (!parent.routers) {
                parent.routers = [];
            }
            parent.routers.push(current);
        } else {
            routeTree.push(current);
        }
    });

    return routeTree;
};

export const mergeRoutes = (staticRoutes: any[], dynamicRoutes: any[]) => {
    const mergedRoutes = [...staticRoutes, ...dynamicRoutes];
    console.log('mergedRoutes', mergedRoutes)
    return [
      {
        path: '/',
        layout: true,
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          ...staticRoutes, // Các route tĩnh
          ...dynamicRoutes, // Các route động
        ],
      },
    ];
  };
  