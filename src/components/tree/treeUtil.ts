export const flatToTree = (
  dataFrom: readonly any[],
  key: string,
  parentKey: string,
  root: string | undefined | null,
) => {
  let hashTable = Object.create(null);
  dataFrom?.forEach((data) => (hashTable[data[key]] = { ...data }));
  let dataTree: any[] = [];
  dataFrom?.forEach((data) => {
    if (data[parentKey] !== root) {
      if (hashTable[data[parentKey]] && !hashTable[data[parentKey]]?.children) {
        hashTable[data[parentKey]].children = [];
      }
      hashTable[data[parentKey]]?.children?.push(hashTable[data[key]]);
    } else {
      dataTree.push(hashTable[data[key]]);
    }
  });
  return dataTree;
};

export const flatToTreeCustom = (
  dataFrom: readonly any[],
  key: string,
  parentKey: string,
  root: string | number | undefined | null,
  childrenKey: string = 'children',
): any[] => {
  const hashTable: Record<string | number, any> = {};
  const tree: any[] = [];

  dataFrom.forEach((item) => {
    hashTable[item[key]] = { ...item };
  });

  dataFrom.forEach((item) => {
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

export const treeToFlat = (tree?: readonly any[]): any[] =>
  (tree ?? []).flatMap((item: any) => {
    const { children, ...rest } = item;
    return [rest, ...treeToFlat(children || [])];
  });

export const findPathByValue = (
  tree: readonly any[],
  value: any,
  path: any[] = [],
): any[] | null => {
  for (let node of tree) {
    const newPath = [...path, node.locationId];
    if (node.locationId === value) {
      return newPath;
    }
    if (node.children) {
      const result = findPathByValue(node.children, value, newPath);
      if (result) return result;
    }
  }
  return null;
};

export const findIdAndNodeChildrenIds = (node: any): any => {
  let ids = [node.locationId];
  if (node.children) {
    for (let child of node.children) {
      ids = ids.concat(findIdAndNodeChildrenIds(child));
    }
  }
  return ids;
};

export const findNodeById = (tree: readonly any[], id: string | undefined | null): any | null => {
  for (let node of tree) {
    if (node.locationId === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};
